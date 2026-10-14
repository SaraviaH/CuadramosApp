export const CREATE_TABLES_SQL = [
  `PRAGMA foreign_keys = ON;`,

  `CREATE TABLE IF NOT EXISTS jornadas (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'guest_local',
    saldo_inicial REAL NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('ABIERTA', 'CERRADA')),
    fecha_hora_apertura TEXT NOT NULL,
    fecha_hora_cierre TEXT,
    sync_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(sync_status IN ('PENDING', 'SYNCED', 'ERROR')),
    updated_at TEXT NOT NULL DEFAULT ''
  );`,

  `CREATE TABLE IF NOT EXISTS movimientos (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'guest_local',
    tipo TEXT NOT NULL CHECK(tipo IN ('INGRESO', 'EGRESO')),
    origen TEXT NOT NULL CHECK(origen IN ('MANUAL', 'AUTOMATICO')),
    monto REAL NOT NULL CHECK(monto >= 0),
    concepto TEXT NOT NULL,
    categoria TEXT,
    metodo_pago TEXT,
    descripcion TEXT,
    fecha_hora_origen TEXT NOT NULL,
    hora_legible TEXT,
    fecha_legible TEXT,
    jornada_id TEXT NOT NULL,
    referencia_evento_pago TEXT,
    sync_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(sync_status IN ('PENDING', 'SYNCED', 'ERROR')),
    updated_at TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS eventos_pago (
    id_operacion TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'guest_local',
    monto REAL NOT NULL CHECK(monto >= 0),
    concepto TEXT NOT NULL,
    origen_referencia TEXT NOT NULL,
    tipo_evento TEXT NOT NULL CHECK(tipo_evento IN ('PAGO_RECIBIDO', 'PAGO_REALIZADO')),
    estado TEXT NOT NULL CHECK(estado IN ('PENDIENTE', 'CONFIRMADO', 'CANCELADO')),
    fecha_hora_evento TEXT NOT NULL,
    fecha_hora_procesamiento TEXT,
    jornada_id TEXT NOT NULL,
    sync_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(sync_status IN ('PENDING', 'SYNCED', 'ERROR')),
    updated_at TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS historial_cajas (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'guest_local',
    fecha TEXT NOT NULL,
    hora_apertura TEXT NOT NULL,
    hora_cierre TEXT NOT NULL,
    saldo_inicial REAL NOT NULL,
    ingresos REAL NOT NULL,
    gastos REAL NOT NULL,
    retiros REAL NOT NULL,
    saldo_esperado REAL NOT NULL,
    saldo_real REAL NOT NULL,
    diferencia REAL NOT NULL,
    movimientos_json TEXT,
    sync_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(sync_status IN ('PENDING', 'SYNCED', 'ERROR')),
    updated_at TEXT NOT NULL DEFAULT ''
  );`,

  `CREATE TABLE IF NOT EXISTS usuario_sesion (
    id TEXT PRIMARY KEY NOT NULL,
    is_logged_in INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT,
    avatar_uri TEXT,
    updated_at TEXT NOT NULL DEFAULT ''
  );`,

  `CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    table_name TEXT NOT NULL CHECK(table_name IN ('perfiles', 'jornadas', 'movimientos', 'eventos_pago', 'historial_cajas')),
    record_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK(action IN ('INSERT', 'UPDATE', 'DELETE')),
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'IN_FLIGHT', 'FAILED')),
    retry_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT
  );`,

  `CREATE INDEX IF NOT EXISTS idx_jornadas_user_estado ON jornadas(user_id, estado);`,
  `CREATE INDEX IF NOT EXISTS idx_jornadas_user_id ON jornadas(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_movimientos_user_id ON movimientos(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_movimientos_jornada_id ON movimientos(jornada_id);`,
  `CREATE INDEX IF NOT EXISTS idx_eventos_pago_user_id ON eventos_pago(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_eventos_pago_jornada_estado ON eventos_pago(jornada_id, estado);`,
  `CREATE INDEX IF NOT EXISTS idx_historial_cajas_user_id ON historial_cajas(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_historial_cajas_fecha ON historial_cajas(id DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_sync_queue_user_status ON sync_queue(user_id, status);`,
];

export const MIGRATIONS_SQL = [
  // Migración para añadir user_id, sync_status y updated_at preservando datos existentes
  `ALTER TABLE jornadas ADD COLUMN user_id TEXT NOT NULL DEFAULT 'guest_local';`,
  `ALTER TABLE jornadas ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'PENDING';`,
  `ALTER TABLE jornadas ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';`,

  `ALTER TABLE movimientos ADD COLUMN user_id TEXT NOT NULL DEFAULT 'guest_local';`,
  `ALTER TABLE movimientos ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'PENDING';`,
  `ALTER TABLE movimientos ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';`,

  `ALTER TABLE eventos_pago ADD COLUMN user_id TEXT NOT NULL DEFAULT 'guest_local';`,
  `ALTER TABLE eventos_pago ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'PENDING';`,
  `ALTER TABLE eventos_pago ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';`,

  `ALTER TABLE historial_cajas ADD COLUMN user_id TEXT NOT NULL DEFAULT 'guest_local';`,
  `ALTER TABLE historial_cajas ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'PENDING';`,
  `ALTER TABLE historial_cajas ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';`,

  `ALTER TABLE usuario_sesion ADD COLUMN updated_at TEXT NOT NULL DEFAULT '';`,
];

export const RESET_DEV_DATABASE_SQL = [
  `PRAGMA foreign_keys = OFF;`,
  `DROP TABLE IF EXISTS sync_queue;`,
  `DROP TABLE IF EXISTS usuario_sesion;`,
  `DROP TABLE IF EXISTS historial_cajas;`,
  `DROP TABLE IF EXISTS eventos_pago;`,
  `DROP TABLE IF EXISTS movimientos;`,
  `DROP TABLE IF EXISTS jornadas;`,
  `PRAGMA foreign_keys = ON;`,
  ...CREATE_TABLES_SQL,
];
