import AsyncStorage from '@react-native-async-storage/async-storage';
import { GUEST_USER_ID } from '../../types';
import {
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
  boxHistoryRepository,
} from '../../storage';
import { authService } from '../auth/authService';

const SYNC_DECISION_KEY_PREFIX = '@cuadramos/sync_decision:';

export interface SyncDecision {
  decision: 'synced' | 'dismissed';
  decidedAt: string;
  guestSnapshotCount: number;
}

export interface GuestDataSummary {
  totalCount: number;
  jornadasCount: number;
  movimientosCount: number;
  eventosCount: number;
  cajasCount: number;
  hasOpenJornada: boolean;
}

export const syncDecisionService = {
  /**
   * Obtiene la decisión de sincronización previamente guardada para este usuario.
   */
  async getSyncDecision(userId: string): Promise<SyncDecision | null> {
    if (!userId || userId === GUEST_USER_ID) return null;
    try {
      const raw = await AsyncStorage.getItem(`${SYNC_DECISION_KEY_PREFIX}${userId}`);
      if (!raw) return null;
      return JSON.parse(raw) as SyncDecision;
    } catch {
      return null;
    }
  },

  /**
   * Registra de forma persistente la decisión de vinculación ('synced' o 'dismissed')
   * junto al recuento de registros locales existentes en ese momento.
   */
  async saveSyncDecision(
    userId: string,
    decision: 'synced' | 'dismissed',
    guestSnapshotCount: number,
  ): Promise<void> {
    if (!userId || userId === GUEST_USER_ID) return;
    try {
      const payload: SyncDecision = {
        decision,
        decidedAt: new Date().toISOString(),
        guestSnapshotCount,
      };
      await AsyncStorage.setItem(`${SYNC_DECISION_KEY_PREFIX}${userId}`, JSON.stringify(payload));
    } catch {
      // Ignorar errores en AsyncStorage
    }
  },

  /**
   * Obtiene el conteo consolidado de registros pertenecientes a modo invitado.
   */
  async getGuestDataSummary(): Promise<GuestDataSummary> {
    try {
      const [jornadas, movs, eventos, cajas] = await Promise.all([
        jornadaSqliteRepository.getAllJornadas(GUEST_USER_ID),
        movimientoSqliteRepository.getAllMovimientos(GUEST_USER_ID),
        eventoPagoSqliteRepository.getAllEventosPago(GUEST_USER_ID),
        boxHistoryRepository.loadBoxHistory(GUEST_USER_ID),
      ]);

      const hasOpenJornada = jornadas.some(j => j.estado === 'ABIERTA');
      const totalCount = jornadas.length + movs.length + eventos.length + cajas.length;

      return {
        totalCount,
        jornadasCount: jornadas.length,
        movimientosCount: movs.length,
        eventosCount: eventos.length,
        cajasCount: cajas.length,
        hasOpenJornada,
      };
    } catch {
      return {
        totalCount: 0,
        jornadasCount: 0,
        movimientosCount: 0,
        eventosCount: 0,
        cajasCount: 0,
        hasOpenJornada: false,
      };
    }
  },

  /**
   * Determina si el aviso de sincronización debe presentarse, aplicando las 8 reglas:
   * 1. Solo para usuarios autenticados.
   * 2. Si no hay datos locales de invitado, no muestra.
   * 3. Si ya decidió sincronizar, no muestra.
   * 4. Si decidió "Ahora no", no vuelve a mostrar a menos que aparezcan NUEVOS datos de invitado.
   */
  async shouldShowSyncPrompt(userId: string): Promise<boolean> {
    if (!userId || userId === GUEST_USER_ID) return false;

    const summary = await this.getGuestDataSummary();
    if (summary.totalCount === 0) return false;

    const pastDecision = await this.getSyncDecision(userId);
    if (!pastDecision) {
      // Primera vez: existen datos locales y no se ha tomado una decisión para esta cuenta
      return true;
    }

    if (pastDecision.decision === 'synced') {
      return false;
    }

    if (pastDecision.decision === 'dismissed') {
      // Regla 6: Solo preguntar de nuevo si se agregaron nuevos registros de invitado desde la última decisión
      return summary.totalCount > pastDecision.guestSnapshotCount;
    }

    return false;
  },

  /**
   * Ejecuta la decisión seleccionada por el usuario.
   */
  async executeSyncDecision(
    userId: string,
    decision: 'synced' | 'dismissed',
  ): Promise<{ success: boolean; migratedCount: number; error?: string }> {
    if (!userId || userId === GUEST_USER_ID) {
      return { success: false, migratedCount: 0, error: 'Usuario no autenticado' };
    }

    const summary = await this.getGuestDataSummary();

    if (decision === 'dismissed') {
      // Registrar decisión "Ahora no" y cerrar sin tocar datos locales
      await this.saveSyncDecision(userId, 'dismissed', summary.totalCount);
      return { success: true, migratedCount: 0 };
    }

    try {
      // Registrar decisión "Sincronizar datos"
      await this.saveSyncDecision(userId, 'synced', summary.totalCount);

      // Ejecutar la migración real hacia la cuenta del usuario
      const { total } = await authService.importGuestDataToUser(userId);

      return { success: true, migratedCount: total };
    } catch (err: any) {
      // Conservar datos y decisión ante errores de conexión/técnicos
      return {
        success: false,
        migratedCount: 0,
        error: err?.message || 'Error al sincronizar datos locales.',
      };
    }
  },
};

