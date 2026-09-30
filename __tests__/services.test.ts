import { eventoPagoService, jornadaService, movimientoService } from '../src/services';
import { clearState } from '../src/storage';
import { calculateBalance } from '../src/utils';

beforeEach(async () => {
  await clearState();
});

test('calculates the balance from initial cash, income, expenses and withdrawals', () => {
  const balance = calculateBalance(100, [
    { id: '1', tipo: 'INGRESO', origen: 'MANUAL', monto: 80, concepto: 'Venta', fechaHoraOrigen: '', jornadaId: 'j', referenciaEventoPago: null },
    { id: '2', tipo: 'EGRESO', origen: 'MANUAL', monto: 30, concepto: 'Compra', fechaHoraOrigen: '', jornadaId: 'j', referenciaEventoPago: null },
    { id: '3', tipo: 'RETIRO', origen: 'MANUAL', monto: 20, concepto: 'Retiro', fechaHoraOrigen: '', jornadaId: 'j', referenciaEventoPago: null },
  ]);
  expect(balance).toEqual({ saldoInicial: 100, ingresos: 80, egresos: 30, retiros: 20, saldoActual: 130 });
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
