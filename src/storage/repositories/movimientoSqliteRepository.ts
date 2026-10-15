import { GUEST_USER_ID, MetodoPago, Movimiento, OrigenMovimiento, SyncStatus, TipoMovimiento } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';
import { loadActiveUserId } from './userSessionRepository';

interface MovimientoRow {
  id: string;
  user_id: string;
  tipo: TipoMovimiento;
  origen: OrigenMovimiento;
  monto: number;
  concepto: string;
  categoria: string | null;
  metodo_pago: MetodoPago | null;
  descripcion: string | null;
  fecha_hora_origen: string;
  hora_legible: string | null;
  fecha_legible: string | null;
  jornada_id: string;
  referencia_evento_pago: string | null;
  sync_status?: string | null;
  updated_at?: string | null;
}

const mapRowToMovimiento = (row: MovimientoRow): Movimiento => ({
  id: row.id,
  userId: row.user_id || GUEST_USER_ID,
  tipo: row.tipo,
  origen: row.origen,
  monto: Number(row.monto),
  concepto: row.concepto,
  categoria: row.categoria ?? undefined,
  metodoPago: row.metodo_pago ?? undefined,
  descripcion: row.descripcion ?? undefined,
  fechaHoraOrigen: row.fecha_hora_origen,
  horaLegible: row.hora_legible ?? undefined,
  fechaLegible: row.fecha_legible ?? undefined,
  jornadaId: row.jornada_id,
  referenciaEventoPago: row.referencia_evento_pago ?? null,
  syncStatus: (row.sync_status as SyncStatus) || 'PENDING',
  updatedAt: row.updated_at || undefined,
});

export interface MovimientoQueryFilters {
  userId?: string;
  tipo?: TipoMovimiento | 'TODOS';
  startDate?: string;
  endDate?: string;
  categoria?: string;
  limit: number;
  offset: number;
}

export interface PaginatedMovimientosResult {
  items: Movimiento[];
  total: number;
}

export const movimientoSqliteRepository = {
  async insertMovimiento(mov: Movimiento, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    const userId = mov.userId || (await loadActiveUserId()) || GUEST_USER_ID;
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO movimientos (
        id, user_id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
        fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago,
        sync_status, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        mov.id,
        userId,
        mov.tipo,
        mov.origen,
        mov.monto,
        mov.concepto,
        mov.categoria ?? null,
        mov.metodoPago ?? null,
        mov.descripcion ?? null,
        mov.fechaHoraOrigen,
        mov.horaLegible ?? null,
        mov.fechaLegible ?? null,
        mov.jornadaId,
        mov.referenciaEventoPago ?? null,
        mov.syncStatus || 'PENDING',
        mov.updatedAt || now,
      ],
    );
  },

  async getMovimientosByJornadaId(jornadaId: string, tx?: IDatabase): Promise<Movimiento[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<MovimientoRow>(
      `SELECT id, user_id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
              fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago,
              sync_status, updated_at
       FROM movimientos
       WHERE jornada_id = ?
       ORDER BY fecha_hora_origen DESC;`,
      [jornadaId],
    );
    return res.rows.map(mapRowToMovimiento);
  },

  async getMovimientoById(id: string, tx?: IDatabase): Promise<Movimiento | null> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<MovimientoRow>(
      `SELECT id, user_id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
              fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago,
              sync_status, updated_at
       FROM movimientos
       WHERE id = ?;`,
      [id],
    );
    return res.rows.length > 0 ? mapRowToMovimiento(res.rows[0]) : null;
  },

  async deleteMovimiento(id: string, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(`DELETE FROM movimientos WHERE id = ?;`, [id]);
  },

  async getAllMovimientos(userId?: string, tx?: IDatabase): Promise<Movimiento[]> {
    const db = tx ?? (await getDatabase());
    const targetUserId = userId || (await loadActiveUserId()) || GUEST_USER_ID;

    const res = await db.execute<MovimientoRow>(
      `SELECT id, user_id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
              fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago,
              sync_status, updated_at
       FROM movimientos
       WHERE user_id = ?
       ORDER BY fecha_hora_origen DESC;`,
      [targetUserId],
    );
    return res.rows.map(mapRowToMovimiento);
  },

  async clearMovimientos(userId?: string, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    if (userId) {
      await db.execute(`DELETE FROM movimientos WHERE user_id = ?;`, [userId]);
    } else {
      await db.execute(`DELETE FROM movimientos;`);
    }
  },

  async migrateGuestMovimientosToUser(targetUserId: string, tx?: IDatabase): Promise<number> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute(
      `UPDATE movimientos SET user_id = ?, sync_status = 'PENDING' WHERE user_id = ?;`,
      [targetUserId, GUEST_USER_ID],
    );
    return res.rowsAffected || 0;
  },

  async getPaginatedMovimientos(
    filters: MovimientoQueryFilters,
    tx?: IDatabase,
  ): Promise<PaginatedMovimientosResult> {
    const db = tx ?? (await getDatabase());
    const targetUserId = filters.userId || (await loadActiveUserId()) || GUEST_USER_ID;

    const conditions: string[] = ['user_id = ?'];
    const params: any[] = [targetUserId];

    if (filters.tipo && filters.tipo !== 'TODOS') {
      conditions.push('tipo = ?');
      params.push(filters.tipo);
    }

    if (filters.startDate) {
      conditions.push('fecha_hora_origen >= ?');
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push('fecha_hora_origen <= ?');
      params.push(filters.endDate);
    }

    if (filters.categoria && filters.categoria !== 'TODAS') {
      conditions.push('(categoria = ? OR (categoria IS NULL AND concepto = ?))');
      params.push(filters.categoria, filters.categoria);
    }

    const whereClause = conditions.join(' AND ');

    // 1. Contar total de registros coincidentes en SQLite
    const countSql = `SELECT COUNT(*) as total FROM movimientos WHERE ${whereClause};`;
    const countRes = await db.execute<{ total: number }>(countSql, params);
    const total = countRes.rows.length > 0 ? Number(countRes.rows[0].total) : 0;

    // 2. Consulta con ordenamiento y paginación real
    const dataSql = `SELECT id, user_id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
                            fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago,
                            sync_status, updated_at
                     FROM movimientos
                     WHERE ${whereClause}
                     ORDER BY fecha_hora_origen DESC, id DESC
                     LIMIT ? OFFSET ?;`;
    const dataParams = [...params, filters.limit, filters.offset];
    const dataRes = await db.execute<MovimientoRow>(dataSql, dataParams);

    return {
      items: dataRes.rows.map(mapRowToMovimiento),
      total,
    };
  },

  async getUniqueCategories(
    tipo?: TipoMovimiento | 'TODOS',
    userId?: string,
    tx?: IDatabase,
  ): Promise<string[]> {
    const db = tx ?? (await getDatabase());
    const targetUserId = userId || (await loadActiveUserId()) || GUEST_USER_ID;

    const conditions: string[] = ['user_id = ?'];
    const params: any[] = [targetUserId];

    if (tipo && tipo !== 'TODOS') {
      conditions.push('tipo = ?');
      params.push(tipo);
    }

    const res = await db.execute<{ cat: string }>(
      `SELECT DISTINCT COALESCE(categoria, concepto) as cat
       FROM movimientos
       WHERE ${conditions.join(' AND ')}
       ORDER BY cat ASC;`,
      params,
    );

    const categories = res.rows
      .map(r => r.cat?.trim())
      .filter((cat): cat is string => Boolean(cat));

    return ['TODAS', ...Array.from(new Set(categories))];
  },
};
