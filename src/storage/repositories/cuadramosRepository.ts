import AsyncStorage from '@react-native-async-storage/async-storage';
import { EstadoCuadramos } from '../../types';
import { getDatabase } from '../database/databaseAdapter';
import { jornadaSqliteRepository } from './jornadaSqliteRepository';
import { movimientoSqliteRepository } from './movimientoSqliteRepository';
import { eventoPagoSqliteRepository } from './eventoPagoSqliteRepository';

const LEGACY_STORAGE_KEY = '@cuadramos/state-v1';

export const loadState = async (): Promise<EstadoCuadramos> => {
  try {
    const [jornadas, movimientos, eventosPago] = await Promise.all([
      jornadaSqliteRepository.getAllJornadas(),
      movimientoSqliteRepository.getAllMovimientos(),
      eventoPagoSqliteRepository.getAllEventosPago(),
    ]);

    if (jornadas.length > 0 || movimientos.length > 0 || eventosPago.length > 0) {
      return { jornadas, movimientos, eventosPago };
    }

    // Fallback retrocompatible con AsyncStorage si SQLite está vacío
    const raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<EstadoCuadramos>;
      const legacyState: EstadoCuadramos = {
        jornadas: parsed.jornadas ?? [],
        movimientos: parsed.movimientos ?? [],
        eventosPago: parsed.eventosPago ?? [],
      };
      if (legacyState.jornadas.length > 0) {
        await saveState(legacyState).catch(() => {});
      }
      return legacyState;
    }

    return { jornadas: [], movimientos: [], eventosPago: [] };
  } catch {
    return { jornadas: [], movimientos: [], eventosPago: [] };
  }
};

export const saveState = async (state: EstadoCuadramos): Promise<void> => {
  const db = await getDatabase();
  await db.transaction(async tx => {
    // 1. Jornadas
    await tx.execute('DELETE FROM jornadas;');
    for (const j of state.jornadas) {
      await jornadaSqliteRepository.insertJornada(j, tx);
    }

    // 2. Movimientos
    await tx.execute('DELETE FROM movimientos;');
    for (const m of state.movimientos) {
      await movimientoSqliteRepository.insertMovimiento(m, tx);
    }

    // 3. Eventos de Pago
    await tx.execute('DELETE FROM eventos_pago;');
    for (const e of state.eventosPago) {
      await eventoPagoSqliteRepository.insertEventoPago(e, tx);
    }
  });

  await AsyncStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(state)).catch(() => {});
};

export const clearState = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execute('DELETE FROM movimientos;');
  await db.execute('DELETE FROM eventos_pago;');
  await db.execute('DELETE FROM jornadas;');
  await AsyncStorage.removeItem(LEGACY_STORAGE_KEY).catch(() => {});
};
