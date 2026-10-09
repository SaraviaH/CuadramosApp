import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegistroHistorialCaja } from '../../types';

const BOX_HISTORY_KEY = '@cuadramos/box_history-v1';

export const demoBoxHistory: RegistroHistorialCaja[] = [
  {
    id: 'box-20261007',
    fecha: '07 OCT 2026',
    horaApertura: '08:00 a. m.',
    horaCierre: '07:30 p. m.',
    saldoInicial: 100.0,
    ingresos: 450.0,
    gastos: 180.0,
    retiros: 50.0,
    saldoEsperado: 320.0,
    saldoReal: 320.0,
    diferencia: 0.0,
    movimientos: [
      { id: 'h1', tipo: 'INGRESO', origen: 'MANUAL', monto: 150.0, concepto: 'Venta de abarrotes', categoria: 'Venta del día', metodoPago: 'Efectivo', descripcion: 'Venta de abarrotes', fechaHoraOrigen: '', horaLegible: '09:15 a. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h2', tipo: 'INGRESO', origen: 'MANUAL', monto: 200.0, concepto: 'Cobro cliente María', categoria: 'Cobro de cliente', metodoPago: 'Yape', descripcion: 'Cobro cliente María', fechaHoraOrigen: '', horaLegible: '11:30 a. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h3', tipo: 'INGRESO', origen: 'MANUAL', monto: 100.0, concepto: 'Venta bebidas', categoria: 'Venta del día', metodoPago: 'Plin', descripcion: 'Venta bebidas', fechaHoraOrigen: '', horaLegible: '02:10 p. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h4', tipo: 'EGRESO', origen: 'MANUAL', monto: 130.0, concepto: 'Pago de verduras', categoria: 'Compra de insumos', metodoPago: 'Efectivo', descripcion: 'Pago de verduras', fechaHoraOrigen: '', horaLegible: '03:45 p. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h5', tipo: 'EGRESO', origen: 'MANUAL', monto: 50.0, concepto: 'Transporte mercadería', categoria: 'Transporte', metodoPago: 'Efectivo', descripcion: 'Transporte mercadería', fechaHoraOrigen: '', horaLegible: '04:20 p. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
      { id: 'h6', tipo: 'RETIRO', origen: 'MANUAL', monto: 50.0, concepto: 'Retiro personal', categoria: 'Retiro personal', metodoPago: 'Efectivo', descripcion: 'Retiro personal', fechaHoraOrigen: '', horaLegible: '06:00 p. m.', fechaLegible: '07 OCT 2026', jornadaId: 'box-20261007', referenciaEventoPago: null },
    ],
  },
  {
    id: 'box-20261006',
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
      { id: 'h7', tipo: 'INGRESO', origen: 'MANUAL', monto: 180.0, concepto: 'Venta del día', categoria: 'Venta del día', metodoPago: 'Efectivo', descripcion: 'Venta del día', fechaHoraOrigen: '', horaLegible: '10:00 a. m.', fechaLegible: '06 OCT 2026', jornadaId: 'box-20261006', referenciaEventoPago: null },
      { id: 'h8', tipo: 'INGRESO', origen: 'MANUAL', monto: 200.0, concepto: 'Cobro por QR', categoria: 'Cobro de cliente', metodoPago: 'Yape', descripcion: 'Cobro por QR', fechaHoraOrigen: '', horaLegible: '01:25 p. m.', fechaLegible: '06 OCT 2026', jornadaId: 'box-20261006', referenciaEventoPago: null },
      { id: 'h9', tipo: 'EGRESO', origen: 'MANUAL', monto: 120.0, concepto: 'Compra de lácteos', categoria: 'Compra de insumos', metodoPago: 'Transferencia bancaria', descripcion: 'Compra de lácteos', fechaHoraOrigen: '', horaLegible: '04:10 p. m.', fechaLegible: '06 OCT 2026', jornadaId: 'box-20261006', referenciaEventoPago: null },
    ],
  },
  {
    id: 'box-20261005',
    fecha: '05 OCT 2026',
    horaApertura: '08:30 a. m.',
    horaCierre: '07:00 p. m.',
    saldoInicial: 100.0,
    ingresos: 520.0,
    gastos: 210.0,
    retiros: 60.0,
    saldoEsperado: 350.0,
    saldoReal: 350.0,
    diferencia: 0.0,
    movimientos: [
      { id: 'h10', tipo: 'INGRESO', origen: 'MANUAL', monto: 270.0, concepto: 'Venta de abarrotes', categoria: 'Venta del día', metodoPago: 'Tarjeta', descripcion: 'Venta de abarrotes', fechaHoraOrigen: '', horaLegible: '11:00 a. m.', fechaLegible: '05 OCT 2026', jornadaId: 'box-20261005', referenciaEventoPago: null },
      { id: 'h11', tipo: 'INGRESO', origen: 'MANUAL', monto: 250.0, concepto: 'Venta golosinas', categoria: 'Venta del día', metodoPago: 'Efectivo', descripcion: 'Venta golosinas', fechaHoraOrigen: '', horaLegible: '02:15 p. m.', fechaLegible: '05 OCT 2026', jornadaId: 'box-20261005', referenciaEventoPago: null },
      { id: 'h12', tipo: 'EGRESO', origen: 'MANUAL', monto: 210.0, concepto: 'Factura de gaseosas', categoria: 'Compra de insumos', metodoPago: 'Transferencia bancaria', descripcion: 'Factura de gaseosas', fechaHoraOrigen: '', horaLegible: '03:40 p. m.', fechaLegible: '05 OCT 2026', jornadaId: 'box-20261005', referenciaEventoPago: null },
      { id: 'h13', tipo: 'RETIRO', origen: 'MANUAL', monto: 60.0, concepto: 'Retiro para caja chica', categoria: 'Traslado de fondos', metodoPago: 'Efectivo', descripcion: 'Retiro para caja chica', fechaHoraOrigen: '', horaLegible: '05:50 p. m.', fechaLegible: '05 OCT 2026', jornadaId: 'box-20261005', referenciaEventoPago: null },
    ],
  },
];

export const loadBoxHistory = async (): Promise<RegistroHistorialCaja[]> => {
  const raw = await AsyncStorage.getItem(BOX_HISTORY_KEY);
  if (!raw) return demoBoxHistory;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return demoBoxHistory;
  } catch {
    return demoBoxHistory;
  }
};

export const saveBoxHistory = async (history: RegistroHistorialCaja[]): Promise<void> => {
  await AsyncStorage.setItem(BOX_HISTORY_KEY, JSON.stringify(history));
};

export const appendClosedBox = async (record: RegistroHistorialCaja): Promise<void> => {
  const existing = await loadBoxHistory();
  const updated = [record, ...existing.filter(b => b.id !== record.id)];
  await saveBoxHistory(updated);
};

export const clearBoxHistory = async (): Promise<void> => {
  await AsyncStorage.removeItem(BOX_HISTORY_KEY);
};
