import { EventoPago, EstadoEventoPago, GUEST_USER_ID, SyncStatus, TipoEventoPago } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';
import { getCachedActiveUserId } from './userSessionRepository';

interface EventoPagoRow {
  id_operacion: string;
  user_id: string;
  monto: number;
  concepto: string;
  origen_referencia: string;
  tipo_evento: TipoEventoPago;
  estado: EstadoEventoPago;
  fecha_hora_evento: string;
  fecha_hora_procesamiento: string | null;
  jornada_id: string;
  sync_status?: string | null;
  updated_at?: string | null;
}

const mapRowToEventoPago = (row: EventoPagoRow): EventoPago => ({
  idOperacion: row.id_operacion,
  userId: row.user_id || GUEST_USER_ID,
  monto: Number(row.monto),
  concepto: row.concepto,
  origenReferencia: row.origen_referencia,
  tipoEvento: row.tipo_evento,
  estado: row.estado,
  fechaHoraEvento: row.fecha_hora_evento,
  fechaHoraProcesamiento: row.fecha_hora_procesamiento ?? null,
  jornadaId: row.jornada_id,
  syncStatus: (row.sync_status as SyncStatus) || 'PENDING',
  updatedAt: row.updated_at || undefined,
});

export const eventoPagoSqliteRepository = {
  async insertEventoPago(evento: EventoPago, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    const userId = evento.userId || getCachedActiveUserId() || GUEST_USER_ID;
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO eventos_pago (
        id_operacion, user_id, monto, concepto, origen_referencia, tipo_evento,
        estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id,
        sync_status, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        evento.idOperacion,
        userId,
        evento.monto,
        evento.concepto,
        evento.origenReferencia,
        evento.tipoEvento,
        evento.estado,
        evento.fechaHoraEvento,
        evento.fechaHoraProcesamiento ?? null,
        evento.jornadaId,
        evento.syncStatus || 'PENDING',
        evento.updatedAt || now,
      ],
    );
  },

  async updateEventoPago(evento: EventoPago, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    const now = new Date().toISOString();

    await db.execute(
      `UPDATE eventos_pago
       SET estado = ?, fecha_hora_procesamiento = ?, sync_status = ?, updated_at = ?
       WHERE id_operacion = ?;`,
      [
        evento.estado,
        evento.fechaHoraProcesamiento ?? null,
        evento.syncStatus || 'PENDING',
        evento.updatedAt || now,
        evento.idOperacion,
      ],
    );
  },

  async getEventosPendientesByJornada(jornadaId: string, tx?: IDatabase): Promise<EventoPago[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<EventoPagoRow>(
      `SELECT id_operacion, user_id, monto, concepto, origen_referencia, tipo_evento,
              estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id,
              sync_status, updated_at
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
      `SELECT id_operacion, user_id, monto, concepto, origen_referencia, tipo_evento,
              estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id,
              sync_status, updated_at
       FROM eventos_pago
       WHERE id_operacion = ?;`,
      [idOperacion],
    );
    return res.rows.length > 0 ? mapRowToEventoPago(res.rows[0]) : null;
  },

  async getAllEventosByJornada(jornadaId: string, tx?: IDatabase): Promise<EventoPago[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<EventoPagoRow>(
      `SELECT id_operacion, user_id, monto, concepto, origen_referencia, tipo_evento,
              estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id,
              sync_status, updated_at
       FROM eventos_pago
       WHERE jornada_id = ?
       ORDER BY fecha_hora_evento DESC;`,
      [jornadaId],
    );
    return res.rows.map(mapRowToEventoPago);
  },

  async getAllEventosPago(userId?: string, tx?: IDatabase): Promise<EventoPago[]> {
    const db = tx ?? (await getDatabase());
    const targetUserId = userId || getCachedActiveUserId() || GUEST_USER_ID;

    const res = await db.execute<EventoPagoRow>(
      `SELECT id_operacion, user_id, monto, concepto, origen_referencia, tipo_evento,
              estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id,
              sync_status, updated_at
       FROM eventos_pago
       WHERE user_id = ?
       ORDER BY fecha_hora_evento DESC;`,
      [targetUserId],
    );
    return res.rows.map(mapRowToEventoPago);
  },

  async clearEventosPago(userId?: string, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    if (userId) {
      await db.execute(`DELETE FROM eventos_pago WHERE user_id = ?;`, [userId]);
    } else {
      await db.execute(`DELETE FROM eventos_pago;`);
    }
  },

  async migrateGuestEventosToUser(targetUserId: string, tx?: IDatabase): Promise<number> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute(
      `UPDATE eventos_pago SET user_id = ?, sync_status = 'PENDING' WHERE user_id = ?;`,
      [targetUserId, GUEST_USER_ID],
    );
    return res.rowsAffected || 0;
  },
};
