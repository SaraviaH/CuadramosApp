import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
  loadBoxHistory,
  appendClosedBox,
  clearBoxHistory,
  loadUserSession,
  saveUserSession,
  clearUserSession,
  getDatabase,
  migrateFromAsyncStorageToSQLite,
} from '../src/storage';
import { Jornada, Movimiento, EventoPago, RegistroHistorialCaja } from '../src/types';

describe('SQLite Repositories (CRUD & Persistence)', () => {
  beforeEach(async () => {
    const db = await getDatabase();
    await db.clearAllTables();
    await AsyncStorage.clear();
  });

  describe('jornadaSqliteRepository', () => {
    it('inserts and retrieves an active jornada', async () => {
      const jornada: Jornada = {
        id: 'jor_001',
        saldoInicial: 150.0,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-10T08:00:00.000Z',
        fechaHoraCierre: null,
      };

      await jornadaSqliteRepository.insertJornada(jornada);

      const active = await jornadaSqliteRepository.getActiveJornada();
      expect(active).not.toBeNull();
      expect(active?.id).toBe('jor_001');
      expect(active?.saldoInicial).toBe(150.0);
      expect(active?.estado).toBe('ABIERTA');

      const byId = await jornadaSqliteRepository.getJornadaById('jor_001');
      expect(byId?.id).toBe('jor_001');
    });

    it('updates a jornada when closed', async () => {
      const jornada: Jornada = {
        id: 'jor_002',
        saldoInicial: 200.0,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-10T08:00:00.000Z',
        fechaHoraCierre: null,
      };
      await jornadaSqliteRepository.insertJornada(jornada);

      const closed: Jornada = {
        ...jornada,
        estado: 'CERRADA',
        fechaHoraCierre: '2026-10-10T18:00:00.000Z',
      };
      await jornadaSqliteRepository.updateJornada(closed);

      const active = await jornadaSqliteRepository.getActiveJornada();
      expect(active).toBeNull();

      const updated = await jornadaSqliteRepository.getJornadaById('jor_002');
      expect(updated?.estado).toBe('CERRADA');
      expect(updated?.fechaHoraCierre).toBe('2026-10-10T18:00:00.000Z');
    });
  });

  describe('movimientoSqliteRepository', () => {
    it('inserts, lists and deletes movements filtered by jornadaId', async () => {
      const mov1: Movimiento = {
        id: 'mov_001',
        tipo: 'INGRESO',
        origen: 'MANUAL',
        monto: 85.5,
        concepto: 'Venta de abarrotes',
        categoria: 'Ventas',
        metodoPago: 'Efectivo',
        fechaHoraOrigen: '2026-10-10T09:00:00.000Z',
        jornadaId: 'jor_001',
        referenciaEventoPago: null,
      };

      const mov2: Movimiento = {
        id: 'mov_002',
        tipo: 'EGRESO',
        origen: 'MANUAL',
        monto: 30.0,
        concepto: 'Pago de verduras',
        categoria: 'Insumos',
        metodoPago: 'Efectivo',
        fechaHoraOrigen: '2026-10-10T10:00:00.000Z',
        jornadaId: 'jor_001',
        referenciaEventoPago: null,
      };

      const movOtherJornada: Movimiento = {
        id: 'mov_003',
        tipo: 'INGRESO',
        origen: 'MANUAL',
        monto: 100.0,
        concepto: 'Venta de ayer',
        fechaHoraOrigen: '2026-10-09T10:00:00.000Z',
        jornadaId: 'jor_other',
        referenciaEventoPago: null,
      };

      await movimientoSqliteRepository.insertMovimiento(mov1);
      await movimientoSqliteRepository.insertMovimiento(mov2);
      await movimientoSqliteRepository.insertMovimiento(movOtherJornada);

      const items = await movimientoSqliteRepository.getMovimientosByJornadaId('jor_001');
      expect(items).toHaveLength(2);
      expect(items[0].id).toBe('mov_002'); // Order by fechaHoraOrigen DESC
      expect(items[1].id).toBe('mov_001');

      await movimientoSqliteRepository.deleteMovimiento('mov_001');
      const itemsAfterDelete = await movimientoSqliteRepository.getMovimientosByJornadaId('jor_001');
      expect(itemsAfterDelete).toHaveLength(1);
      expect(itemsAfterDelete[0].id).toBe('mov_002');
    });
  });

  describe('eventoPagoSqliteRepository', () => {
    it('manages pending payments and updates them upon confirmation or cancelation', async () => {
      const evento: EventoPago = {
        idOperacion: 'pago_101',
        monto: 45.0,
        concepto: 'Cobro Yape QR',
        origenReferencia: 'Yape',
        tipoEvento: 'PAGO_RECIBIDO',
        estado: 'PENDIENTE',
        fechaHoraEvento: '2026-10-10T11:00:00.000Z',
        fechaHoraProcesamiento: null,
        jornadaId: 'jor_001',
      };

      await eventoPagoSqliteRepository.insertEventoPago(evento);

      const pending = await eventoPagoSqliteRepository.getEventosPendientesByJornada('jor_001');
      expect(pending).toHaveLength(1);
      expect(pending[0].idOperacion).toBe('pago_101');

      const confirmed: EventoPago = {
        ...evento,
        estado: 'CONFIRMADO',
        fechaHoraProcesamiento: '2026-10-10T11:05:00.000Z',
      };
      await eventoPagoSqliteRepository.updateEventoPago(confirmed);

      const pendingAfter = await eventoPagoSqliteRepository.getEventosPendientesByJornada('jor_001');
      expect(pendingAfter).toHaveLength(0);

      const fetched = await eventoPagoSqliteRepository.getEventoById('pago_101');
      expect(fetched?.estado).toBe('CONFIRMADO');
    });
  });

  describe('boxHistoryRepository & userSessionRepository', () => {
    it('archives and retrieves closed box records', async () => {
      await clearBoxHistory();

      const record: RegistroHistorialCaja = {
        id: 'box-test-1',
        fecha: '10 OCT 2026',
        horaApertura: '08:00 a. m.',
        horaCierre: '08:00 p. m.',
        saldoInicial: 100,
        ingresos: 300,
        gastos: 80,
        retiros: 20,
        saldoEsperado: 300,
        saldoReal: 300,
        diferencia: 0,
        movimientos: [],
      };

      await appendClosedBox(record);
      const history = await loadBoxHistory();
      expect(history.some(b => b.id === 'box-test-1')).toBe(true);
    });

    it('manages user session in SQLite', async () => {
      await clearUserSession();
      const guest = await loadUserSession();
      expect(guest.isLoggedIn).toBe(false);

      await saveUserSession({
        isLoggedIn: true,
        name: 'Carlos Ruiz',
        businessName: 'Bodega San Carlos',
        email: 'carlos@bodega.pe',
      });

      const logged = await loadUserSession();
      expect(logged.isLoggedIn).toBe(true);
      expect(logged.name).toBe('Carlos Ruiz');
      expect(logged.email).toBe('carlos@bodega.pe');
    });
  });

  describe('Data migration from AsyncStorage', () => {
    it('migrates legacy JSON state to SQLite on first launch', async () => {
      const legacyState = {
        jornadas: [
          {
            id: 'legacy_jor_1',
            saldoInicial: 50,
            estado: 'ABIERTA',
            fechaHoraApertura: '2026-10-09T08:00:00.000Z',
            fechaHoraCierre: null,
          },
        ],
        movimientos: [
          {
            id: 'legacy_mov_1',
            tipo: 'INGRESO',
            origen: 'MANUAL',
            monto: 25,
            concepto: 'Venta inicial',
            fechaHoraOrigen: '2026-10-09T08:30:00.000Z',
            jornadaId: 'legacy_jor_1',
            referenciaEventoPago: null,
          },
        ],
        eventosPago: [],
      };

      await AsyncStorage.setItem('@cuadramos/state-v1', JSON.stringify(legacyState));

      const migrated = await migrateFromAsyncStorageToSQLite();
      expect(migrated).toBe(true);

      const active = await jornadaSqliteRepository.getActiveJornada();
      expect(active?.id).toBe('legacy_jor_1');

      const movs = await movimientoSqliteRepository.getMovimientosByJornadaId('legacy_jor_1');
      expect(movs).toHaveLength(1);
      expect(movs[0].concepto).toBe('Venta inicial');
    });
  });
});
