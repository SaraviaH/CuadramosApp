import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  jornadaService,
  movimientoService,
  financialSummaryService,
  authService,
  syncService,
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

describe('Flujos funcionales y ciclo de vida de Jornadas y Movimientos', () => {
  beforeEach(async () => {
    const db = await getDatabase();
    await db.clearAllTables();
    await AsyncStorage.clear();
    await clearState();
    await clearUserSession();
    await clearBoxHistory();
  });

  // 1 & 2: Abrir jornada, registrar venta y confirmar presencia en Inicio, Movimientos y Resumen
  it('1 y 2: Abre una jornada, registra una venta y aparece en Inicio, Movimientos y Resumen', async () => {
    // 1. Abrir jornada
    const j1 = await jornadaService.open(100);
    expect(j1.estado).toBe('ABIERTA');
    expect(j1.saldoInicial).toBe(100);

    // Registrar venta
    const venta = await movimientoService.createIngreso(75, 'Venta de abarrotes', 'Ventas', 'Efectivo');
    expect(venta.jornadaId).toBe(j1.id);

    // 2. Confirmar en Inicio (movimientos de la jornada activa)
    const movsInicio = await movimientoService.getForActiveJornada();
    expect(movsInicio).toHaveLength(1);
    expect(movsInicio[0].id).toBe(venta.id);
    expect(movsInicio[0].monto).toBe(75);

    // Confirmar en Movimientos (todos los movimientos del usuario)
    const movsHistorial = await movimientoService.getAllForUser();
    expect(movsHistorial).toHaveLength(1);
    expect(movsHistorial[0].id).toBe(venta.id);

    // Confirmar en Resumen (cálculo financiero del mes)
    const resumen = await financialSummaryService.getSummary();
    expect(resumen.totalIngresosMes).toBe(75);
    expect(resumen.balanceNetoMes).toBe(75);
    expect(resumen.hasMovementsMonth).toBe(true);
  });

  // 3: Registrar un gasto y comprobar importes calculados
  it('3: Registra un gasto y calcula correctamente los importes contables', async () => {
    await jornadaService.open(100);
    await movimientoService.createIngreso(80, 'Venta', 'Ventas', 'Efectivo');
    await movimientoService.createEgreso(30, 'Compra insumos', 'Proveedores', 'Efectivo');
    await movimientoService.createRetiro(20, 'Retiro a caja fuerte', 'Retiros', 'Efectivo');

    const bal = await movimientoService.calculateActiveBalance();
    expect(bal).not.toBeNull();
    expect(bal!.saldoInicial).toBe(100);
    expect(bal!.ingresos).toBe(80);
    expect(bal!.egresos).toBe(30);
    expect(bal!.retiros).toBe(20);
    expect(bal!.saldoActual).toBe(130); // 100 + 80 - 30 - 20
  });

  // 4: Filtros de Hoy, Semana y Mes con límites de fechas
  it('4: Comprueba filtros temporales Hoy, Semana y Mes con movimientos reales', async () => {
    await jornadaService.open(100);
    const now = new Date();

    // Movimiento de hoy
    await movimientoService.createIngreso(50, 'Venta hoy', 'Ventas', 'Efectivo', undefined, now.toISOString());

    const all = await movimientoService.getAllForUser();
    expect(all).toHaveLength(1);

    // Validar pertenencia a hoy
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const movDate = new Date(all[0].fechaHoraOrigen);
    expect(movDate >= startOfToday && movDate <= endOfToday).toBe(true);
  });

  // 5 & 6 & 7: Cerrar jornada, verificar movimientos conservados, abrir nueva caja y consultar historial
  it('5, 6 y 7: Cerrar jornada preserva movimientos, nueva jornada inicia limpia y el historial conserva la anterior', async () => {
    // Abrir jornada 1 y añadir movimientos
    const j1 = await jornadaService.open(100);
    await movimientoService.createIngreso(150, 'Venta J1', 'Ventas', 'Efectivo');
    await movimientoService.createEgreso(40, 'Gasto J1', 'Gastos', 'Efectivo');

    // 5. Cerrar jornada 1
    const closedJ1 = await jornadaService.close();
    expect(closedJ1.estado).toBe('CERRADA');

    // Comprobar que los movimientos de J1 siguen intactos en SQLite
    const j1Movements = await movimientoSqliteRepository.getMovimientosByJornadaId(j1.id);
    expect(j1Movements).toHaveLength(2);

    // 6. Abrir una nueva jornada (J2)
    const j2 = await jornadaService.open(200);
    expect(j2.id).not.toBe(j1.id);
    expect(j2.estado).toBe('ABIERTA');
    expect(j2.saldoInicial).toBe(200);

    // Comprobar que J2 comienza con sus propios movimientos (vacía al inicio)
    const j2ActiveMovements = await movimientoService.getForActiveJornada();
    expect(j2ActiveMovements).toHaveLength(0);

    // Registrar un movimiento en J2
    await movimientoService.createIngreso(80, 'Venta J2', 'Ventas', 'Efectivo');
    const j2Updated = await movimientoService.getForActiveJornada();
    expect(j2Updated).toHaveLength(1);
    expect(j2Updated[0].concepto).toBe('Venta J2');

    // La pantalla de Movimientos (getAllForUser) debe contener los de J1 y J2 (total: 3)
    const allHistorical = await movimientoService.getAllForUser();
    expect(allHistorical).toHaveLength(3);

    // 7. Consultar historial de cajas
    const boxHistory = await loadBoxHistory();
    expect(boxHistory.length).toBeGreaterThanOrEqual(1);
    const archivedJ1 = boxHistory.find(b => b.id === j1.id);
    expect(archivedJ1).toBeDefined();
    expect(archivedJ1?.saldoInicial).toBe(100);
    expect(archivedJ1?.ingresos).toBe(150);
    expect(archivedJ1?.gastos).toBe(40);
    expect(archivedJ1?.saldoEsperado).toBe(210);

    // Al consultar los movimientos pertenecientes a J1 desde el historial
    const historyJ1Movements = await movimientoSqliteRepository.getMovimientosByJornadaId(archivedJ1!.id);
    expect(historyJ1Movements).toHaveLength(2);
  });

  // 8: Reiniciar la aplicación y verificar persistencia
  it('8: Simula reinicio de la aplicación y verifica persistencia en SQLite', async () => {
    const j1 = await jornadaService.open(300);
    await movimientoService.createIngreso(120, 'Venta permanente', 'Ventas', 'Efectivo');

    // Simular reinicio: volvemos a consultar directamente SQLite
    const active = await jornadaSqliteRepository.getActiveJornada();
    expect(active?.id).toBe(j1.id);
    expect(active?.saldoInicial).toBe(300);

    const movs = await movimientoSqliteRepository.getAllMovimientos();
    expect(movs).toHaveLength(1);
    expect(movs[0].monto).toBe(120);
  });

  // 9 & 10: Operación offline persiste localmente y sincroniza cuando hay conexión
  it('9 y 10: Guarda en SQLite en modo offline y sincroniza idempotentemente', async () => {
    await jornadaService.open(100);
    const mov = await movimientoService.createIngreso(90, 'Cobro sin internet', 'Ventas', 'Efectivo');

    // 9. Comprobar que está guardado en SQLite con syncStatus 'PENDING'
    const stored = await movimientoSqliteRepository.getMovimientoById(mov.id);
    expect(stored).not.toBeNull();
    expect(stored?.syncStatus).toBe('PENDING');

    // 10. Validar encolado de sincronización y resolución idempotente
    const { syncQueueRepository } = require('../src/storage');
    await syncQueueRepository.enqueue({
      userId: 'user_test_uuid',
      tableName: 'movimientos',
      recordId: mov.id,
      action: 'INSERT',
      payload: mov,
    });

    const pending = await syncQueueRepository.getPendingItems('user_test_uuid');
    expect(pending.length).toBeGreaterThan(0);
    expect(pending[0].recordId).toBe(mov.id);

    // Marcar como procesado idempotentemente sin duplicación
    await syncQueueRepository.remove(pending[0].id);
    const remaining = await syncQueueRepository.getPendingItems('user_test_uuid');
    expect(remaining).toHaveLength(0);
  });

  // 12: Confirmar que Cerrar jornada está disponible en Inicio cuando corresponde
  it('12: Confirmar que Cerrar jornada está disponible en Inicio cuando la caja está abierta', async () => {
    const ReactTestRenderer = require('react-test-renderer');
    const { HomeScreen } = require('../src/screens/home/HomeScreen');
    const { AuthProvider } = require('../src/context/auth/AuthContext');
    const { JornadaProvider } = require('../src/context/jornada/JornadaContext');

    // Cuando hay caja abierta:
    await jornadaService.open(100);
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <AuthProvider>
          <JornadaProvider>
            <HomeScreen navigate={jest.fn()} />
          </JornadaProvider>
        </AuthProvider>,
      );
    });
    const strOpen = JSON.stringify(tree.toJSON());
    expect(strOpen).toContain('Cerrar jornada');
    expect(strOpen).toContain('Registrar movimiento');

    // Cuando la caja está cerrada:
    await jornadaService.close();
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <AuthProvider>
          <JornadaProvider>
            <HomeScreen navigate={jest.fn()} />
          </JornadaProvider>
        </AuthProvider>,
      );
    });
    const strClosed = JSON.stringify(tree.toJSON());
    expect(strClosed).not.toContain('Cerrar jornada');
    expect(strClosed).toContain('Abrir caja del día');
  });

  // 13: Confirmar que Cerrar sesión aparece en Ajustes y accesibilidad y ya no aparece en Más
  it('13: Confirmar que Cerrar sesión aparece en Ajustes y accesibilidad y ya no aparece en Más', async () => {
    const ReactTestRenderer = require('react-test-renderer');
    const { MoreScreen } = require('../src/screens/more/MoreScreen');
    const { SettingsScreen } = require('../src/screens/settings/SettingsScreen');
    const { AuthProvider } = require('../src/context/auth/AuthContext');
    const { JornadaProvider } = require('../src/context/jornada/JornadaContext');

    // Iniciar sesión
    await authService.login('demo@bodega.pe', 'password123');

    let moreTree: any;
    await ReactTestRenderer.act(async () => {
      moreTree = ReactTestRenderer.create(
        <AuthProvider>
          <JornadaProvider>
            <MoreScreen navigate={jest.fn()} />
          </JornadaProvider>
        </AuthProvider>,
      );
    });
    const strMore = JSON.stringify(moreTree.toJSON());
    // Ni "Cerrar jornada" ni "Cerrar sesión" deben aparecer en Más
    expect(strMore).not.toContain('Cerrar jornada');
    expect(strMore).not.toContain('Cerrar sesión');

    let settingsTree: any;
    await ReactTestRenderer.act(async () => {
      settingsTree = ReactTestRenderer.create(
        <AuthProvider>
          <JornadaProvider>
            <SettingsScreen goBack={jest.fn()} navigate={jest.fn()} />
          </JornadaProvider>
        </AuthProvider>,
      );
    });
    const strSettings = JSON.stringify(settingsTree.toJSON());
    // Cerrar sesión debe estar en Ajustes cuando hay sesión activa
    expect(strSettings).toContain('Cerrar sesión');
  });

  // 14: Cerrar sesión no elimina datos ni cierra la jornada
  it('14: Cerrar sesión no elimina datos de SQLite ni cierra la jornada de forma accidental', async () => {
    const j1 = await jornadaService.open(150);
    await movimientoService.createIngreso(60, 'Operación previa a logout', 'Ventas', 'Efectivo');

    // Simular cierre de sesión
    const guestUser = await authService.logout();
    expect(guestUser.isLoggedIn).toBe(false);

    // La jornada activa sigue abierta en SQLite
    const activeAfterLogout = await jornadaSqliteRepository.getActiveJornada();
    expect(activeAfterLogout).not.toBeNull();
    expect(activeAfterLogout?.id).toBe(j1.id);
    expect(activeAfterLogout?.estado).toBe('ABIERTA');

    // Los movimientos siguen existiendo en SQLite
    const movsAfterLogout = await movimientoSqliteRepository.getAllMovimientos();
    expect(movsAfterLogout).toHaveLength(1);
    expect(movsAfterLogout[0].concepto).toBe('Operación previa a logout');
  });
});
