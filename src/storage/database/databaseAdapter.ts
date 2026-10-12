import { CREATE_TABLES_SQL } from './schema';

declare const process: any;

export interface QueryResult<T = any> {
  rows: T[];
  rowsAffected: number;
  insertId?: number;
}

export interface IDatabase {
  execute<T = any>(query: string, params?: any[]): Promise<QueryResult<T>>;
  transaction<T>(fn: (tx: IDatabase) => Promise<T>): Promise<T>;
  close(): Promise<void>;
  clearAllTables(): Promise<void>;
}

// -------------------------------------------------------------
// Driver Nativo con @op-engineering/op-sqlite
// -------------------------------------------------------------
class NativeSQLiteDatabase implements IDatabase {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async execute<T = any>(query: string, params: any[] = []): Promise<QueryResult<T>> {
    const res = await this.db.execute(query, params);
    return {
      rows: (res.rows as T[]) || [],
      rowsAffected: res.rowsAffected || 0,
      insertId: res.insertId,
    };
  }

  async transaction<T>(fn: (tx: IDatabase) => Promise<T>): Promise<T> {
    let result: T;
    await this.db.transaction(async (rawTx: any) => {
      const txAdapter: IDatabase = {
        execute: async <R = any>(q: string, p: any[] = []): Promise<QueryResult<R>> => {
          const res = await rawTx.execute(q, p);
          return {
            rows: (res.rows as R[]) || [],
            rowsAffected: res.rowsAffected || 0,
            insertId: res.insertId,
          };
        },
        transaction: () => {
          throw new Error('Las transacciones anidadas no están soportadas directamente.');
        },
        close: async () => {},
        clearAllTables: async () => {},
      };
      result = await fn(txAdapter);
    });
    return result!;
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
    }
  }

  async clearAllTables(): Promise<void> {
    await this.execute('DELETE FROM movimientos;');
    await this.execute('DELETE FROM eventos_pago;');
    await this.execute('DELETE FROM historial_cajas;');
    await this.execute('DELETE FROM sync_queue;');
    await this.execute('DELETE FROM usuario_sesion;');
    await this.execute('DELETE FROM jornadas;');
  }
}

// -------------------------------------------------------------
// Driver en Memoria para Pruebas Unitarias (Jest / Node.js)
// -------------------------------------------------------------
export class MemorySQLiteDatabase implements IDatabase {
  private tables: {
    jornadas: Map<string, any>;
    movimientos: Map<string, any>;
    eventos_pago: Map<string, any>;
    historial_cajas: Map<string, any>;
    usuario_sesion: Map<string, any>;
    sync_queue: Map<string, any>;
  };

  constructor() {
    this.tables = {
      jornadas: new Map(),
      movimientos: new Map(),
      eventos_pago: new Map(),
      historial_cajas: new Map(),
      usuario_sesion: new Map(),
      sync_queue: new Map(),
    };
  }

