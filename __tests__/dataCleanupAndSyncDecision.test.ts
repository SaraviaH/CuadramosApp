import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDatabase,
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
  boxHistoryRepository,
  syncQueueRepository,
  saveUserSession,
  setActiveUserId,
  loadUserSession,
} from '../src/storage';
import {
  dataCleanupService,
  syncDecisionService,
  syncService,
} from '../src/services';
import { GUEST_USER_ID, Jornada, Movimiento } from '../src/types';

describe('Data Cleanup & One-Time Sync Decision Services', () => {
  beforeEach(async () => {
    const db = await getDatabase();
    await db.clearAllTables();
    await AsyncStorage.clear();
    await setActiveUserId(GUEST_USER_ID);
  });

  describe('dataCleanupService', () => {
    it('accurately counts operational data in getOperationalDataSummary', async () => {
      const userId = 'usr_test_1';
      await jornadaSqliteRepository.insertJornada({
        id: 'jor_1',
        userId,
        saldoInicial: 100,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-16T08:00:00Z',
        fechaHoraCierre: null,
      });

      await movimientoSqliteRepository.insertMovimiento({
        id: 'mov_1',
        userId,
        tipo: 'INGRESO',
        origen: 'MANUAL',
        monto: 50,
        concepto: 'Venta',
        fechaHoraOrigen: '2026-10-16T08:30:00Z',
        jornadaId: 'jor_1',
        referenciaEventoPago: null,
      });

      await syncQueueRepository.enqueue({
        userId,
        tableName: 'movimientos',
        recordId: 'mov_1',
        action: 'INSERT',
        payload: { id: 'mov_1' },
      });

      const summary = await dataCleanupService.getOperationalDataSummary(userId);
      expect(summary.jornadasCount).toBe(1);
      expect(summary.movimientosCount).toBe(1);
      expect(summary.hasOpenJornada).toBe(true);
      expect(summary.pendingSyncCount).toBe(1);
      expect(summary.isGuest).toBe(false);
    });

    it('cleans operational data for the target user without affecting other users', async () => {
      const userA = 'user_aaa';
      const userB = 'user_bbb';

      // Datos de usuario A
      await jornadaSqliteRepository.insertJornada({
        id: 'jor_a',
        userId: userA,
        saldoInicial: 100,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-16T08:00:00Z',
        fechaHoraCierre: null,
      });
      await movimientoSqliteRepository.insertMovimiento({
        id: 'mov_a',
        userId: userA,
        tipo: 'INGRESO',
        origen: 'MANUAL',
        monto: 40,
        concepto: 'Venta A',
        fechaHoraOrigen: '2026-10-16T08:10:00Z',
        jornadaId: 'jor_a',
        referenciaEventoPago: null,
      });

      // Datos de usuario B
      await jornadaSqliteRepository.insertJornada({
        id: 'jor_b',
        userId: userB,
        saldoInicial: 200,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-16T09:00:00Z',
        fechaHoraCierre: null,
      });
      await movimientoSqliteRepository.insertMovimiento({
        id: 'mov_b',
        userId: userB,
        tipo: 'INGRESO',
        origen: 'MANUAL',
        monto: 80,
        concepto: 'Venta B',
        fechaHoraOrigen: '2026-10-16T09:10:00Z',
        jornadaId: 'jor_b',
        referenciaEventoPago: null,
      });

      // Ejecutar limpieza para Usuario A
      const result = await dataCleanupService.cleanLocalOperationalData(userA);
      expect(result.success).toBe(true);
      expect(result.deletedCounts.jornadas).toBe(1);
      expect(result.deletedCounts.movimientos).toBe(1);

      // Verificar que Usuario A ya no tiene registros
      const activeA = await jornadaSqliteRepository.getActiveJornada(userA);
      expect(activeA).toBeNull();
      const movsA = await movimientoSqliteRepository.getAllMovimientos(userA);
      expect(movsA).toHaveLength(0);

      // Verificar que Usuario B conserva todos sus registros intactos
      const activeB = await jornadaSqliteRepository.getActiveJornada(userB);
      expect(activeB?.id).toBe('jor_b');
      const movsB = await movimientoSqliteRepository.getAllMovimientos(userB);
      expect(movsB).toHaveLength(1);
      expect(movsB[0].concepto).toBe('Venta B');
    });

    it('preserves user profile, active session, and preferences during cleanup', async () => {
      const userId = 'usr_preserve_test';
      await saveUserSession({
        id: userId,
        isLoggedIn: true,
        name: 'Doña Rosa',
        businessName: 'Bodega Rosa',
        email: 'rosa@bodega.pe',
      });

      await AsyncStorage.setItem('@cuadramos/text_scale-v1', 'grande');
      await AsyncStorage.setItem('@cuadramos/welcome_seen-v1', 'true');
      await AsyncStorage.setItem('@cuadramos/auto_sync', 'false');

      // Sembrar datos legacy para verificar que se borran
      await AsyncStorage.setItem('@cuadramos/state-v1', JSON.stringify({ jornadas: [{ id: 'legacy_1' }] }));
      await AsyncStorage.setItem('@cuadramos/box_history-v1', JSON.stringify([{ id: 'legacy_box' }]));

      // Limpiar datos operativos
      await dataCleanupService.cleanLocalOperationalData(userId);

      // Sesión de usuario sigue intacta
      const session = await loadUserSession();
      expect(session.name).toBe('Doña Rosa');
      expect(session.businessName).toBe('Bodega Rosa');
      expect(session.isLoggedIn).toBe(true);

      // Preferencias siguen intactas
      expect(await AsyncStorage.getItem('@cuadramos/text_scale-v1')).toBe('grande');
      expect(await AsyncStorage.getItem('@cuadramos/welcome_seen-v1')).toBe('true');
      expect(await AsyncStorage.getItem('@cuadramos/auto_sync')).toBe('false');

      // Respaldos legacy eliminados para evitar rehidratación
      expect(await AsyncStorage.getItem('@cuadramos/state-v1')).toBeNull();
      expect(await AsyncStorage.getItem('@cuadramos/box_history-v1')).toBeNull();

      // Bandera de supresión de auto-pull activa para este usuario
      expect(await dataCleanupService.isAutoPullSuppressed(userId)).toBe(true);
    });

    it('prevents pullUserDataFromCloud from auto-restoring data after cleanup unless forced', async () => {
      const userId = 'usr_nopull_test';
      await dataCleanupService.cleanLocalOperationalData(userId);

      // pull automático respeta la limpieza
      const autoPullRes = await syncService.pullUserDataFromCloud(userId);
      expect(autoPullRes.success).toBe(true);
      expect(autoPullRes.count).toBe(0);

      // Si se fuerza manualmente, limpia la supresión
      await dataCleanupService.resetAutoPullSuppression(userId);
      expect(await dataCleanupService.isAutoPullSuppressed(userId)).toBe(false);
    });

    it('allows opening a new shift cleanly after cleanup', async () => {
      const userId = GUEST_USER_ID;
      await jornadaSqliteRepository.insertJornada({
        id: 'jor_old',
        userId,
        saldoInicial: 50,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-15T08:00:00Z',
        fechaHoraCierre: null,
      });

      // Limpiar datos
      await dataCleanupService.cleanLocalOperationalData(userId);
      expect(await jornadaSqliteRepository.getActiveJornada(userId)).toBeNull();

      // Abrir nueva jornada
      const newJornada: Jornada = {
        id: 'jor_fresh_new',
        userId,
        saldoInicial: 120,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-16T08:00:00Z',
        fechaHoraCierre: null,
      };
      await jornadaSqliteRepository.insertJornada(newJornada);

      const active = await jornadaSqliteRepository.getActiveJornada(userId);
      expect(active?.id).toBe('jor_fresh_new');
      expect(active?.saldoInicial).toBe(120);
    });
  });

  describe('syncDecisionService', () => {
    const authUserId = 'user_uuid_logged_in_777';

    it('does not prompt when user is not authenticated or in guest mode', async () => {
      const shouldPrompt = await syncDecisionService.shouldShowSyncPrompt(GUEST_USER_ID);
      expect(shouldPrompt).toBe(false);
    });

    it('does not prompt when there are no guest records to sync', async () => {
      const shouldPrompt = await syncDecisionService.shouldShowSyncPrompt(authUserId);
      expect(shouldPrompt).toBe(false);
    });

    it('prompts when authenticated user has unlinked guest records and no prior decision', async () => {
      // Crear registro en modo invitado
      await jornadaSqliteRepository.insertJornada({
        id: 'jor_guest_prompt',
        userId: GUEST_USER_ID,
        saldoInicial: 60,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-16T08:00:00Z',
        fechaHoraCierre: null,
      });

      const shouldPrompt = await syncDecisionService.shouldShowSyncPrompt(authUserId);
      expect(shouldPrompt).toBe(true);
    });

    it('dismisses prompt when user chooses "Ahora no" and does not show again for same data', async () => {
      await jornadaSqliteRepository.insertJornada({
        id: 'jor_guest_to_dismiss',
        userId: GUEST_USER_ID,
        saldoInicial: 70,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-16T08:00:00Z',
        fechaHoraCierre: null,
      });

      // Usuario selecciona "Ahora no"
      const result = await syncDecisionService.executeSyncDecision(authUserId, 'dismissed');
      expect(result.success).toBe(true);

      // Registro invitado sigue intacto (no se borró)
      const guestJor = await jornadaSqliteRepository.getActiveJornada(GUEST_USER_ID);
      expect(guestJor?.id).toBe('jor_guest_to_dismiss');

      // No se vuelve a mostrar el aviso
      const shouldPromptAfter = await syncDecisionService.shouldShowSyncPrompt(authUserId);
      expect(shouldPromptAfter).toBe(false);

      // Decisión está guardada de forma persistente
      const saved = await syncDecisionService.getSyncDecision(authUserId);
      expect(saved?.decision).toBe('dismissed');
      expect(saved?.guestSnapshotCount).toBe(1);
    });

    it('prompts again only if NEW guest data appear after a previous dismissal', async () => {
      // 1 registro de invitado
      await jornadaSqliteRepository.insertJornada({
        id: 'jor_guest_first',
        userId: GUEST_USER_ID,
        saldoInicial: 30,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-16T08:00:00Z',
        fechaHoraCierre: null,
      });

      // Descartar aviso
      await syncDecisionService.executeSyncDecision(authUserId, 'dismissed');
      expect(await syncDecisionService.shouldShowSyncPrompt(authUserId)).toBe(false);

      // Usuario cierra sesión y crea un movimiento como invitado
      await movimientoSqliteRepository.insertMovimiento({
        id: 'mov_guest_new',
        userId: GUEST_USER_ID,
        tipo: 'INGRESO',
        origen: 'MANUAL',
        monto: 25,
        concepto: 'Venta nueva de invitado',
        fechaHoraOrigen: '2026-10-16T09:00:00Z',
        jornadaId: 'jor_guest_first',
        referenciaEventoPago: null,
      });

      // Ahora el total de registros de invitado (2) es mayor al snapshot anterior (1)
      const shouldPromptNow = await syncDecisionService.shouldShowSyncPrompt(authUserId);
      expect(shouldPromptNow).toBe(true);
    });

    it('migrates guest records to user account and enqueues sync when user chooses "Sincronizar datos"', async () => {
      await jornadaSqliteRepository.insertJornada({
        id: 'jor_migrate_test',
        userId: GUEST_USER_ID,
        saldoInicial: 150,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-16T07:00:00Z',
        fechaHoraCierre: null,
      });
      await movimientoSqliteRepository.insertMovimiento({
        id: 'mov_migrate_test',
        userId: GUEST_USER_ID,
        tipo: 'INGRESO',
        origen: 'MANUAL',
        monto: 85,
        concepto: 'Cobro migrado',
        fechaHoraOrigen: '2026-10-16T07:30:00Z',
        jornadaId: 'jor_migrate_test',
        referenciaEventoPago: null,
      });

      // Usuario selecciona "Sincronizar datos"
      const res = await syncDecisionService.executeSyncDecision(authUserId, 'synced');
      expect(res.success).toBe(true);
      expect(res.migratedCount).toBe(2);

      // Los datos ahora pertenecen al usuario autenticado
      const userJornada = await jornadaSqliteRepository.getActiveJornada(authUserId);
      expect(userJornada?.id).toBe('jor_migrate_test');
      expect(userJornada?.userId).toBe(authUserId);

      // El modo invitado ya no tiene registros
      const guestJornada = await jornadaSqliteRepository.getActiveJornada(GUEST_USER_ID);
      expect(guestJornada).toBeNull();

      // Los registros están encolados en sync_queue para respaldo en la nube
      const queue = await syncQueueRepository.getPendingItems(authUserId);
      expect(queue.length).toBeGreaterThanOrEqual(2);

      // El aviso ya no se muestra nunca más
      const shouldPrompt = await syncDecisionService.shouldShowSyncPrompt(authUserId);
      expect(shouldPrompt).toBe(false);
    });
  });
});
