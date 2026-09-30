import { Balance, Movimiento } from '../../types';

export const validateAmount = (amount: number): boolean => Number.isFinite(amount) && amount > 0;

export const calculateBalance = (saldoInicial: number, movimientos: Movimiento[]): Balance => {
  const ingresos = movimientos.filter(item => item.tipo === 'INGRESO').reduce((total, item) => total + item.monto, 0);
  const egresos = movimientos.filter(item => item.tipo === 'EGRESO').reduce((total, item) => total + item.monto, 0);
  const retiros = movimientos.filter(item => item.tipo === 'RETIRO').reduce((total, item) => total + item.monto, 0);
  return { saldoInicial, ingresos, egresos, retiros, saldoActual: saldoInicial + ingresos - egresos - retiros };
};

export const createId = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
