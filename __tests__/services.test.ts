import { authService, eventoPagoService, jornadaService, movimientoService } from '../src/services';
import { clearBoxHistory, clearState, clearUserSession, loadBoxHistory } from '../src/storage';
import { calculateBalance } from '../src/utils';

beforeEach(async () => {
  await clearState();
  await clearUserSession();
  await clearBoxHistory();
});

test('calculates the balance from initial cash, income and expenses', () => {
  const balance = calculateBalance(100, [
    { id: '1', tipo: 'INGRESO', origen: 'MANUAL', monto: 80, concepto: 'Venta', fechaHoraOrigen: '', jornadaId: 'j', referenciaEventoPago: null },
    { id: '2', tipo: 'EGRESO', origen: 'MANUAL', monto: 30, concepto: 'Compra', fechaHoraOrigen: '', jornadaId: 'j', referenciaEventoPago: null },
  ]);
  expect(balance).toEqual({ saldoInicial: 100, ingresos: 80, egresos: 30, retiros: 0, saldoActual: 150 });
});

test('blocks closing a day with a pending payment and creates one immutable automatic movement when confirmed', async () => {
  await jornadaService.open(100);
  const event = await eventoPagoService.create(45, 'Pago de cliente', 'PAGO_RECIBIDO');

  await expect(jornadaService.close()).rejects.toThrow('pagos pendientes');
  await eventoPagoService.confirm(event.idOperacion);

  const movements = await movimientoService.getForActiveJornada();
  expect(movements).toHaveLength(1);
  expect(movements[0]).toMatchObject({ tipo: 'INGRESO', origen: 'AUTOMATICO', monto: 45, referenciaEventoPago: event.idOperacion });
  await expect(jornadaService.close()).resolves.toMatchObject({ estado: 'CERRADA' });
  await expect(movimientoService.createIngreso(1, 'Movimiento tardío')).rejects.toThrow('Abre una jornada');
});

test('a canceled payment never affects the balance', async () => {
  await jornadaService.open(30);
  const event = await eventoPagoService.create(10, 'Pago descartado', 'PAGO_RECIBIDO');
  await eventoPagoService.cancel(event.idOperacion);
  await expect(movimientoService.calculateActiveBalance()).resolves.toMatchObject({ saldoActual: 30 });
});

test('archives closed box record into box history upon closing', async () => {
  await jornadaService.open(150);
  await movimientoService.createIngreso(50, 'Cobro', 'Cobro de cliente', 'Yape');
  await movimientoService.createEgreso(20, 'Pasajes', 'Transporte', 'Efectivo');

  await jornadaService.close();

  const history = await loadBoxHistory();
  expect(history.length).toBeGreaterThan(0);
  const latest = history[0];
  expect(latest.saldoInicial).toBe(150);
  expect(latest.ingresos).toBe(50);
  expect(latest.gastos).toBe(20);
  expect(latest.saldoEsperado).toBe(180);
});

test('handles optional authentication and guest session properly', async () => {
  const initial = await authService.getCurrentUser();
  expect(initial.isLoggedIn).toBe(false);

  const loggedIn = await authService.login('maria@bodega.pe', 'Password123!');
  expect(loggedIn.isLoggedIn).toBe(true);
  expect(loggedIn.email).toBe('maria@bodega.pe');

  const guestAgain = await authService.logout();
  expect(guestAgain.isLoggedIn).toBe(false);
});

test('updates and persists local merchant profile without requiring login', async () => {
  const updated = await authService.updateProfile('Don Pedro', 'file:///data/user/avatar.jpg', 'Bodega Don Pedro');
  expect(updated.name).toBe('Don Pedro');
  expect(updated.avatarUri).toBe('file:///data/user/avatar.jpg');
  expect(updated.businessName).toBe('Bodega Don Pedro');

  const loaded = await authService.getCurrentUser();
  expect(loaded.name).toBe('Don Pedro');
  expect(loaded.avatarUri).toBe('file:///data/user/avatar.jpg');
});

test('calculates financial summary strictly with real movements and no fake stats', async () => {
  const { calculateFinancialSummary } = require('../src/services');

  // Empty data case: all zeros, no metrics, no fake percentage
  const emptySummary = calculateFinancialSummary([], new Date('2026-10-10T12:00:00Z'));
  expect(emptySummary.totalIngresosMes).toBe(0);
  expect(emptySummary.totalGastosMes).toBe(0);
  expect(emptySummary.balanceNetoMes).toBe(0);
  expect(emptySummary.hasMovementsMonth).toBe(false);
  expect(emptySummary.hasWeeklyMovements).toBe(false);
  expect(emptySummary.weeklyTrendPct).toBeNull();
  expect(emptySummary.metrics).toHaveLength(0);

  // Real movements case:
  const movements = [
    {
      id: 'm1',
      tipo: 'INGRESO',
      origen: 'MANUAL',
      monto: 300,
      concepto: 'Venta abarrote',
      categoria: 'Ventas',
      fechaHoraOrigen: '2026-10-09T10:00:00Z',
      jornadaId: 'j1',
      referenciaEventoPago: null,
    },
    {
      id: 'm2',
      tipo: 'EGRESO',
      origen: 'MANUAL',
      monto: 100,
      concepto: 'Bebidas',
      categoria: 'Mercadería',
      fechaHoraOrigen: '2026-10-09T14:00:00Z',
      jornadaId: 'j1',
      referenciaEventoPago: null,
    },
    {
      id: 'm3',
      tipo: 'INGRESO',
      origen: 'MANUAL',
      monto: 200,
      concepto: 'Venta verduras',
      categoria: 'Ventas',
      fechaHoraOrigen: '2026-10-10T11:00:00Z',
      jornadaId: 'j1',
      referenciaEventoPago: null,
    },
  ];

  const summary = calculateFinancialSummary(movements, new Date('2026-10-10T12:00:00Z'));
  expect(summary.totalIngresosMes).toBe(500);
  expect(summary.totalGastosMes).toBe(100);
  expect(summary.balanceNetoMes).toBe(400); // 500 - 100
  expect(summary.hasMovementsMonth).toBe(true);
  expect(summary.hasWeeklyMovements).toBe(true);
  // Verify real metrics are generated:
  expect(summary.metrics.some((m: any) => m.id === 'top-expense' && m.title.includes('Mercadería'))).toBe(true);
  expect(summary.metrics.some((m: any) => m.id === 'top-income-day')).toBe(true);
});
