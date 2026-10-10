import { Movimiento, OrigenMovimiento, MetodoPago, TipoMovimiento } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';

interface MovimientoRow {
  id: string;
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
}

const mapRowToMovimiento = (row: MovimientoRow): Movimiento => ({
  id: row.id,
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
});

export const movimientoSqliteRepository = {
  async insertMovimiento(mov: Movimiento, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(
      `INSERT INTO movimientos (
        id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
        fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        mov.id,
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
      ],
    );
  },

  async getMovimientosByJornadaId(jornadaId: string, tx?: IDatabase): Promise<Movimiento[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<MovimientoRow>(
      `SELECT id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
              fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago
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
      `SELECT id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
              fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago
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

  async getAllMovimientos(tx?: IDatabase): Promise<Movimiento[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<MovimientoRow>(
      `SELECT id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion,
              fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago
       FROM movimientos
       ORDER BY fecha_hora_origen DESC;`,
    );
    return res.rows.map(mapRowToMovimiento);
  },

  async clearMovimientos(tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(`DELETE FROM movimientos;`);
  },
};
