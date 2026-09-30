import { EventoPago, Movimiento, TipoEventoPago } from '../../types';
import { loadState, saveState } from '../../storage';
import { createId, validateAmount } from '../../utils';

export const eventoPagoService = {
  async create(monto: number, concepto: string, tipoEvento: TipoEventoPago, origenReferencia = 'Simulador'): Promise<EventoPago> {
    if (!validateAmount(monto)) throw new Error('Ingresa un monto mayor a cero.');
    if (!concepto.trim()) throw new Error('Ingresa un concepto para el pago.');
    const state = await loadState();
    const jornada = state.jornadas.find(item => item.estado === 'ABIERTA');
    if (!jornada) throw new Error('Abre una jornada antes de crear un pago.');
    const evento: EventoPago = {
      idOperacion: createId('pago'), monto, concepto: concepto.trim(), origenReferencia, tipoEvento, estado: 'PENDIENTE', fechaHoraEvento: new Date().toISOString(), fechaHoraProcesamiento: null, jornadaId: jornada.id,
    };
    await saveState({ ...state, eventosPago: [evento, ...state.eventosPago] });
    return evento;
  },

  async confirm(idOperacion: string): Promise<Movimiento> {
    const state = await loadState();
    const evento = state.eventosPago.find(item => item.idOperacion === idOperacion);
    if (!evento || evento.estado !== 'PENDIENTE') throw new Error('Este pago ya fue procesado o no existe.');
    const jornada = state.jornadas.find(item => item.id === evento.jornadaId && item.estado === 'ABIERTA');
    if (!jornada) throw new Error('La jornada del pago ya no está abierta.');
    const movimiento: Movimiento = {
      id: createId('mov'), tipo: evento.tipoEvento === 'PAGO_RECIBIDO' ? 'INGRESO' : 'EGRESO', origen: 'AUTOMATICO', monto: evento.monto, concepto: evento.concepto, fechaHoraOrigen: new Date().toISOString(), jornadaId: evento.jornadaId, referenciaEventoPago: evento.idOperacion,
    };
    const confirmed: EventoPago = { ...evento, estado: 'CONFIRMADO', fechaHoraProcesamiento: new Date().toISOString() };
    await saveState({ ...state, movimientos: [movimiento, ...state.movimientos], eventosPago: state.eventosPago.map(item => item.idOperacion === idOperacion ? confirmed : item) });
    return movimiento;
  },

  async cancel(idOperacion: string): Promise<EventoPago> {
    const state = await loadState();
    const evento = state.eventosPago.find(item => item.idOperacion === idOperacion);
    if (!evento || evento.estado !== 'PENDIENTE') throw new Error('Este pago ya fue procesado o no existe.');
    const canceled: EventoPago = { ...evento, estado: 'CANCELADO', fechaHoraProcesamiento: new Date().toISOString() };
    await saveState({ ...state, eventosPago: state.eventosPago.map(item => item.idOperacion === idOperacion ? canceled : item) });
    return canceled;
  },

  async getPendingForActiveJornada(): Promise<EventoPago[]> {
    const state = await loadState();
    const active = state.jornadas.find(item => item.estado === 'ABIERTA');
    return active ? state.eventosPago.filter(item => item.jornadaId === active.id && item.estado === 'PENDIENTE') : [];
  },
};
