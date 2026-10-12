import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
  loadBoxHistory,
  appendClosedBox,
  loadUserSession,
  saveUserSession,
  clearUserSession,
  setActiveUserId,
  getCachedActiveUserId,
  getDatabase,
  runSQLiteSchemaMigrations,
  syncQueueRepository,
} from '../src/storage';
import { CuentaUsuario, GUEST_USER_ID, Jornada, Movimiento } from '../src/types';

describe('User Separation, Guest Mode and Migration', () => {
  beforeEach(async () => {
    const db = await getDatabase();
    await db.clearAllTables();
    await AsyncStorage.clear();
    await setActiveUserId(GUEST_USER_ID);
  });

  it('keeps guest data and authenticated user data completely separated', async () => {
    // 1. Crear jornada como invitado (guest_local)
    await setActiveUserId(GUEST_USER_ID);
    const guestJornada: Jornada = {
      id: 'jor_guest_1',
      userId: GUEST_USER_ID,
      saldoInicial: 50,
      estado: 'ABIERTA',
      fechaHoraApertura: '2026-10-12T08:00:00.000Z',
      fechaHoraCierre: null,
    };
    await jornadaSqliteRepository.insertJornada(guestJornada);

    const activeGuest = await jornadaSqliteRepository.getActiveJornada(GUEST_USER_ID);
    expect(activeGuest?.id).toBe('jor_guest_1');

    // 2. Iniciar sesión como Usuario A (UUID)
    const userA_id = 'user-uuid-aaaa-1111';
    await setActiveUserId(userA_id);

    // Usuario A no debe ver la jornada abierta del invitado
    const activeUserA = await jornadaSqliteRepository.getActiveJornada(userA_id);
    expect(activeUserA).toBeNull();

    // Usuario A abre su propia jornada
    const userAJornada: Jornada = {
      id: 'jor_user_a_1',
      userId: userA_id,
      saldoInicial: 200,
      estado: 'ABIERTA',
      fechaHoraApertura: '2026-10-12T09:00:00.000Z',
      fechaHoraCierre: null,
    };
    await jornadaSqliteRepository.insertJornada(userAJornada);

    const activeUserAAfter = await jornadaSqliteRepository.getActiveJornada(userA_id);
    expect(activeUserAAfter?.id).toBe('jor_user_a_1');
    expect(activeUserAAfter?.saldoInicial).toBe(200);

    // Si volvemos al modo invitado, la jornada de guest sigue intacta y aislada
    await setActiveUserId(GUEST_USER_ID);
    const guestCheck = await jornadaSqliteRepository.getActiveJornada(GUEST_USER_ID);
    expect(guestCheck?.id).toBe('jor_guest_1');
    expect(guestCheck?.saldoInicial).toBe(50);
  });

  it('allows importing guest records to an authenticated user when authorized', async () => {
    // Modo invitado registra jornada y movimientos
    await setActiveUserId(GUEST_USER_ID);
    await jornadaSqliteRepository.insertJornada({
      id: 'jor_guest_import',
      userId: GUEST_USER_ID,
      saldoInicial: 100,
      estado: 'ABIERTA',
      fechaHoraApertura: '2026-10-12T10:00:00.000Z',
      fechaHoraCierre: null,
    });
    await movimientoSqliteRepository.insertMovimiento({
      id: 'mov_guest_1',
      userId: GUEST_USER_ID,
      tipo: 'INGRESO',
      origen: 'MANUAL',
      monto: 30,
      concepto: 'Venta inicial',
      fechaHoraOrigen: '2026-10-12T10:15:00.000Z',
      jornadaId: 'jor_guest_import',
      referenciaEventoPago: null,
    });

    // Nuevo usuario autenticado se registra
    const newUserId = 'user-new-registered-999';
    await saveUserSession({
      id: newUserId,
      isLoggedIn: true,
      name: 'Carlos Ruiz',
      businessName: 'Bodega Carlos',
      email: 'carlos@bodega.pe',
    });

    // Migración explícita con autorización
    const migratedJornadas = await jornadaSqliteRepository.migrateGuestJornadasToUser(newUserId);
    const migratedMovs = await movimientoSqliteRepository.migrateGuestMovimientosToUser(newUserId);
    expect(migratedJornadas).toBeGreaterThan(0);
    expect(migratedMovs).toBeGreaterThan(0);

    // Ahora el usuario autenticado tiene esa jornada
    await setActiveUserId(newUserId);
    const userJornada = await jornadaSqliteRepository.getActiveJornada(newUserId);
    expect(userJornada?.id).toBe('jor_guest_import');
    expect(userJornada?.userId).toBe(newUserId);

    // El modo invitado ya no tiene esa jornada
    const guestJornada = await jornadaSqliteRepository.getActiveJornada(GUEST_USER_ID);
    expect(guestJornada).toBeNull();
  });

  it('enqueues and processes items in the persistent sync queue', async () => {
    const userId = 'user-sync-test-444';
    const queueItem = await syncQueueRepository.enqueue({
      userId,
      tableName: 'movimientos',
      recordId: 'mov_test_1',
      action: 'INSERT',
      payload: { monto: 150, concepto: 'Venta sync' },
    });

    expect(queueItem.id).toBeDefined();
    expect(queueItem.status).toBe('PENDING');

    const pending = await syncQueueRepository.getPendingItems(userId);
    expect(pending).toHaveLength(1);
    expect(pending[0].recordId).toBe('mov_test_1');

    await syncQueueRepository.markInFlight(queueItem.id);
    await syncQueueRepository.remove(queueItem.id);

    const afterRemove = await syncQueueRepository.getPendingItems(userId);
    expect(afterRemove).toHaveLength(0);
  });
});
