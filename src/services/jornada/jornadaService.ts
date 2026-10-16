import { EventoPago, Jornada } from '../../types';
import {
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
  appendClosedBox,
  getDatabase,
  syncQueueRepository,
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
      syncStatus: 'PENDING',
    };

    await jornadaSqliteRepository.insertJornada(jornada);

    if (jornada.userId && jornada.userId !== 'guest_local') {
      await syncQueueRepository.enqueue({
        userId: jornada.userId,
        tableName: 'jornadas',
        recordId: jornada.id,
        action: 'INSERT',
        payload: jornada,
      }).catch(() => {});
    }

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
    const expected = active.saldoInicial + ingresos - gastos;

    const closedBoxRecord = {
      id: closed.id,
      userId: closed.userId,
      fecha: formatFriendlyDate(new Date(closed.fechaHoraApertura)),
      fechaHoraApertura: closed.fechaHoraApertura,
      horaApertura: formatFriendlyTime(new Date(closed.fechaHoraApertura)),
      horaCierre: formatFriendlyTime(new Date(closed.fechaHoraCierre ?? new Date())),
      saldoInicial: active.saldoInicial,
      ingresos,
      gastos,
      retiros: 0,
      saldoEsperado: expected,
      saldoReal: expected,
      diferencia: 0,
      movimientos: activeMovements,
    };

    const db = await getDatabase();
    await db.transaction(async tx => {
      await jornadaSqliteRepository.updateJornada(closed, tx);
      await appendClosedBox(closedBoxRecord, tx);
    });

    if (closed.userId && closed.userId !== 'guest_local') {
      await syncQueueRepository.enqueue({
        userId: closed.userId,
        tableName: 'jornadas',
        recordId: closed.id,
        action: 'UPDATE',
        payload: closed,
      }).catch(() => {});

      await syncQueueRepository.enqueue({
        userId: closed.userId,
        tableName: 'historial_cajas',
        recordId: closed.id,
        action: 'INSERT',
        payload: closedBoxRecord,
      }).catch(() => {});
    }

    return closed;
  },

  async pendingEvents(): Promise<EventoPago[]> {
    const active = await jornadaSqliteRepository.getActiveJornada();
    return active ? eventoPagoSqliteRepository.getEventosPendientesByJornada(active.id) : [];
  },
};
