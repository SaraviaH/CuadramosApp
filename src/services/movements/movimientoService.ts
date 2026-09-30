import { Balance, Movimiento, TipoMovimiento } from '../../types';
import { loadState, saveState } from '../../storage';
import { calculateBalance, createId, validateAmount } from '../../utils';

const activeJornada = (jornadas: { id: string; estado: string; saldoInicial: number }[]) => jornadas.find(item => item.estado === 'ABIERTA');

const create = async (tipo: TipoMovimiento, monto: number, concepto: string, origen: Movimiento['origen'], referenciaEventoPago: string | null): Promise<Movimiento> => {
  if (!validateAmount(monto)) throw new Error('Ingresa un monto mayor a cero.');
  if (!concepto.trim()) throw new Error('Ingresa un concepto para el movimiento.');
  const state = await loadState();
  const jornada = activeJornada(state.jornadas);
  if (!jornada) throw new Error('Abre una jornada antes de registrar movimientos.');
  const movimiento: Movimiento = {
    id: createId('mov'), tipo, origen, monto, concepto: concepto.trim(), fechaHoraOrigen: new Date().toISOString(), jornadaId: jornada.id, referenciaEventoPago,
  };
  await saveState({ ...state, movimientos: [movimiento, ...state.movimientos] });
  return movimiento;
};

export const movimientoService = {
  createIngreso: (monto: number, concepto: string) => create('INGRESO', monto, concepto, 'MANUAL', null),
  createEgreso: (monto: number, concepto: string) => create('EGRESO', monto, concepto, 'MANUAL', null),
  createRetiro: (monto: number, concepto: string) => create('RETIRO', monto, concepto, 'MANUAL', null),
  async getForActiveJornada(): Promise<Movimiento[]> {
    const state = await loadState();
    const jornada = activeJornada(state.jornadas);
    return jornada ? state.movimientos.filter(item => item.jornadaId === jornada.id) : [];
  },
  async calculateActiveBalance(): Promise<Balance | null> {
    const state = await loadState();
    const jornada = activeJornada(state.jornadas);
    return jornada ? calculateBalance(jornada.saldoInicial, state.movimientos.filter(item => item.jornadaId === jornada.id)) : null;
  },
};
