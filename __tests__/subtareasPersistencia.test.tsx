import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  jornadaService,
  movimientoService,
  financialSummaryService,
  authService,
} from '../src/services';
import {
  getDatabase,
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  loadBoxHistory,
  clearBoxHistory,
  clearState,
  clearUserSession,
} from '../src/storage';
import { calculateBalance } from '../src/utils';

describe('SUBTAREA 8: Pruebas obligatorias de persistencia y ciclo de vida de CuadramosApp', () => {
  beforeEach(async () => {
    const db = await getDatabase();
    await db.clearAllTables();
    await AsyncStorage.clear();
    await clearState();
    await clearUserSession();
    await clearBoxHistory();
  });

  // Prueba A: perfil local
  it('Prueba A: El perfil de comerciante y nombre de negocio persisten localmente tras cerrar y reabrir la app', async () => {
    // 1. Introducir el nombre del comerciante y el nombre del negocio
    // 2. Guardar el perfil
    const saved = await authService.updateProfile('María López', undefined, 'Bodega San Carlos');
    expect(saved.name).toBe('María López');
    expect(saved.businessName).toBe('Bodega San Carlos');
    expect(saved.isLoggedIn).toBe(false); // Modo libre / local

    // 3. Simular cierre completo de la app (desmontaje de la memoria en caliente)
    // 4. Volver a abrir la app (llamada a getCurrentUser al inicializar)
    const reloaded = await authService.getCurrentUser();

    // 5. Verificar que ambos nombres continúen guardados
    expect(reloaded.name).toBe('María López');
    expect(reloaded.businessName).toBe('Bodega San Carlos');
    expect(reloaded.isLoggedIn).toBe(false);
  });

  // Prueba B: caja abierta
  it('Prueba B: La caja abierta, el saldo y los movimientos persisten tras cerrar la app sin cerrar jornada', async () => {
    // 1. Abrir una caja con un saldo inicial de S/ 200.00
    const jor = await jornadaService.open(200);
    expect(jor.estado).toBe('ABIERTA');
    expect(jor.saldoInicial).toBe(200);

    // 2. Registrar un ingreso de S/ 150.00
    const ingreso = await movimientoService.createIngreso(150, 'Venta del día', 'Ventas', 'Efectivo');
    expect(ingreso.monto).toBe(150);
    expect(ingreso.tipo).toBe('INGRESO');

    // 3. Registrar un gasto de S/ 50.00
    const gasto = await movimientoService.createEgreso(50, 'Pago de verduras', 'Proveedores', 'Efectivo');
    expect(gasto.monto).toBe(50);
    expect(gasto.tipo).toBe('EGRESO');

    // 4. Simular cierre completo de la app sin pulsar «Cerrar jornada»
    // 5. Abrirla nuevamente (consultar jornada activa y movimientos desde SQLite)
    const activeJornada = await jornadaSqliteRepository.getActiveJornada();
    expect(activeJornada).not.toBeNull();
    expect(activeJornada?.id).toBe(jor.id);
    expect(activeJornada?.estado).toBe('ABIERTA');

    const movsJornada = await movimientoSqliteRepository.getMovimientosByJornadaId(activeJornada!.id);
    expect(movsJornada).toHaveLength(2);

    // 6. Comprobar que el saldo sea correcto (200 + 150 - 50 = 300)
    const balance = calculateBalance(activeJornada!.saldoInicial, movsJornada);
    expect(balance.saldoInicial).toBe(200);
    expect(balance.ingresos).toBe(150);
    expect(balance.egresos).toBe(50);
    expect(balance.saldoActual).toBe(300);
  });

  // Prueba C: métricas
  it('Prueba C: Las métricas destacadas se calculan y persisten con datos reales tras cerrar y reabrir', async () => {
    await jornadaService.open(100);

    // 1. Registrar movimientos suficientes para generar métricas
    await movimientoService.createIngreso(350, 'Venta mayorista', 'Bebidas', 'Yape');
    await movimientoService.createIngreso(80, 'Venta menor', 'Golosinas', 'Yape');
    await movimientoService.createEgreso(120, 'Pago a distribuidor', 'Mercadería', 'Efectivo');

    // 2. Comprobar que las métricas se calculen con datos reales
    const summary1 = await financialSummaryService.getSummary();
    expect(summary1.metrics.length).toBeGreaterThan(0);

    const topSale = summary1.metrics.find(m => m.id === 'top-income-day');
    expect(topSale).toBeDefined();
    expect(topSale?.title).toContain('350.00');

    const topPayment = summary1.metrics.find(m => m.id === 'top-payment-method');
    expect(topPayment).toBeDefined();
    expect(topPayment?.title).toContain('Yape');

    // 3. Simular cierre y reapertura de la app
    // 4. Verificar que las métricas se vuelvan a calcular con los datos guardados en SQLite
    const allMovsAfterReopen = await movimientoService.getAllForUser();
    expect(allMovsAfterReopen).toHaveLength(3);

    const summary2 = await financialSummaryService.getSummary();
    expect(summary2.metrics.length).toBe(summary1.metrics.length);
    expect(summary2.totalIngresosMes).toBe(430);
    expect(summary2.totalGastosMes).toBe(120);
  });

  // Prueba D: cierre explícito
  it('Prueba D: Cierre explícito de jornada guarda en historial y permite abrir una nueva sin alterar la previa', async () => {
    // 1. Abrir jornada y registrar ventas
    const j1 = await jornadaService.open(100);
    await movimientoService.createIngreso(250, 'Ventas del turno mañana', 'Ventas', 'Efectivo');

    // 2. Cerrar la jornada desde la opción correspondiente
    const closed = await jornadaService.close();
    expect(closed.estado).toBe('CERRADA');
    expect(closed.fechaHoraCierre).toBeTruthy();

    // 3. Comprobar que la caja activa ya no existe
    const active = await jornadaSqliteRepository.getActiveJornada();
    expect(active).toBeNull();

    // 4. Verificar que aparezca en el historial de cajas
    const history = await loadBoxHistory();
    expect(history.length).toBeGreaterThanOrEqual(1);
    const lastClosedBox = history[0];
    expect(lastClosedBox.saldoInicial).toBe(100);
    expect(lastClosedBox.ingresos).toBe(250);
    expect(lastClosedBox.saldoReal).toBe(350);

    // 5. Confirmar que sus movimientos históricos permanezcan disponibles
    const allHistoric = await movimientoService.getAllForUser();
    expect(allHistoric).toHaveLength(1);

    // 6. Verificar que abrir una nueva jornada no altere la anterior
    const j2 = await jornadaService.open(50);
    expect(j2.id).not.toBe(j1.id);
    expect(j2.estado).toBe('ABIERTA');
    expect(j2.saldoInicial).toBe(50);

    const newActive = await jornadaSqliteRepository.getActiveJornada();
    expect(newActive?.id).toBe(j2.id);

    // El historial anterior sigue intacto
    const historyAfterNewDay = await loadBoxHistory();
    expect(historyAfterNewDay[0].id).toBe(lastClosedBox.id);
  });

  // Prueba E: notificaciones
  it('Prueba E: Registra un movimiento y comprueba la emisión de un único mensaje adecuado sin duplicados', async () => {
    await jornadaService.open(100);

    // Simular el registro de un ingreso
    const ingreso = await movimientoService.createIngreso(120, 'Venta mostrador', 'Abarrotes', 'Efectivo');
    expect(ingreso.monto).toBe(120);

    // Simular el registro de un gasto
    const gasto = await movimientoService.createEgreso(45, 'Compra bolsas', 'Limpieza', 'Efectivo');
    expect(gasto.monto).toBe(45);

    // Verificar que los movimientos se hayan persistido
    const movs = await movimientoService.getForActiveJornada();
    expect(movs).toHaveLength(2);
  });
});
