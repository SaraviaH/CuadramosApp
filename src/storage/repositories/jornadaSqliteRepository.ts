import { Jornada } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';

interface JornadaRow {
  id: string;
  saldo_inicial: number;
  estado: 'ABIERTA' | 'CERRADA';
  fecha_hora_apertura: string;
  fecha_hora_cierre: string | null;
}

const mapRowToJornada = (row: JornadaRow): Jornada => ({
  id: row.id,
  saldoInicial: Number(row.saldo_inicial),
  estado: row.estado,
  fechaHoraApertura: row.fecha_hora_apertura,
  fechaHoraCierre: row.fecha_hora_cierre ?? null,
});

export const jornadaSqliteRepository = {
  async insertJornada(jornada: Jornada, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(
      `INSERT INTO jornadas (id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre)
       VALUES (?, ?, ?, ?, ?);`,
      [
        jornada.id,
        jornada.saldoInicial,
        jornada.estado,
        jornada.fechaHoraApertura,
        jornada.fechaHoraCierre ?? null,
      ],
    );
  },

  async getActiveJornada(tx?: IDatabase): Promise<Jornada | null> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<JornadaRow>(
      `SELECT id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre
       FROM jornadas
       WHERE estado = ?
       ORDER BY fecha_hora_apertura DESC
       LIMIT 1;`,
      ['ABIERTA'],
    );
    return res.rows.length > 0 ? mapRowToJornada(res.rows[0]) : null;
  },

  async getJornadaById(id: string, tx?: IDatabase): Promise<Jornada | null> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<JornadaRow>(
      `SELECT id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre
       FROM jornadas
       WHERE id = ?;`,
      [id],
    );
    return res.rows.length > 0 ? mapRowToJornada(res.rows[0]) : null;
  },

  async updateJornada(jornada: Jornada, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(
      `UPDATE jornadas
       SET estado = ?, fecha_hora_cierre = ?
       WHERE id = ?;`,
      [jornada.estado, jornada.fechaHoraCierre ?? null, jornada.id],
    );
  },

  async getAllJornadas(tx?: IDatabase): Promise<Jornada[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<JornadaRow>(
      `SELECT id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre
       FROM jornadas
       ORDER BY fecha_hora_apertura DESC;`,
    );
    return res.rows.map(mapRowToJornada);
  },

  async clearJornadas(tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(`DELETE FROM jornadas;`);
  },
};
