import { EventoPago, Movimiento, TipoEventoPago } from '../../types';
import {
  jornadaSqliteRepository,
  eventoPagoSqliteRepository,
  movimientoSqliteRepository,
  getDatabase,
} from '../../storage';
import { createId, validateAmount } from '../../utils';
import { formatFriendlyDate, formatFriendlyTime } from '../../utils/formatters/format';

export const eventoPagoService = {
  async create(
    monto: number,
    concepto: string,
    tipoEvento: TipoEventoPago,
    origenReferencia = 'Simulador',
  ): Promise<EventoPago> {
    if (!validateAmount(monto)) throw new Error('Ingresa un monto mayor a cero.');
    if (!concepto.trim()) throw new Error('Ingresa un concepto para el pago.');

    const jornada = await jornadaSqliteRepository.getActiveJornada();
    if (!jornada) throw new Error('Abre una jornada antes de crear un pago.');

    const evento: EventoPago = {
      idOperacion: createId('pago'),
      monto,
      concepto: concepto.trim(),
      origenReferencia,
      tipoEvento,
      estado: 'PENDIENTE',
      fechaHoraEvento: new Date().toISOString(),
      fechaHoraProcesamiento: null,
      jornadaId: jornada.id,
      userId: jornada.userId,
      syncStatus: 'PENDING',
    };

    await eventoPagoSqliteRepository.insertEventoPago(evento);

    if (evento.userId && evento.userId !== 'guest_local') {
      const { syncQueueRepository } = require('../../storage');
      await syncQueueRepository.enqueue({
        userId: evento.userId,
        tableName: 'eventos_pago',
        recordId: evento.idOperacion,
        action: 'INSERT',
        payload: evento,
      }).catch(() => {});
    }

    return evento;
  },

  async confirm(idOperacion: string): Promise<Movimiento> {
    const evento = await eventoPagoSqliteRepository.getEventoById(idOperacion);
    if (!evento || evento.estado !== 'PENDIENTE') {
      throw new Error('Este pago ya fue procesado o no existe.');
    }

    const jornada = await jornadaSqliteRepository.getActiveJornada();
    if (!jornada || jornada.id !== evento.jornadaId) {
      throw new Error('La jornada del pago ya no está abierta.');
    }

    const now = new Date();
    const movimiento: Movimiento = {
      id: createId('mov'),
      tipo: evento.tipoEvento === 'PAGO_RECIBIDO' ? 'INGRESO' : 'EGRESO',
      origen: 'AUTOMATICO',
      monto: evento.monto,
      concepto: evento.concepto,
      categoria: 'Cobro digital',
      metodoPago: 'Transferencia bancaria',
      descripcion: evento.concepto,
      fechaHoraOrigen: now.toISOString(),
      horaLegible: formatFriendlyTime(now),
      fechaLegible: formatFriendlyDate(now),
      jornadaId: evento.jornadaId,
      referenciaEventoPago: evento.idOperacion,
      userId: evento.userId,
      syncStatus: 'PENDING',
    };

    const confirmed: EventoPago = {
      ...evento,
      estado: 'CONFIRMADO',
      fechaHoraProcesamiento: now.toISOString(),
      syncStatus: 'PENDING',
    };

    const db = await getDatabase();
    await db.transaction(async tx => {
      await eventoPagoSqliteRepository.updateEventoPago(confirmed, tx);
      await movimientoSqliteRepository.insertMovimiento(movimiento, tx);
    });

    if (evento.userId && evento.userId !== 'guest_local') {
      const { syncQueueRepository } = require('../../storage');
      await syncQueueRepository.enqueue({
        userId: evento.userId,
        tableName: 'eventos_pago',
        recordId: evento.idOperacion,
        action: 'UPDATE',
        payload: confirmed,
      }).catch(() => {});

      await syncQueueRepository.enqueue({
        userId: evento.userId,
        tableName: 'movimientos',
        recordId: movimiento.id,
        action: 'INSERT',
        payload: movimiento,
      }).catch(() => {});
    }

    return movimiento;
  },

  async cancel(idOperacion: string): Promise<EventoPago> {
    const evento = await eventoPagoSqliteRepository.getEventoById(idOperacion);
    if (!evento || evento.estado !== 'PENDIENTE') {
      throw new Error('Este pago ya fue procesado o no existe.');
    }

    const canceled: EventoPago = {
      ...evento,
      estado: 'CANCELADO',
      fechaHoraProcesamiento: new Date().toISOString(),
      syncStatus: 'PENDING',
    };

    await eventoPagoSqliteRepository.updateEventoPago(canceled);

    if (canceled.userId && canceled.userId !== 'guest_local') {
      const { syncQueueRepository } = require('../../storage');
      await syncQueueRepository.enqueue({
        userId: canceled.userId,
        tableName: 'eventos_pago',
        recordId: canceled.idOperacion,
        action: 'UPDATE',
        payload: canceled,
      }).catch(() => {});
    }

    return canceled;
  },

  async getPendingForActiveJornada(): Promise<EventoPago[]> {
    const active = await jornadaSqliteRepository.getActiveJornada();
    return active ? eventoPagoSqliteRepository.getEventosPendientesByJornada(active.id) : [];
  },
};
