import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  authService,
  syncService,
} from '../src/services';
import {
  getDatabase,
  setActiveUserId,
  jornadaSqliteRepository,
  syncQueueRepository,
} from '../src/storage';
import { GUEST_USER_ID, Jornada } from '../src/types';

describe('Supabase Auth & Offline-First Sync Service', () => {
  beforeEach(async () => {
    const db = await getDatabase();
    await db.clearAllTables();
    await AsyncStorage.clear();
    await setActiveUserId(GUEST_USER_ID);
  });

  describe('authService', () => {
    it('returns default guest user when not logged in', async () => {
      const current = await authService.getCurrentUser();
      expect(current.isLoggedIn).toBe(false);
      expect(current.id).toBe(GUEST_USER_ID);
      expect(current.name).toBe('');
    });

    it('validates password length during registration', async () => {
      await expect(
        authService.register('Carlos', 'carlos@bodega.pe', '123'),
      ).rejects.toThrow('al menos 6 caracteres');
    });

    it('requires valid email during login and registration', async () => {
      await expect(authService.login('', '123456')).rejects.toThrow('correo electrónico');
      await expect(authService.register('Carlos', '', '123456')).rejects.toThrow('correo electrónico');
      await expect(authService.register('', 'carlos@bodega.pe', '123456')).rejects.toThrow('tu nombre');
    });

    it('logs out and clears active user while preserving guest mode', async () => {
      const user = await authService.login('demo@bodega.pe', 'password123');
      expect(user.isLoggedIn).toBe(true);

      const loggedOut = await authService.logout();
      expect(loggedOut.isLoggedIn).toBe(false);
      expect(loggedOut.id).toBe(GUEST_USER_ID);

      const current = await authService.getCurrentUser();
      expect(current.isLoggedIn).toBe(false);
    });

    it('updates profile and stores changes locally', async () => {
      const updated = await authService.updateProfile('Don José', 'file:///avatar.jpg', 'Bodega Don José');
      expect(updated.name).toBe('Don José');
      expect(updated.businessName).toBe('Bodega Don José');
      expect(updated.avatarUri).toBe('file:///avatar.jpg');

      const loaded = await authService.getCurrentUser();
      expect(loaded.name).toBe('Don José');
      expect(loaded.businessName).toBe('Bodega Don José');
    });
  });

  describe('syncService and offline queue', () => {
    it('does not send guest data to cloud sync', async () => {
      const result = await syncService.syncPendingChanges(GUEST_USER_ID);
      expect(result.success).toBe(true);
      expect(result.syncedCount).toBe(0);
    });

    it('enqueues operations for authenticated users and manages retry on network failure', async () => {
      const userId = 'usr-sync-uuid-888';
      await syncService.enqueueForSync(
        userId,
        'jornadas',
        'jor_offline_1',
        'INSERT',
        { id: 'jor_offline_1', saldoInicial: 100, estado: 'ABIERTA', fechaHoraApertura: '2026-10-12T10:00:00Z' },
      );

      const pending = await syncQueueRepository.getPendingItems(userId);
      expect(pending).toHaveLength(1);
      expect(pending[0].recordId).toBe('jor_offline_1');
      expect(pending[0].status).toBe('PENDING');

      // Simular fallo y reintento
      await syncQueueRepository.markFailed(pending[0].id, 'Error de red', 1);
      const afterFail = await syncQueueRepository.getPendingItems(userId);
      expect(afterFail).toHaveLength(1);
      expect(afterFail[0].status).toBe('FAILED');
      expect(afterFail[0].retryCount).toBe(1);

      // Limpiar al confirmar
      await syncQueueRepository.remove(pending[0].id);
      const afterRemove = await syncQueueRepository.getPendingItems(userId);
      expect(afterRemove).toHaveLength(0);
    });

    it('ensures data idempotency: multiple enqueues do not create database corruption', async () => {
      const userId = 'usr-idempotent-777';
      const jornada: Jornada = {
        id: 'jor_idem_1',
        userId,
        saldoInicial: 120,
        estado: 'ABIERTA',
        fechaHoraApertura: '2026-10-12T08:00:00Z',
        fechaHoraCierre: null,
      };

      // Inserción en SQLite
      await jornadaSqliteRepository.insertJornada(jornada);
      const first = await jornadaSqliteRepository.getActiveJornada(userId);
      expect(first?.id).toBe('jor_idem_1');

      // Re-inserción o actualización idempotente
      await jornadaSqliteRepository.insertJornada(jornada);
      const all = await jornadaSqliteRepository.getAllJornadas(userId);
      // SQLite reemplaza o ignora duplicado por clave primaria id
      expect(all.filter(j => j.id === 'jor_idem_1')).toHaveLength(1);
    });
  });
});
