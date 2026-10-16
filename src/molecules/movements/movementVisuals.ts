import { Colors } from '../../theme';
import { IconName } from '../../atoms';
import { TipoMovimiento } from '../../types';

export interface TipoVisual {
  icon: IconName;
  color: string;
  background: string;
}

/**
 * Fuente única de ícono y color por tipo de movimiento.
 * Se usa en Inicio (acciones rápidas) y en las tarjetas para que
 * "Ingreso" y "Gasto" se vean siempre igual en toda la app.
 */
export const getTipoVisual = (tipo: TipoMovimiento): TipoVisual => {
  if (tipo === 'INGRESO') {
    return { icon: 'arrowUp', color: Colors.green, background: Colors.greenLight };
  }
  return { icon: 'arrowDown', color: Colors.red, background: Colors.redLight };
};

export type DiferenciaTone = 'success' | 'warning' | 'danger';

export interface DiferenciaEstado {
  label: 'Cuadrado' | 'Sobra' | 'Falta';
  tone: DiferenciaTone;
  color: string;
  background: string;
}

/**
 * Estado real de la diferencia de caja (saldo real − saldo esperado).
 * 0 = cuadrado · > 0 = sobra · < 0 = falta.
 */
export const getDiferenciaEstado = (diferencia: number): DiferenciaEstado => {
  const safe = Number.isFinite(diferencia) ? diferencia : 0;

  if (safe > 0) {
    return {
      label: 'Sobra',
      tone: 'warning',
      color: Colors.accentInk,
      background: Colors.warningSoft,
    };
  }

  if (safe < 0) {
    return {
      label: 'Falta',
      tone: 'danger',
      color: Colors.danger,
      background: Colors.dangerSoft,
    };
  }

  return {
    label: 'Cuadrado',
    tone: 'success',
    color: Colors.success,
    background: Colors.successSoft,
  };
};
