import { GUEST_USER_ID, Jornada, SyncStatus } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';
import { loadActiveUserId } from './userSessionRepository';

interface JornadaRow {
  id: string;
  user_id: string;
  saldo_inicial: number;
  estado: 'ABIERTA' | 'CERRADA';
  fecha_hora_apertura: string;
  fecha_hora_cierre: string | null;
  sync_status?: string | null;
  updated_at?: string | null;
}

const mapRowToJornada = (row: JornadaRow): Jornada => ({
  id: row.id,
  userId: row.user_id || GUEST_USER_ID,
  saldoInicial: Number(row.saldo_inicial),
  estado: row.estado,
  fechaHoraApertura: row.fecha_hora_apertura,
  fechaHoraCierre: row.fecha_hora_cierre ?? null,
  syncStatus: (row.sync_status as SyncStatus) || 'PENDING',
  updatedAt: row.updated_at || undefined,
});

export const jornadaSqliteRepository = {
  async insertJornada(jornada: Jornada, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    const userId = jornada.userId || (await loadActiveUserId()) || GUEST_USER_ID;
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO jornadas (id, user_id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre, sync_status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        jornada.id,
        userId,
        jornada.saldoInicial,
        jornada.estado,
        jornada.fechaHoraApertura,
        jornada.fechaHoraCierre ?? null,
        jornada.syncStatus || 'PENDING',
        jornada.updatedAt || now,
      ],
    );
  },

  async getActiveJornada(userId?: string, tx?: IDatabase): Promise<Jornada | null> {
    const db = tx ?? (await getDatabase());
    const targetUserId = userId || (await loadActiveUserId()) || GUEST_USER_ID;

    const res = await db.execute<JornadaRow>(
      `SELECT id, user_id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre, sync_status, updated_at
       FROM jornadas
       WHERE user_id = ? AND estado = ?
       ORDER BY fecha_hora_apertura DESC
       LIMIT 1;`,
      [targetUserId, 'ABIERTA'],
    );
    return res.rows.length > 0 ? mapRowToJornada(res.rows[0]) : null;
  },

  async getJornadaById(id: string, tx?: IDatabase): Promise<Jornada | null> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<JornadaRow>(
      `SELECT id, user_id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre, sync_status, updated_at
       FROM jornadas
       WHERE id = ?;`,
      [id],
    );
    return res.rows.length > 0 ? mapRowToJornada(res.rows[0]) : null;
  },

  async updateJornada(jornada: Jornada, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    const now = new Date().toISOString();

    await db.execute(
      `UPDATE jornadas
       SET estado = ?, fecha_hora_cierre = ?, sync_status = ?, updated_at = ?
       WHERE id = ?;`,
      [
        jornada.estado,
        jornada.fechaHoraCierre ?? null,
        jornada.syncStatus || 'PENDING',
        jornada.updatedAt || now,
        jornada.id,
      ],
    );
  },

  async getAllJornadas(userId?: string, tx?: IDatabase): Promise<Jornada[]> {
    const db = tx ?? (await getDatabase());
    const targetUserId = userId || (await loadActiveUserId()) || GUEST_USER_ID;

    const res = await db.execute<JornadaRow>(
      `SELECT id, user_id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre, sync_status, updated_at
       FROM jornadas
       WHERE user_id = ?
       ORDER BY fecha_hora_apertura DESC;`,
      [targetUserId],
    );
    return res.rows.map(mapRowToJornada);
  },

  async clearJornadas(userId?: string, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    if (userId) {
      await db.execute(`DELETE FROM jornadas WHERE user_id = ?;`, [userId]);
    } else {
      await db.execute(`DELETE FROM jornadas;`);
    }
  },

  async migrateGuestJornadasToUser(targetUserId: string, tx?: IDatabase): Promise<number> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute(
      `UPDATE jornadas SET user_id = ?, sync_status = 'PENDING' WHERE user_id = ?;`,
      [targetUserId, GUEST_USER_ID],
    );
    return res.rowsAffected || 0;
  },
};