  async execute<T = any>(query: string, params: any[] = []): Promise<QueryResult<T>> {
    const trimmed = query.trim();

    // Comandos de estructura o configuración
    if (trimmed.startsWith('PRAGMA') || trimmed.startsWith('CREATE') || trimmed.startsWith('ALTER')) {
      return { rows: [], rowsAffected: 0 };
    }

    // ---------------- Jornadas ----------------
    if (trimmed.startsWith('INSERT INTO jornadas') || trimmed.startsWith('INSERT OR REPLACE INTO jornadas')) {
      if (params.length >= 8) {
        const [id, user_id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre, sync_status, updated_at] = params;
        this.tables.jornadas.set(id, { id, user_id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre, sync_status, updated_at });
      } else {
        const [id, saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre] = params;
        this.tables.jornadas.set(id, { id, user_id: 'guest_local', saldo_inicial, estado, fecha_hora_apertura, fecha_hora_cierre, sync_status: 'PENDING', updated_at: '' });
      }
      return { rows: [], rowsAffected: 1 };
    }

    if (trimmed.startsWith('UPDATE jornadas')) {
      if (trimmed.includes('SET user_id = ?') && trimmed.includes('WHERE user_id = ?')) {
        const [targetUserId, fromUserId] = params;
        let count = 0;
        for (const [key, val] of Array.from(this.tables.jornadas.entries())) {
          if ((val.user_id || 'guest_local') === fromUserId) {
            this.tables.jornadas.set(key, { ...val, user_id: targetUserId, sync_status: 'PENDING' });
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }

      if (trimmed.includes('sync_status = ?')) {
        const [estado, fecha_hora_cierre, sync_status, updated_at, id] = params;
        const existing = this.tables.jornadas.get(id);
        if (existing) {
          this.tables.jornadas.set(id, { ...existing, estado, fecha_hora_cierre, sync_status, updated_at });
          return { rows: [], rowsAffected: 1 };
        }
      } else {
        const [estado, fecha_hora_cierre, id] = params;
        const existing = this.tables.jornadas.get(id);
        if (existing) {
          this.tables.jornadas.set(id, { ...existing, estado, fecha_hora_cierre });
          return { rows: [], rowsAffected: 1 };
        }
      }
      return { rows: [], rowsAffected: 0 };
    }

    if (trimmed.startsWith('SELECT') && trimmed.includes('FROM jornadas')) {
      let items = Array.from(this.tables.jornadas.values());
      if (trimmed.includes('WHERE user_id = ? AND estado = ?')) {
        items = items.filter(j => (j.user_id || 'guest_local') === params[0] && j.estado === params[1]);
      } else if (trimmed.includes('WHERE estado = ?')) {
        items = items.filter(j => j.estado === params[0]);
      } else if (trimmed.includes('WHERE user_id = ?')) {
        items = items.filter(j => (j.user_id || 'guest_local') === params[0]);
      } else if (trimmed.includes('WHERE id = ?')) {
        items = items.filter(j => j.id === params[0]);
      }
      if (trimmed.includes('ORDER BY fecha_hora_apertura DESC')) {
        items.sort((a, b) => b.fecha_hora_apertura.localeCompare(a.fecha_hora_apertura));
      }
      if (trimmed.includes('LIMIT 1')) {
        items = items.slice(0, 1);
      }
      return { rows: items as T[], rowsAffected: 0 };
    }

    if (trimmed.startsWith('DELETE FROM jornadas')) {
      if (trimmed.includes('WHERE id = ?')) {
        const deleted = this.tables.jornadas.delete(params[0]);
        for (const [key, val] of Array.from(this.tables.movimientos.entries())) {
          if (val.jornada_id === params[0]) this.tables.movimientos.delete(key);
        }
        for (const [key, val] of Array.from(this.tables.eventos_pago.entries())) {
          if (val.jornada_id === params[0]) this.tables.eventos_pago.delete(key);
        }
        return { rows: [], rowsAffected: deleted ? 1 : 0 };
      }
      if (trimmed.includes('WHERE user_id = ?')) {
        let count = 0;
        for (const [key, val] of Array.from(this.tables.jornadas.entries())) {
          if (val.user_id === params[0]) {
            this.tables.jornadas.delete(key);
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }
      this.tables.jornadas.clear();
      return { rows: [], rowsAffected: 1 };
    }

    // ---------------- Movimientos ----------------
    if (trimmed.startsWith('INSERT INTO movimientos') || trimmed.startsWith('INSERT OR REPLACE INTO movimientos')) {
      if (params.length >= 16) {
        const [id, user_id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion, fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago, sync_status, updated_at] = params;
        this.tables.movimientos.set(id, {
          id, user_id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion, fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago, sync_status, updated_at,
        });
      } else {
        const [id, tipo, origen, monto, concepto, categoria, metodo_pago, descripcion, fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago] = params;
        this.tables.movimientos.set(id, {
          id, user_id: 'guest_local', tipo, origen, monto, concepto, categoria, metodo_pago, descripcion, fecha_hora_origen, hora_legible, fecha_legible, jornada_id, referencia_evento_pago, sync_status: 'PENDING', updated_at: '',
        });
      }
      return { rows: [], rowsAffected: 1 };
    }

    if (trimmed.startsWith('SELECT') && trimmed.includes('FROM movimientos')) {
      let items = Array.from(this.tables.movimientos.values());
      if (trimmed.includes('WHERE user_id = ? AND jornada_id = ?')) {
        items = items.filter(m => (m.user_id || 'guest_local') === params[0] && m.jornada_id === params[1]);
      } else if (trimmed.includes('WHERE jornada_id = ?')) {
        items = items.filter(m => m.jornada_id === params[0]);
      } else if (trimmed.includes('WHERE user_id = ?')) {
        items = items.filter(m => (m.user_id || 'guest_local') === params[0]);
      } else if (trimmed.includes('WHERE id = ?')) {
        items = items.filter(m => m.id === params[0]);
      }
      if (trimmed.includes('ORDER BY fecha_hora_origen DESC')) {
        items.sort((a, b) => b.fecha_hora_origen.localeCompare(a.fecha_hora_origen));
      }
      return { rows: items as T[], rowsAffected: 0 };
    }

    if (trimmed.startsWith('DELETE FROM movimientos')) {
      if (trimmed.includes('WHERE id = ?')) {
        const deleted = this.tables.movimientos.delete(params[0]);
        return { rows: [], rowsAffected: deleted ? 1 : 0 };
      }
      if (trimmed.includes('WHERE jornada_id = ?')) {
        let count = 0;
        for (const [key, val] of Array.from(this.tables.movimientos.entries())) {
          if (val.jornada_id === params[0]) {
            this.tables.movimientos.delete(key);
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }
      this.tables.movimientos.clear();
      return { rows: [], rowsAffected: 1 };
    }

    if (trimmed.startsWith('UPDATE movimientos')) {
      if (trimmed.includes('SET user_id = ?') && trimmed.includes('WHERE user_id = ?')) {
        const [targetUserId, fromUserId] = params;
        let count = 0;
        for (const [key, val] of Array.from(this.tables.movimientos.entries())) {
          if ((val.user_id || 'guest_local') === fromUserId) {
            this.tables.movimientos.set(key, { ...val, user_id: targetUserId, sync_status: 'PENDING' });
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }
      return { rows: [], rowsAffected: 0 };
    }

    // ---------------- Eventos de Pago ----------------
    if (trimmed.startsWith('INSERT INTO eventos_pago') || trimmed.startsWith('INSERT OR REPLACE INTO eventos_pago')) {
      if (params.length >= 12) {
        const [id_operacion, user_id, monto, concepto, origen_referencia, tipo_evento, estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id, sync_status, updated_at] = params;
        this.tables.eventos_pago.set(id_operacion, {
          id_operacion, user_id, monto, concepto, origen_referencia, tipo_evento, estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id, sync_status, updated_at,
        });
      } else {
        const [id_operacion, monto, concepto, origen_referencia, tipo_evento, estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id] = params;
        this.tables.eventos_pago.set(id_operacion, {
          id_operacion, user_id: 'guest_local', monto, concepto, origen_referencia, tipo_evento, estado, fecha_hora_evento, fecha_hora_procesamiento, jornada_id, sync_status: 'PENDING', updated_at: '',
        });
      }
      return { rows: [], rowsAffected: 1 };
    }

    if (trimmed.startsWith('UPDATE eventos_pago')) {
      if (trimmed.includes('SET user_id = ?') && trimmed.includes('WHERE user_id = ?')) {
        const [targetUserId, fromUserId] = params;
        let count = 0;
        for (const [key, val] of Array.from(this.tables.eventos_pago.entries())) {
          if ((val.user_id || 'guest_local') === fromUserId) {
            this.tables.eventos_pago.set(key, { ...val, user_id: targetUserId, sync_status: 'PENDING' });
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }

      const id_operacion = params[params.length - 1];
      const estado = params[0];
      const fecha_hora_procesamiento = params[1];
      const sync_status = params.length >= 5 ? params[2] : undefined;
      const updated_at = params.length >= 5 ? params[3] : undefined;

      const existing = this.tables.eventos_pago.get(id_operacion);
      if (existing) {
        this.tables.eventos_pago.set(id_operacion, {
          ...existing,
          estado,
          fecha_hora_procesamiento,
          ...(sync_status ? { sync_status, updated_at } : {}),
        });
        return { rows: [], rowsAffected: 1 };
      }
      return { rows: [], rowsAffected: 0 };
    }

    if (trimmed.startsWith('SELECT') && trimmed.includes('FROM eventos_pago')) {
      let items = Array.from(this.tables.eventos_pago.values());
      if (trimmed.includes('WHERE jornada_id = ? AND estado = ?')) {
        items = items.filter(e => e.jornada_id === params[0] && e.estado === params[1]);
      } else if (trimmed.includes('WHERE user_id = ? AND estado = ?')) {
        items = items.filter(e => (e.user_id || 'guest_local') === params[0] && e.estado === params[1]);
      } else if (trimmed.includes('WHERE jornada_id = ?')) {
        items = items.filter(e => e.jornada_id === params[0]);
      } else if (trimmed.includes('WHERE id_operacion = ?')) {
        items = items.filter(e => e.id_operacion === params[0]);
      }
      if (trimmed.includes('ORDER BY fecha_hora_evento DESC')) {
        items.sort((a, b) => b.fecha_hora_evento.localeCompare(a.fecha_hora_evento));
      }
      return { rows: items as T[], rowsAffected: 0 };
    }

    if (trimmed.startsWith('DELETE FROM eventos_pago')) {
      if (trimmed.includes('WHERE id_operacion = ?')) {
        const deleted = this.tables.eventos_pago.delete(params[0]);
        return { rows: [], rowsAffected: deleted ? 1 : 0 };
      }
      if (trimmed.includes('WHERE jornada_id = ?')) {
        let count = 0;
        for (const [key, val] of Array.from(this.tables.eventos_pago.entries())) {
          if (val.jornada_id === params[0]) {
            this.tables.eventos_pago.delete(key);
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }
      this.tables.eventos_pago.clear();
      return { rows: [], rowsAffected: 1 };
    }

    // ---------------- Historial de Cajas ----------------
    if (trimmed.startsWith('INSERT INTO historial_cajas') || trimmed.startsWith('INSERT OR REPLACE INTO historial_cajas')) {
      if (params.length >= 15) {
        const [id, user_id, fecha, hora_apertura, hora_cierre, saldo_inicial, ingresos, gastos, retiros, saldo_esperado, saldo_real, diferencia, movimientos_json, sync_status, updated_at] = params;
        this.tables.historial_cajas.set(id, {
          id, user_id, fecha, hora_apertura, hora_cierre, saldo_inicial, ingresos, gastos, retiros, saldo_esperado, saldo_real, diferencia, movimientos_json, sync_status, updated_at,
        });
      } else {
        const [id, fecha, hora_apertura, hora_cierre, saldo_inicial, ingresos, gastos, retiros, saldo_esperado, saldo_real, diferencia, movimientos_json] = params;
        this.tables.historial_cajas.set(id, {
          id, user_id: 'guest_local', fecha, hora_apertura, hora_cierre, saldo_inicial, ingresos, gastos, retiros, saldo_esperado, saldo_real, diferencia, movimientos_json, sync_status: 'PENDING', updated_at: '',
        });
      }
      return { rows: [], rowsAffected: 1 };
    }

    if (trimmed.startsWith('UPDATE historial_cajas')) {
      if (trimmed.includes('SET user_id = ?') && trimmed.includes('WHERE user_id = ?')) {
        const [targetUserId, fromUserId] = params;
        let count = 0;
        for (const [key, val] of Array.from(this.tables.historial_cajas.entries())) {
          if ((val.user_id || 'guest_local') === fromUserId) {
            this.tables.historial_cajas.set(key, { ...val, user_id: targetUserId, sync_status: 'PENDING' });
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }
      return { rows: [], rowsAffected: 0 };
    }

    if (trimmed.startsWith('SELECT') && trimmed.includes('FROM historial_cajas')) {
      let items = Array.from(this.tables.historial_cajas.values());
      if (trimmed.includes('WHERE user_id = ?')) {
        items = items.filter(h => (h.user_id || 'guest_local') === params[0]);
      }
      if (trimmed.includes('ORDER BY') || trimmed.includes('DESC')) {
        items.sort((a, b) => b.id.localeCompare(a.id));
      }
      return { rows: items as T[], rowsAffected: 0 };
    }

    if (trimmed.startsWith('DELETE FROM historial_cajas')) {
      if (trimmed.includes('WHERE id = ?')) {
        const deleted = this.tables.historial_cajas.delete(params[0]);
        return { rows: [], rowsAffected: deleted ? 1 : 0 };
      }
      if (trimmed.includes('WHERE user_id = ?')) {
        let count = 0;
        for (const [key, val] of Array.from(this.tables.historial_cajas.entries())) {
          if ((val.user_id || 'guest_local') === params[0]) {
            this.tables.historial_cajas.delete(key);
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }
      this.tables.historial_cajas.clear();
      return { rows: [], rowsAffected: 1 };
    }

    // ---------------- Usuario Sesion ----------------
    if (trimmed.startsWith('INSERT INTO usuario_sesion') || trimmed.startsWith('INSERT OR REPLACE INTO usuario_sesion')) {
      const [id, is_logged_in, name, business_name, email, avatar_uri, updated_at] = params;
      this.tables.usuario_sesion.set(id, { id, is_logged_in, name, business_name, email, avatar_uri: avatar_uri ?? null, updated_at: updated_at ?? '' });
      return { rows: [], rowsAffected: 1 };
    }

    if (trimmed.startsWith('SELECT') && trimmed.includes('FROM usuario_sesion')) {
      let items = Array.from(this.tables.usuario_sesion.values());
      if (trimmed.includes('WHERE id = ?')) {
        items = items.filter(u => u.id === params[0]);
      }
      return { rows: items as T[], rowsAffected: 0 };
    }

    if (trimmed.startsWith('DELETE FROM usuario_sesion')) {
      if (trimmed.includes('WHERE id = ?')) {
        this.tables.usuario_sesion.delete(params[0]);
        return { rows: [], rowsAffected: 1 };
      }
      this.tables.usuario_sesion.clear();
      return { rows: [], rowsAffected: 1 };
    }

    // ---------------- Sync Queue ----------------
    if (trimmed.startsWith('INSERT INTO sync_queue') || trimmed.startsWith('INSERT OR REPLACE INTO sync_queue')) {
      const [id, user_id, table_name, record_id, action, payload_json, created_at, status, retry_count, last_error] = params;
      this.tables.sync_queue.set(id, {
        id, user_id, table_name, record_id, action, payload_json, created_at, status, retry_count: retry_count || 0, last_error: last_error ?? null,
      });
      return { rows: [], rowsAffected: 1 };
    }

    if (trimmed.startsWith('SELECT') && trimmed.includes('FROM sync_queue')) {
      const norm = trimmed.toLowerCase().replace(/\s+/g, ' ');
      let items = Array.from(this.tables.sync_queue.values());
      if (norm.includes("status in ('pending', 'failed')") || norm.includes("status in ('pending', 'failed')")) {
        items = items.filter(q => q.user_id === params[0] && (q.status === 'PENDING' || q.status === 'FAILED'));
      } else if (norm.includes('where user_id = ? and status = ?')) {
        items = items.filter(q => q.user_id === params[0] && q.status === params[1]);
      } else if (norm.includes('where user_id = ?')) {
        items = items.filter(q => q.user_id === params[0]);
      } else if (norm.includes('where status = ?')) {
        items = items.filter(q => q.status === params[0]);
      }
      if (norm.includes('order by created_at asc')) {
        items.sort((a, b) => a.created_at.localeCompare(b.created_at));
      }
      if (norm.includes('limit ?')) {
        const limit = Number(params[params.length - 1]);
        if (!isNaN(limit)) items = items.slice(0, limit);
      }
      return { rows: items as T[], rowsAffected: 0 };
    }

    if (trimmed.startsWith('UPDATE sync_queue')) {
      const norm = trimmed.toLowerCase().replace(/\s+/g, ' ');
      if (norm.includes('retry_count = ?') && norm.includes('where id = ?')) {
        const id = params[params.length - 1];
        const status = params[0];
        const retry_count = params[1];
        const last_error = params[2];
        const existing = this.tables.sync_queue.get(id);
        if (existing) {
          this.tables.sync_queue.set(id, { ...existing, status, retry_count, last_error });
          return { rows: [], rowsAffected: 1 };
        }
      } else if (norm.includes('set status = ?') && norm.includes('where id = ?')) {
        const id = params[params.length - 1];
        const status = params[0];
        const existing = this.tables.sync_queue.get(id);
        if (existing) {
          this.tables.sync_queue.set(id, { ...existing, status });
          return { rows: [], rowsAffected: 1 };
        }
      }
      return { rows: [], rowsAffected: 0 };
    }

    if (trimmed.startsWith('DELETE FROM sync_queue')) {
      if (trimmed.includes('WHERE id = ?')) {
        const deleted = this.tables.sync_queue.delete(params[0]);
        return { rows: [], rowsAffected: deleted ? 1 : 0 };
      }
      if (trimmed.includes('WHERE user_id = ?')) {
        let count = 0;
        for (const [key, val] of Array.from(this.tables.sync_queue.entries())) {
          if (val.user_id === params[0]) {
            this.tables.sync_queue.delete(key);
            count++;
          }
        }
        return { rows: [], rowsAffected: count };
      }
      this.tables.sync_queue.clear();
      return { rows: [], rowsAffected: 1 };
    }

    return { rows: [], rowsAffected: 0 };
  }

  async transaction<T>(fn: (tx: IDatabase) => Promise<T>): Promise<T> {
    return fn(this);
  }

  async close(): Promise<void> {
    this.tables.jornadas.clear();
    this.tables.movimientos.clear();
    this.tables.eventos_pago.clear();
    this.tables.historial_cajas.clear();
    this.tables.usuario_sesion.clear();
    this.tables.sync_queue.clear();
  }

  async clearAllTables(): Promise<void> {
    this.tables.jornadas.clear();
    this.tables.movimientos.clear();
    this.tables.eventos_pago.clear();
    this.tables.historial_cajas.clear();
    this.tables.usuario_sesion.clear();
    this.tables.sync_queue.clear();
  }
}

// -------------------------------------------------------------
// Singleton / Inicializador de Base de Datos
// -------------------------------------------------------------
let dbInstance: IDatabase | null = null;
let isForcedMemory = false;

export const setForceMemoryDatabase = (enable: boolean) => {
  isForcedMemory = enable;
  if (enable) {
    dbInstance = new MemorySQLiteDatabase();
  } else {
    dbInstance = null;
  }
};

export const getDatabase = async (): Promise<IDatabase> => {
  if (dbInstance) return dbInstance;

  const isTest = typeof process !== 'undefined' && Boolean(process?.env && process.env.NODE_ENV === 'test');
  if (isForcedMemory || isTest) {
    const memDb = new MemorySQLiteDatabase();
    for (const sql of CREATE_TABLES_SQL) {
      await memDb.execute(sql);
    }
    dbInstance = memDb;
    return dbInstance;
  }

  try {
    // Intentar inicializar @op-engineering/op-sqlite en entorno nativo
    const { open } = require('@op-engineering/op-sqlite');
    const nativeDb = open({ name: 'cuadramos.db' });
    const adapter = new NativeSQLiteDatabase(nativeDb);

    for (const sql of CREATE_TABLES_SQL) {
      await adapter.execute(sql);
    }

    dbInstance = adapter;
    return dbInstance;
  } catch {
    // Si no está disponible el binario nativo (por ejemplo en Jest o pruebas sin emulador),
    // usar el driver en memoria seguro para evitar que la aplicación falle.
    const memDb = new MemorySQLiteDatabase();
    for (const sql of CREATE_TABLES_SQL) {
      await memDb.execute(sql);
    }
    dbInstance = memDb;
    return dbInstance;
  }
};
