import AsyncStorage from '@react-native-async-storage/async-storage';
import { EstadoCuadramos, GUEST_USER_ID } from '../../types';
import { getDatabase, IDatabase } from './databaseAdapter';
import { MIGRATIONS_SQL } from './schema';

const LEGACY_STORAGE_KEY = '@cuadramos/state-v1';
const MIGRATION_DONE_KEY = '@cuadramos/sqlite_migrated-v1';
const SCHEMA_V2_KEY = '@cuadramos/sqlite_schema_v2_done';

/**
 * Ejecuta migraciones incrementales sobre SQLite para añadir las columnas
 * user_id, sync_status y updated_at sin perder registros existentes.
 */
export const runSQLiteSchemaMigrations = async (customDb?: IDatabase): Promise<void> => {
  try {
    const isV2Done = await AsyncStorage.getItem(SCHEMA_V2_KEY);
    if (isV2Done === 'true') {
      return;
    }

    const db = customDb ?? (await getDatabase());
    for (const sql of MIGRATIONS_SQL) {
      try {
        await db.execute(sql);
      } catch {
        // Ignorar errores si la columna ya existe en la tabla (ej. duplicate column name)
      }
    }

    await AsyncStorage.setItem(SCHEMA_V2_KEY, 'true');
  } catch {
    // Continuar sin bloquear la app
  }
};

export const migrateFromAsyncStorageToSQLite = async (): Promise<boolean> => {
  try {
    const isMigrated = await AsyncStorage.getItem(MIGRATION_DONE_KEY);
    if (isMigrated === 'true') {
      await runSQLiteSchemaMigrations();
      return false;
    }

    const raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      await AsyncStorage.setItem(MIGRATION_DONE_KEY, 'true');
      await runSQLiteSchemaMigrations();
      return false;
    }

    const parsed = JSON.parse(raw) as Partial<EstadoCuadramos>;
    const db = await getDatabase();

    await db.transaction(async tx => {
      // 1. Migrar Jornadas
      if (parsed.jornadas && Array.isArray(parsed.jornadas)) {
        for (const j of parsed.jornadas) {
          await tx.execute(
            `INSERT OR REPLACE INTO jornadas (id, user_id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre, sync_status, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              j.id,
              j.userId ?? GUEST_USER_ID,
              j.saldoInicial,
              j.estado,
              j.fechaHoraApertura,
              j.fechaHoraCierre ?? null,
              j.syncStatus ?? 'PENDING',
              j.updatedAt ?? '',
            ],
          );
        }
      }

      // 2. Migrar Movimientos
      if (parsed.movimientos && Array.isArray(parsed.movimientos)) {
        for (const m of parsed.movimientos) {
          await tx.execute(
            `INSERT OR REPLACE INTO movimientos (id, user_id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion, fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago, sync_status, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              m.id,
              m.userId ?? GUEST_USER_ID,
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
              m.syncStatus ?? 'PENDING',
              m.updatedAt ?? '',
            ],
          );
        }
      }

      // 3. Migrar Eventos de Pago
      if (parsed.eventosPago && Array.isArray(parsed.eventosPago)) {
        for (const e of parsed.eventosPago) {
          await tx.execute(
            `INSERT OR REPLACE INTO eventos_pago (id_operacion, user_id, monto, concepto, origen_referencia, tipo_evento, estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id, sync_status, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              e.idOperacion,
              e.userId ?? GUEST_USER_ID,
              e.monto,
              e.concepto,
              e.origenReferencia,
              e.tipoEvento,
              e.estado,
              e.fechaHoraEvento,
              e.fechaHoraProcesamiento ?? null,
              e.jornadaId,
              e.syncStatus ?? 'PENDING',
              e.updatedAt ?? '',
            ],
          );
        }
      }
    });

    await AsyncStorage.setItem(MIGRATION_DONE_KEY, 'true');
    await runSQLiteSchemaMigrations(db);
    return true;
  } catch {
    // Si la migración falla, continuar sin bloquear la app
    return false;
  }
};
