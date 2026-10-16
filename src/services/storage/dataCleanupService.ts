import AsyncStorage from '@react-native-async-storage/async-storage';
import { GUEST_USER_ID } from '../../types';
import {
  getDatabase,
  IDatabase,
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
  boxHistoryRepository,
  syncQueueRepository,
} from '../../storage';

const LEGACY_STORAGE_KEY = '@cuadramos/state-v1';
const BOX_HISTORY_KEY = '@cuadramos/box_history-v1';
const SUPPRESS_AUTO_PULL_KEY_PREFIX = '@cuadramos/suppress_auto_pull:';

export interface OperationalDataSummary {
  movimientosCount: number;
  jornadasCount: number;
  eventosCount: number;
  cajasCount: number;
  pendingSyncCount: number;
  hasOpenJornada: boolean;
  isGuest: boolean;
}

export interface CleanOperationalDataResult {
  success: boolean;
  deletedCounts: {
    movimientos: number;
    eventosPago: number;
    historialCajas: number;
    jornadas: number;
    syncQueue: number;
  };
  error?: string;
}

export const dataCleanupService = {
  /**
   * Obtiene un resumen cuantitativo de los datos operativos locales para advertir al usuario antes de borrar.
   */
  async getOperationalDataSummary(userId: string, tx?: IDatabase): Promise<OperationalDataSummary> {
    const targetUserId = userId || GUEST_USER_ID;

    try {
      const [movs, jor, eventos, cajas, queueItems, activeJor] = await Promise.all([
        movimientoSqliteRepository.getAllMovimientos(targetUserId, tx),
        jornadaSqliteRepository.getAllJornadas(targetUserId, tx),
        eventoPagoSqliteRepository.getAllEventosPago(targetUserId, tx),
        boxHistoryRepository.loadBoxHistory(targetUserId, tx),
        syncQueueRepository.getPendingItems(targetUserId, 100, tx),
        jornadaSqliteRepository.getActiveJornada(targetUserId, tx),
      ]);

      return {
        movimientosCount: movs.length,
        jornadasCount: jor.length,
        eventosCount: eventos.length,
        cajasCount: cajas.length,
        pendingSyncCount: queueItems.length,
        hasOpenJornada: Boolean(activeJor && activeJor.estado === 'ABIERTA'),
        isGuest: targetUserId === GUEST_USER_ID,
      };
    } catch {
      return {
        movimientosCount: 0,
        jornadasCount: 0,
        eventosCount: 0,
        cajasCount: 0,
        pendingSyncCount: 0,
        hasOpenJornada: false,
        isGuest: targetUserId === GUEST_USER_ID,
      };
    }
  },

  /**
   * Elimina de forma atómica y consistente los datos operativos locales para el usuario especificado.
   * NO borra cuentas, tokens de autenticación, perfil ni preferencias de accesibilidad.
   */
  async cleanLocalOperationalData(userId: string, customDb?: IDatabase): Promise<CleanOperationalDataResult> {
    const targetUserId = userId || GUEST_USER_ID;
    const db = customDb ?? (await getDatabase());

    try {
      let movsDeleted = 0;
      let eventosDeleted = 0;
      let cajasDeleted = 0;
      let jorDeleted = 0;
      let syncQueueDeleted = 0;

      await db.transaction(async tx => {
        // 1. Eliminar movimientos respetando claves foráneas hacia jornadas
        const movsRes = await tx.execute('DELETE FROM movimientos WHERE user_id = ?;', [targetUserId]);
        movsDeleted = movsRes.rowsAffected || 0;

        // 2. Eliminar eventos de pago
        const eventosRes = await tx.execute('DELETE FROM eventos_pago WHERE user_id = ?;', [targetUserId]);
        eventosDeleted = eventosRes.rowsAffected || 0;

        // 3. Eliminar historial de cajas
        const cajasRes = await tx.execute('DELETE FROM historial_cajas WHERE user_id = ?;', [targetUserId]);
        cajasDeleted = cajasRes.rowsAffected || 0;

        // 4. Eliminar jornadas
        const jorRes = await tx.execute('DELETE FROM jornadas WHERE user_id = ?;', [targetUserId]);
        jorDeleted = jorRes.rowsAffected || 0;

        // 5. Eliminar cola de sincronización de este usuario para que no recree datos
        const queueRes = await tx.execute('DELETE FROM sync_queue WHERE user_id = ?;', [targetUserId]);
        syncQueueDeleted = queueRes.rowsAffected || 0;
      });

      // 6. Eliminar copias de respaldo legacy en AsyncStorage que podrían rehidratar SQLite
      await AsyncStorage.removeItem(LEGACY_STORAGE_KEY).catch(() => {});
      await AsyncStorage.removeItem(BOX_HISTORY_KEY).catch(() => {});

      // 7. Si el usuario está registrado, marcar bandera para suprimir re-descarga automática no deseada desde la nube
      if (targetUserId !== GUEST_USER_ID) {
        await AsyncStorage.setItem(`${SUPPRESS_AUTO_PULL_KEY_PREFIX}${targetUserId}`, 'true').catch(() => {});
      }

      return {
        success: true,
        deletedCounts: {
          movimientos: movsDeleted,
          eventosPago: eventosDeleted,
          historialCajas: cajasDeleted,
          jornadas: jorDeleted,
          syncQueue: syncQueueDeleted,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        deletedCounts: {
          movimientos: 0,
          eventosPago: 0,
          historialCajas: 0,
          jornadas: 0,
          syncQueue: 0,
        },
        error: error?.message || 'Error al ejecutar la limpieza de datos operativos.',
      };
    }
  },

  /**
   * Verifica si la descarga automática desde la nube debe omitirse porque el usuario limpió sus datos locales.
   */
  async isAutoPullSuppressed(userId: string): Promise<boolean> {
    if (!userId || userId === GUEST_USER_ID) return false;
    try {
      const val = await AsyncStorage.getItem(`${SUPPRESS_AUTO_PULL_KEY_PREFIX}${userId}`);
      return val === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Restablece la supresión de descarga automática (p. ej. si el usuario solicita explícitamente restaurar desde la nube).
   */
  async resetAutoPullSuppression(userId: string): Promise<void> {
    if (!userId || userId === GUEST_USER_ID) return;
    try {
      await AsyncStorage.removeItem(`${SUPPRESS_AUTO_PULL_KEY_PREFIX}${userId}`);
    } catch {}
  },
};
