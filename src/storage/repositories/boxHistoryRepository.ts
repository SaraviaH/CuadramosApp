import AsyncStorage from '@react-native-async-storage/async-storage';
import { GUEST_USER_ID, RegistroHistorialCaja, SyncStatus } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';
import { getCachedActiveUserId, loadActiveUserId } from './userSessionRepository';

const BOX_HISTORY_KEY = '@cuadramos/box_history-v1';

export const demoBoxHistory: RegistroHistorialCaja[] = [
  {
    id: 'box-20261007',
    userId: GUEST_USER_ID,
    fecha: '07 OCT 2026',
    horaApertura: '08:00 a. m.',
    horaCierre: '07:30 p. m.',
    saldoInicial: 100.0,
    ingresos: 450.0,
    gastos: 230.0,
    retiros: 0.0,
    saldoEsperado: 320.0,
    saldoReal: 320.0,
    diferencia: 0.0,
    movimientos: [
      { id: 'h1', userId: GUEST_USER_ID, tipo: 'INGRESO', origen: 'MANUAL', monto: 150.0, concepto: 'Venta de abarrotes', categoria: 'Venta del día', metodoPago: 'Efectivo', descripcion: 'Venta de abarrotes', fechaHoraOrigen: '', horaLegible: '09:15 a. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h2', userId: GUEST_USER_ID, tipo: 'INGRESO', origen: 'MANUAL', monto: 200.0, concepto: 'Cobro cliente María', categoria: 'Cobro de cliente', metodoPago: 'Yape', descripcion: 'Cobro cliente María', fechaHoraOrigen: '', horaLegible: '11:30 a. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h3', userId: GUEST_USER_ID, tipo: 'INGRESO', origen: 'MANUAL', monto: 100.0, concepto: 'Venta bebidas', categoria: 'Venta del día', metodoPago: 'Plin', descripcion: 'Venta bebidas', fechaHoraOrigen: '', horaLegible: '02:10 p. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h4', userId: GUEST_USER_ID, tipo: 'EGRESO', origen: 'MANUAL', monto: 130.0, concepto: 'Pago de verduras', categoria: 'Compra de insumos', metodoPago: 'Efectivo', descripcion: 'Pago de verduras', fechaHoraOrigen: '', horaLegible: '03:45 p. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h5', userId: GUEST_USER_ID, tipo: 'EGRESO', origen: 'MANUAL', monto: 50.0, concepto: 'Transporte mercadería', categoria: 'Transporte', metodoPago: 'Efectivo', descripcion: 'Transporte mercadería', fechaHoraOrigen: '', horaLegible: '04:20 p. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h6', userId: GUEST_USER_ID, tipo: 'EGRESO', origen: 'MANUAL', monto: 50.0, concepto: 'Gastos de limpieza', categoria: 'Otros gastos', metodoPago: 'Efectivo', descripcion: 'Gastos de limpieza', fechaHoraOrigen: '', horaLegible: '06:00 p. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
    ],
  },
  {
    id: 'box-20261006',
    userId: GUEST_USER_ID,
    fecha: '06 OCT 2026',
    horaApertura: '08:15 a. m.',
    horaCierre: '08:00 p. m.',
    saldoInicial: 100.0,
    ingresos: 380.0,
    gastos: 120.0,
    retiros: 0.0,
    saldoEsperado: 360.0,
    saldoReal: 360.0,
    diferencia: 0.0,
    movimientos: [
      { id: 'h7', userId: GUEST_USER_ID, tipo: 'INGRESO', origen: 'MANUAL', monto: 180.0, concepto: 'Venta del día', categoria: 'Venta del día', metodoPago: 'Efectivo', descripcion: 'Venta del día', fechaHoraOrigen: '', horaLegible: '10:00 a. m.', fechaLegible: '06 OCT 2026', jornadaId: 'box-20261006', referenciaEventoPago: null },
      { id: 'h8', userId: GUEST_USER_ID, tipo: 'INGRESO', origen: 'MANUAL', monto: 200.0, concepto: 'Cobro por QR', categoria: 'Cobro de cliente', metodoPago: 'Yape', descripcion: 'Cobro por QR', fechaHoraOrigen: '', horaLegible: '01:25 p. m.', fechaLegible: '06 OCT 2026', jornadaId: 'box-20261006', referenciaEventoPago: null },
      { id: 'h9', userId: GUEST_USER_ID, tipo: 'EGRESO', origen: 'MANUAL', monto: 120.0, concepto: 'Compra de lácteos', categoria: 'Compra de insumos', metodoPago: 'Transferencia bancaria', descripcion: 'Compra de lácteos', fechaHoraOrigen: '', horaLegible: '04:10 p. m.', fechaLegible: '06 OCT 2026', jornadaId: 'box-20261006', referenciaEventoPago: null },
    ],
  },
  {
    id: 'box-20261005',
    userId: GUEST_USER_ID,
    fecha: '05 OCT 2026',
    horaApertura: '08:30 a. m.',
    horaCierre: '07:00 p. m.',
    saldoInicial: 100.0,
    ingresos: 520.0,
    gastos: 270.0,
    retiros: 0.0,
    saldoEsperado: 350.0,
    saldoReal: 350.0,
    diferencia: 0.0,
    movimientos: [
      { id: 'h10', userId: GUEST_USER_ID, tipo: 'INGRESO', origen: 'MANUAL', monto: 270.0, concepto: 'Venta de abarrotes', categoria: 'Venta del día', metodoPago: 'Tarjeta', descripcion: 'Venta de abarrotes', fechaHoraOrigen: '', horaLegible: '11:00 a. m.', fechaLegible: '05 OCT 2026', jornadaId: 'box-20261005', referenciaEventoPago: null },
      { id: 'h11', userId: GUEST_USER_ID, tipo: 'INGRESO', origen: 'MANUAL', monto: 250.0, concepto: 'Venta golosinas', categoria: 'Venta del día', metodoPago: 'Efectivo', descripcion: 'Venta golosinas', fechaHoraOrigen: '', horaLegible: '02:15 p. m.', fechaLegible: '05 OCT 2026', jornadaId: 'box-20261005', referenciaEventoPago: null },
      { id: 'h12', userId: GUEST_USER_ID, tipo: 'EGRESO', origen: 'MANUAL', monto: 210.0, concepto: 'Factura de gaseosas', categoria: 'Compra de insumos', metodoPago: 'Transferencia bancaria', descripcion: 'Factura de gaseosas', fechaHoraOrigen: '', horaLegible: '03:40 p. m.', fechaLegible: '05 OCT 2026', jornadaId: 'box-20261005', referenciaEventoPago: null },
      { id: 'h13', userId: GUEST_USER_ID, tipo: 'EGRESO', origen: 'MANUAL', monto: 60.0, concepto: 'Bolsas y empaques', categoria: 'Compra de insumos', metodoPago: 'Efectivo', descripcion: 'Bolsas y empaques', fechaHoraOrigen: '', horaLegible: '05:50 p. m.', fechaLegible: '05 OCT 2026', jornadaId: 'box-20261005', referenciaEventoPago: null },
    ],
  },
];

interface HistorialCajaRow {
  id: string;
  user_id: string;
  fecha: string;
  hora_apertura: string;
  hora_cierre: string;
  saldo_inicial: number;
  ingresos: number;
  gastos: number;
  retiros: number;
  saldo_esperado: number;
  saldo_real: number;
  diferencia: number;
  movimientos_json: string | null;
  sync_status?: string | null;
  updated_at?: string | null;
}

const mapRowToHistorial = (r: HistorialCajaRow): RegistroHistorialCaja => ({
  id: r.id,
  userId: r.user_id || GUEST_USER_ID,
  fecha: r.fecha,
  horaApertura: r.hora_apertura,
  horaCierre: r.hora_cierre,
  saldoInicial: Number(r.saldo_inicial),
  ingresos: Number(r.ingresos),
  gastos: Number(r.gastos),
  retiros: Number(r.retiros),
  saldoEsperado: Number(r.saldo_esperado),
  saldoReal: Number(r.saldo_real),
  diferencia: Number(r.diferencia),
  movimientos: r.movimientos_json ? JSON.parse(r.movimientos_json) : [],
  syncStatus: (r.sync_status as SyncStatus) || 'PENDING',
  updatedAt: r.updated_at || undefined,
});

export const loadBoxHistory = async (userId?: string, tx?: IDatabase): Promise<RegistroHistorialCaja[]> => {
  try {
    const db = tx ?? (await getDatabase());
    const targetUserId = userId || (await loadActiveUserId()) || GUEST_USER_ID;

    const res = await db.execute<HistorialCajaRow>(
      `SELECT id, user_id, fecha, hora_apertura, hora_cierre, saldo_inicial, ingresos,
              gastos, retiros, saldo_esperado, saldo_real, diferencia, movimientos_json,
              sync_status, updated_at
       FROM historial_cajas
       WHERE user_id = ?
       ORDER BY id DESC;`,
      [targetUserId],
    );

    if (res.rows && res.rows.length > 0) {
      return res.rows.map(mapRowToHistorial);
    }

    // Si SQLite está vacío y es usuario invitado, verificar si hay datos en AsyncStorage legacy
    if (targetUserId === GUEST_USER_ID) {
      const rawLegacy = await AsyncStorage.getItem(BOX_HISTORY_KEY);
      if (rawLegacy) {
        try {
          const parsed = JSON.parse(rawLegacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // Ignorar error de parsing
        }
      }
    }

    return [];
  } catch {
    return [];
  }
};

export const saveBoxHistory = async (history: RegistroHistorialCaja[], tx?: IDatabase): Promise<void> => {
  const db = tx ?? (await getDatabase());
  const now = new Date().toISOString();

  for (const record of history) {
    const userId = record.userId || getCachedActiveUserId() || GUEST_USER_ID;
    await db.execute(
      `INSERT OR REPLACE INTO historial_cajas (
        id, user_id, fecha, hora_apertura, hora_cierre, saldo_inicial, ingresos,
        gastos, retiros, saldo_esperado, saldo_real, diferencia, movimientos_json,
        sync_status, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        record.id,
        userId,
        record.fecha,
        record.horaApertura,
        record.horaCierre,
        record.saldoInicial,
        record.ingresos,
        record.gastos,
        record.retiros,
        record.saldoEsperado,
        record.saldoReal,
        record.diferencia,
        JSON.stringify(record.movimientos || []),
        record.syncStatus || 'PENDING',
        record.updatedAt || now,
      ],
    );
  }
  await AsyncStorage.setItem(BOX_HISTORY_KEY, JSON.stringify(history));
};

export const appendClosedBox = async (record: RegistroHistorialCaja, tx?: IDatabase): Promise<void> => {
  const db = tx ?? (await getDatabase());
  const userId = record.userId || getCachedActiveUserId() || GUEST_USER_ID;
  const now = new Date().toISOString();

  await db.execute(
    `INSERT OR REPLACE INTO historial_cajas (
      id, user_id, fecha, hora_apertura, hora_cierre, saldo_inicial, ingresos,
      gastos, retiros, saldo_esperado, saldo_real, diferencia, movimientos_json,
      sync_status, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      record.id,
      userId,
      record.fecha,
      record.horaApertura,
      record.horaCierre,
      record.saldoInicial,
      record.ingresos,
      record.gastos,
      record.retiros,
      record.saldoEsperado,
      record.saldoReal,
      record.diferencia,
      JSON.stringify(record.movimientos || []),
      record.syncStatus || 'PENDING',
      record.updatedAt || now,
    ],
  );

  // Sincronizar con AsyncStorage si es invitado
  if (userId === GUEST_USER_ID) {
    const existing = await loadBoxHistory(userId, tx);
    const updated = [record, ...existing.filter(b => b.id !== record.id)];
    await AsyncStorage.setItem(BOX_HISTORY_KEY, JSON.stringify(updated)).catch(() => {});
  }
};

export const clearBoxHistory = async (userId?: string, tx?: IDatabase): Promise<void> => {
  const db = tx ?? (await getDatabase());
  if (userId) {
    await db.execute(`DELETE FROM historial_cajas WHERE user_id = ?;`, [userId]);
  } else {
    await db.execute(`DELETE FROM historial_cajas;`);
  }
  await AsyncStorage.removeItem(BOX_HISTORY_KEY).catch(() => {});
};

export const migrateGuestBoxHistoryToUser = async (targetUserId: string, tx?: IDatabase): Promise<number> => {
  const db = tx ?? (await getDatabase());
  const res = await db.execute(
    `UPDATE historial_cajas SET user_id = ?, sync_status = 'PENDING' WHERE user_id = ?;`,
    [targetUserId, GUEST_USER_ID],
  );
  return res.rowsAffected || 0;
};

export const boxHistoryRepository = {
  loadBoxHistory,
  saveBoxHistory,
  appendClosedBox,
  clearBoxHistory,
  migrateGuestBoxHistoryToUser,
};

