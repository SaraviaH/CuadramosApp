import { EventoPago, Jornada } from '../../types';
import { loadState, saveState } from '../../storage';
import { createId, validateAmount } from '../../utils';

const getActiveFrom = (jornadas: Jornada[]): Jornada | undefined => jornadas.find(item => item.estado === 'ABIERTA');

export const jornadaService = {
  async getActive(): Promise<Jornada | null> {
    return getActiveFrom((await loadState()).jornadas) ?? null;
  },

  async open(saldoInicial: number): Promise<Jornada> {
    if (!validateAmount(saldoInicial) && saldoInicial !== 0) throw new Error('El saldo inicial debe ser un monto válido.');
    const state = await loadState();
    if (getActiveFrom(state.jornadas)) throw new Error('Ya existe una jornada abierta.');
    const jornada: Jornada = { id: createId('jor'), saldoInicial, estado: 'ABIERTA', fechaHoraApertura: new Date().toISOString(), fechaHoraCierre: null };
    await saveState({ ...state, jornadas: [jornada, ...state.jornadas] });
    return jornada;
  },

  async close(): Promise<Jornada> {
    const state = await loadState();
    const active = getActiveFrom(state.jornadas);
    if (!active) throw new Error('No hay una jornada abierta para cerrar.');
    const pending = state.eventosPago.filter(evento => evento.jornadaId === active.id && evento.estado === 'PENDIENTE');
    if (pending.length > 0) throw new Error('No puedes cerrar la jornada mientras existan pagos pendientes.');
    const closed: Jornada = { ...active, estado: 'CERRADA', fechaHoraCierre: new Date().toISOString() };
    await saveState({ ...state, jornadas: state.jornadas.map(item => item.id === active.id ? closed : item) });
    return closed;
  },

  async pendingEvents(): Promise<EventoPago[]> {
    const state = await loadState();
    const active = getActiveFrom(state.jornadas);
    return active ? state.eventosPago.filter(item => item.jornadaId === active.id && item.estado === 'PENDIENTE') : [];
  },
};
