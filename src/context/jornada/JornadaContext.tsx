import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Balance, EventoPago, Jornada, MetodoPago, Movimiento, TipoEventoPago, TipoMovimiento } from '../../types';
import { calculateBalance } from '../../utils';
import {
  getDatabase,
  migrateFromAsyncStorageToSQLite,
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
} from '../../storage';
import { eventoPagoService, jornadaService, movimientoService, syncService, NotificationMessage } from '../../services';
import { useAuth } from '../auth/AuthContext';

interface JornadaContextValue {
  isLoading: boolean;
  jornadaActual: Jornada | null;
  movimientos: Movimiento[];
  allMovimientos: Movimiento[];
  eventosPendientes: EventoPago[];
  balance: Balance | null;
  notification: NotificationMessage | null;
  dismissNotification: () => void;
  refresh: () => Promise<void>;
  openDay: (saldoInicial: number) => Promise<void>;
  closeDay: () => Promise<void>;
  addMovement: (
    tipo: TipoMovimiento,
    monto: number,
    concepto: string,
    categoria?: string,
    metodoPago?: MetodoPago,
    descripcion?: string,
  ) => Promise<void>;
  createPaymentEvent: (monto: number, concepto: string, tipo: TipoEventoPago) => Promise<void>;
  confirmPaymentEvent: (idOperacion: string) => Promise<void>;
  cancelPaymentEvent: (idOperacion: string) => Promise<void>;
}

const JornadaContext = createContext<JornadaContextValue | undefined>(undefined);

export function JornadaProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [jornadaActual, setJornadaActual] = useState<Jornada | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [allMovimientos, setAllMovimientos] = useState<Movimiento[]>([]);
  const [eventosPendientes, setEventosPendientes] = useState<EventoPago[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);

  const refresh = useCallback(async () => {
    const active = await jornadaSqliteRepository.getActiveJornada(user.id);
    const all = await movimientoService.getAllForUser(user.id);
    setAllMovimientos(all);

    if (!active) {
      setJornadaActual(null);
      setMovimientos([]);
      setEventosPendientes([]);
      setBalance(null);
      return;
    }

    const [currentMovements, currentPending] = await Promise.all([
      movimientoSqliteRepository.getMovimientosByJornadaId(active.id),
      eventoPagoSqliteRepository.getEventosPendientesByJornada(active.id),
    ]);

    setJornadaActual(active);
    setMovimientos(currentMovements);
    setEventosPendientes(currentPending);
    setBalance(calculateBalance(active.saldoInicial, currentMovements));
  }, [user.id]);

  useEffect(() => {
    let isMounted = true;
    const initialize = async () => {
      try {
        await getDatabase();
        await migrateFromAsyncStorageToSQLite();
        if (isMounted) {
          await refresh();
        }
      } catch {
        if (isMounted) {
          setNotification({ kind: 'error', message: 'No se pudo recuperar la información guardada.' });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();
    return () => {
      isMounted = false;
    };
  }, [refresh]);

  // Reaccionar a cambios de usuario (Login, Logout, Cambio de cuenta)
  useEffect(() => {
    refresh();
    if (user.isLoggedIn && user.id && user.id !== 'guest_local') {
      // Si el usuario acaba de iniciar sesión, intentar sincronizar pendientes y restaurar datos
      syncService.pullUserDataFromCloud(user.id).then(res => {
        if (res.success && res.count > 0) {
          refresh();
        }
      }).catch(() => {});
      syncService.syncPendingChanges(user.id).catch(() => {});
    }
  }, [user.id, user.isLoggedIn, refresh]);

  const runAction = useCallback(async (action: () => Promise<unknown>, successMessage: string) => {
    try {
      await action();
      await refresh();
      setNotification({ kind: 'success', message: successMessage });
      if (user.isLoggedIn && user.id && user.id !== 'guest_local') {
        syncService.syncPendingChanges(user.id).catch(() => {});
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      setNotification({ kind: 'error', message });
      throw error;
    }
  }, [refresh, user]);

  const value = useMemo<JornadaContextValue>(() => ({
    isLoading,
    jornadaActual,
    movimientos,
    allMovimientos,
    eventosPendientes,
    balance,
    notification,
    dismissNotification: () => setNotification(null),
    refresh,
    openDay: saldoInicial => runAction(() => jornadaService.open(saldoInicial), 'Jornada abierta correctamente.'),
    closeDay: () => runAction(() => jornadaService.close(), 'Jornada cerrada correctamente.'),
    addMovement: (tipo, monto, concepto, categoria, metodoPago, descripcion) => {
      const action =
        tipo === 'INGRESO'
          ? movimientoService.createIngreso
          : movimientoService.createEgreso;
      const successMessage =
        tipo === 'INGRESO'
          ? 'Ingreso registrado correctamente.'
          : 'Gasto registrado correctamente.';
      return runAction(() => action(monto, concepto, categoria, metodoPago, descripcion), successMessage);
    },
    createPaymentEvent: (monto, concepto, tipo) =>
      runAction(() => eventoPagoService.create(monto, concepto, tipo), 'Pago simulado. Confírmalo o cancélalo antes del cierre.'),
    confirmPaymentEvent: id => runAction(() => eventoPagoService.confirm(id), 'Pago confirmado y movimiento automático creado.'),
    cancelPaymentEvent: id => runAction(() => eventoPagoService.cancel(id), 'Pago cancelado. El saldo no fue modificado.'),
  }), [allMovimientos, balance, eventosPendientes, isLoading, jornadaActual, movimientos, notification, refresh, runAction]);

  return <JornadaContext.Provider value={value}>{children}</JornadaContext.Provider>;
}

export const useJornada = (): JornadaContextValue => {
  const context = useContext(JornadaContext);
  if (!context) throw new Error('useJornada debe usarse dentro de JornadaProvider.');
  return context;
};
