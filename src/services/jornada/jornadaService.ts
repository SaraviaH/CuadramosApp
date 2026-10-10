import { EventoPago, Jornada } from '../../types';
import {
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
  appendClosedBox,
  getDatabase,
} from '../../storage';
import { createId, validateAmount } from '../../utils';
import { formatFriendlyDate, formatFriendlyTime } from '../../utils/formatters/format';

export const jornadaService = {
  async getActive(): Promise<Jornada | null> {
    return jornadaSqliteRepository.getActiveJornada();
  },

  async open(saldoInicial: number): Promise<Jornada> {
    if (!validateAmount(saldoInicial) && saldoInicial !== 0) {
      throw new Error('El saldo inicial debe ser un monto válido.');
    }
    const active = await jornadaSqliteRepository.getActiveJornada();
    if (active) {
      throw new Error('Ya existe una jornada abierta.');
    }

    const jornada: Jornada = {
      id: createId('jor'),
      saldoInicial,
      estado: 'ABIERTA',
      fechaHoraApertura: new Date().toISOString(),
      fechaHoraCierre: null,
    };

    await jornadaSqliteRepository.insertJornada(jornada);
    return jornada;
  },

  async close(): Promise<Jornada> {
    const active = await jornadaSqliteRepository.getActiveJornada();
    if (!active) {
      throw new Error('No hay una jornada abierta para cerrar.');
    }

    const pending = await eventoPagoSqliteRepository.getEventosPendientesByJornada(active.id);
    if (pending.length > 0) {
      throw new Error('No puedes cerrar la jornada mientras existan pagos pendientes.');
    }

    const closed: Jornada = {
      ...active,
      estado: 'CERRADA',
      fechaHoraCierre: new Date().toISOString(),
    };

    const activeMovements = await movimientoSqliteRepository.getMovimientosByJornadaId(active.id);
    const ingresos = activeMovements.filter(m => m.tipo === 'INGRESO').reduce((acc, m) => acc + m.monto, 0);
    const gastos = activeMovements.filter(m => m.tipo === 'EGRESO').reduce((acc, m) => acc + m.monto, 0);
    const retiros = activeMovements.filter(m => m.tipo === 'RETIRO').reduce((acc, m) => acc + m.monto, 0);
    const expected = active.saldoInicial + ingresos - gastos - retiros;

    const db = await getDatabase();
    await db.transaction(async tx => {
      await jornadaSqliteRepository.updateJornada(closed, tx);
      await appendClosedBox(
        {
          id: closed.id,
          fecha: formatFriendlyDate(new Date(closed.fechaHoraApertura)),
          horaApertura: formatFriendlyTime(new Date(closed.fechaHoraApertura)),
          horaCierre: formatFriendlyTime(new Date(closed.fechaHoraCierre ?? new Date())),
          saldoInicial: active.saldoInicial,
          ingresos,
          gastos,
          retiros,
          saldoEsperado: expected,
          saldoReal: expected,
          diferencia: 0,
          movimientos: activeMovements,
        },
        tx,
      );
    });

    return closed;
  },

  async pendingEvents(): Promise<EventoPago[]> {
    const active = await jornadaSqliteRepository.getActiveJornada();
    return active ? eventoPagoSqliteRepository.getEventosPendientesByJornada(active.id) : [];
  },
};
