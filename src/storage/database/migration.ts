import AsyncStorage from '@react-native-async-storage/async-storage';
import { EstadoCuadramos } from '../../types';
import { getDatabase } from './databaseAdapter';

const LEGACY_STORAGE_KEY = '@cuadramos/state-v1';
const MIGRATION_DONE_KEY = '@cuadramos/sqlite_migrated-v1';

export const migrateFromAsyncStorageToSQLite = async (): Promise<boolean> => {
  try {
    const isMigrated = await AsyncStorage.getItem(MIGRATION_DONE_KEY);
    if (isMigrated === 'true') {
      return false;
    }

    const raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(MIGRATION_DONE_KEY, 'true');
      return false;
    }

    const parsed = JSON.parse(raw) as Partial<EstadoCuadramos>;
    const db = await getDatabase();

    await db.transaction(async tx => {
      // 1. Migrar Jornadas
      if (parsed.jornadas && Array.isArray(parsed.jornadas)) {
        for (const j of parsed.jornadas) {
          await tx.execute(
            `INSERT OR REPLACE INTO jornadas (id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre)
             VALUES (?, ?, ?, ?, ?);`,
            [j.id, j.saldoInicial, j.estado, j.fechaHoraApertura, j.fechaHoraCierre ?? null],
          );
        }
      }

      // 2. Migrar Movimientos
      if (parsed.movimientos && Array.isArray(parsed.movimientos)) {
        for (const m of parsed.movimientos) {
          await tx.execute(
            `INSERT OR REPLACE INTO movimientos (id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion, fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              m.id,
              m.tipo,
              m.origen,
              m.monto,
              m.concepto,
              m.categoria ?? null,
              m.metodoPago ?? null,
              m.descripcion ?? null,
              m.fechaHoraOrigen,
              m.horaLegible ?? null,
              m.fechaLegible ?? null,
              m.jornadaId,
              m.referenciaEventoPago ?? null,
            ],
          );
        }
      }

      // 3. Migrar Eventos de Pago
      if (parsed.eventosPago && Array.isArray(parsed.eventosPago)) {
        for (const e of parsed.eventosPago) {
          await tx.execute(
            `INSERT OR REPLACE INTO eventos_pago (id_operacion, monto, concepto, origen_referencia, tipo_evento, estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              e.idOperacion,
              e.monto,
              e.concepto,
              e.origenReferencia,
              e.tipoEvento,
              e.estado,
              e.fechaHoraEvento,
              e.fechaHoraProcesamiento ?? null,
              e.jornadaId,
            ],
          );
        }
      }
    });

    await AsyncStorage.setItem(MIGRATION_DONE_KEY, 'true');
    return true;
  } catch {
    // Si la migración falla, continuar sin bloquear la app
    return false;
  }
};
