export const CREATE_TABLES_SQL = [
  `PRAGMA foreign_keys = ON;`,

  `CREATE TABLE IF NOT EXISTS jornadas (
    id TEXT PRIMARY KEY NOT NULL,
    saldo_inicial REAL NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('ABIERTA', 'CERRADA')),
    fecha_hora_apertura TEXT NOT NULL,
    fecha_hora_cierre TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS movimientos (
    id TEXT PRIMARY KEY NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('INGRESO', 'EGRESO', 'RETIRO')),
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
    FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS eventos_pago (
    id_operacion TEXT PRIMARY KEY NOT NULL,
    monto REAL NOT NULL CHECK(monto >= 0),
    concepto TEXT NOT NULL,
    origen_referencia TEXT NOT NULL,
    tipo_evento TEXT NOT NULL CHECK(tipo_evento IN ('PAGO_RECIBIDO', 'PAGO_REALIZADO')),
    estado TEXT NOT NULL CHECK(estado IN ('PENDIENTE', 'CONFIRMADO', 'CANCELADO')),
    fecha_hora_evento TEXT NOT NULL,
    fecha_hora_procesamiento TEXT,
    jornada_id TEXT NOT NULL,
    FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE
  );`,

  `CREATE TABLE IF NOT EXISTS historial_cajas (
    id TEXT PRIMARY KEY NOT NULL,
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
    movimientos_json TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS usuario_sesion (
    id TEXT PRIMARY KEY NOT NULL,
    is_logged_in INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    email TEXT,
    avatar_uri TEXT
  );`,

  `CREATE INDEX IF NOT EXISTS idx_jornadas_estado ON jornadas(estado);`,
  `CREATE INDEX IF NOT EXISTS idx_movimientos_jornada_id ON movimientos(jornada_id);`,
  `CREATE INDEX IF NOT EXISTS idx_eventos_pago_jornada_estado ON eventos_pago(jornada_id, estado);`,
  `CREATE INDEX IF NOT EXISTS idx_historial_cajas_fecha ON historial_cajas(id DESC);`,
];
