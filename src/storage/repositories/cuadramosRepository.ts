import AsyncStorage from '@react-native-async-storage/async-storage';
import { EstadoCuadramos } from '../../types';

const STORAGE_KEY = '@cuadramos/state-v1';
const emptyState: EstadoCuadramos = { jornadas: [], movimientos: [], eventosPago: [] };

export const loadState = async (): Promise<EstadoCuadramos> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState;
  try {
    const parsed = JSON.parse(raw) as Partial<EstadoCuadramos>;
    return { jornadas: parsed.jornadas ?? [], movimientos: parsed.movimientos ?? [], eventosPago: parsed.eventosPago ?? [] };
  } catch {
    return emptyState;
  }
};

export const saveState = (state: EstadoCuadramos): Promise<void> => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));

export const clearState = (): Promise<void> => AsyncStorage.removeItem(STORAGE_KEY);
