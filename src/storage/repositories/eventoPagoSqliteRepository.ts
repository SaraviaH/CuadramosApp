import { EventoPago, EstadoEventoPago, TipoEventoPago } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';

interface EventoPagoRow {
  id_operacion: string;
  monto: number;
  concepto: string;
  origen_referencia: string;
  tipo_evento: TipoEventoPago;
  estado: EstadoEventoPago;
  fecha_hora_evento: string;
  fecha_hora_procesamiento: string | null;
  jornada_id: string;
}

const mapRowToEventoPago = (row: EventoPagoRow): EventoPago => ({
  idOperacion: row.id_operacion,
  monto: Number(row.monto),
  concepto: row.concepto,
  origenReferencia: row.origen_referencia,
  tipoEvento: row.tipo_evento,
  estado: row.estado,
  fechaHoraEvento: row.fecha_hora_evento,
  fechaHoraProcesamiento: row.fecha_hora_procesamiento ?? null,
  jornadaId: row.jornada_id,
});

export const eventoPagoSqliteRepository = {
  async insertEventoPago(evento: EventoPago, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(
      `INSERT INTO eventos_pago (
        id_operacion, monto, concepto, origen_referencia, tipo_evento,
        estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        evento.idOperacion,
        evento.monto,
        evento.concepto,
        evento.origenReferencia,
        evento.tipoEvento,
        evento.estado,
        evento.fechaHoraEvento,
        evento.fechaHoraProcesamiento ?? null,
        evento.jornadaId,
      ],
    );
  },

  async updateEventoPago(evento: EventoPago, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(
      `UPDATE eventos_pago
       SET estado = ?, fecha_hora_procesamiento = ?
       WHERE id_operacion = ?;`,
      [evento.estado, evento.fechaHoraProcesamiento ?? null, evento.idOperacion],
    );
  },

  async getEventosPendientesByJornada(jornadaId: string, tx?: IDatabase): Promise<EventoPago[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<EventoPagoRow>(
      `SELECT id_operacion, monto, concepto, origen_referencia, tipo_evento,
              estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id
       FROM eventos_pago
       WHERE jornada_id = ? AND estado = ?
       ORDER BY fecha_hora_evento DESC;`,
      [jornadaId, 'PENDIENTE'],
    );
    return res.rows.map(mapRowToEventoPago);
  },

  async getEventoById(idOperacion: string, tx?: IDatabase): Promise<EventoPago | null> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<EventoPagoRow>(
      `SELECT id_operacion, monto, concepto, origen_referencia, tipo_evento,
              estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id
       FROM eventos_pago
       WHERE id_operacion = ?;`,
      [idOperacion],
    );
    return res.rows.length > 0 ? mapRowToEventoPago(res.rows[0]) : null;
  },

  async getAllEventosByJornada(jornadaId: string, tx?: IDatabase): Promise<EventoPago[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<EventoPagoRow>(
      `SELECT id_operacion, monto, concepto, origen_referencia, tipo_evento,
              estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id
       FROM eventos_pago
       WHERE jornada_id = ?
       ORDER BY fecha_hora_evento DESC;`,
      [jornadaId],
    );
    return res.rows.map(mapRowToEventoPago);
  },

  async getAllEventosPago(tx?: IDatabase): Promise<EventoPago[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<EventoPagoRow>(
      `SELECT id_operacion, monto, concepto, origen_referencia, tipo_evento,
              estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id
       FROM eventos_pago
       ORDER BY fecha_hora_evento DESC;`,
    );
    return res.rows.map(mapRowToEventoPago);
  },

  async deleteEventoPago(idOperacion: string, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(`DELETE FROM eventos_pago WHERE id_operacion = ?;`, [idOperacion]);
  },

  async clearEventosPago(tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(`DELETE FROM eventos_pago;`);
  },

  getAllEventos(tx?: IDatabase): Promise<EventoPago[]> {
    return this.getAllEventosPago(tx);
  },

  clearEventos(tx?: IDatabase): Promise<void> {
    return this.clearEventosPago(tx);
  },
};
