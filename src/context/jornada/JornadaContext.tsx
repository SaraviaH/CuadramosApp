import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Balance, EventoPago, Jornada, MetodoPago, Movimiento, TipoEventoPago, TipoMovimiento } from '../../types';
import { calculateBalance } from '../../utils';
import { loadState } from '../../storage';
import { eventoPagoService, jornadaService, movimientoService, NotificationMessage } from '../../services';

interface JornadaContextValue {
  isLoading: boolean;
  jornadaActual: Jornada | null;
  movimientos: Movimiento[];
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
    fecha?: string,
  ) => Promise<void>;
  createPaymentEvent: (monto: number, concepto: string, tipo: TipoEventoPago) => Promise<void>;
  confirmPaymentEvent: (idOperacion: string) => Promise<void>;
  cancelPaymentEvent: (idOperacion: string) => Promise<void>;
}

const JornadaContext = createContext<JornadaContextValue | undefined>(undefined);

export function JornadaProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [jornadaActual, setJornadaActual] = useState<Jornada | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [eventosPendientes, setEventosPendientes] = useState<EventoPago[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [notification, setNotification] = useState<NotificationMessage | null>(null);

  const refresh = useCallback(async () => {
    const state = await loadState();
    const active = state.jornadas.find(item => item.estado === 'ABIERTA') ?? null;
    const currentMovements = active ? state.movimientos.filter(item => item.jornadaId === active.id) : [];
    setJornadaActual(active);
    setMovimientos(currentMovements);
    setEventosPendientes(active ? state.eventosPago.filter(item => item.jornadaId === active.id && item.estado === 'PENDIENTE') : []);
    setBalance(active ? calculateBalance(active.saldoInicial, currentMovements) : null);
  }, []);

  useEffect(() => {
    refresh().catch(() => setNotification({ kind: 'error', message: 'No se pudo recuperar la información guardada.' })).finally(() => setIsLoading(false));
  }, [refresh]);

  const runAction = useCallback(async (action: () => Promise<unknown>, successMessage: string) => {
    try {
      await action();
      await refresh();
      setNotification({ kind: 'success', message: successMessage });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      setNotification({ kind: 'error', message });
      throw error;
    }
  }, [refresh]);

  const value = useMemo<JornadaContextValue>(() => ({
    isLoading, jornadaActual, movimientos, eventosPendientes, balance, notification,
    dismissNotification: () => setNotification(null), refresh,
    openDay: saldoInicial => runAction(() => jornadaService.open(saldoInicial), 'Jornada abierta correctamente.'),
    closeDay: () => runAction(() => jornadaService.close(), 'Jornada cerrada correctamente.'),
    addMovement: (tipo, monto, concepto, categoria, metodoPago, descripcion, fecha) => {
      const action = tipo === 'INGRESO' ? movimientoService.createIngreso : tipo === 'EGRESO' ? movimientoService.createEgreso : movimientoService.createRetiro;
      return runAction(() => action(monto, concepto, categoria, metodoPago, descripcion, fecha), 'Movimiento registrado correctamente.');
    },
    createPaymentEvent: (monto, concepto, tipo) => runAction(() => eventoPagoService.create(monto, concepto, tipo), 'Pago simulado. Confírmalo o cancélalo antes del cierre.'),
    confirmPaymentEvent: id => runAction(() => eventoPagoService.confirm(id), 'Pago confirmado y movimiento automático creado.'),
    cancelPaymentEvent: id => runAction(() => eventoPagoService.cancel(id), 'Pago cancelado. El saldo no fue modificado.'),
  }), [balance, eventosPendientes, isLoading, jornadaActual, movimientos, notification, refresh, runAction]);

  return <JornadaContext.Provider value={value}>{children}</JornadaContext.Provider>;
}

export const useJornada = (): JornadaContextValue => {
  const context = useContext(JornadaContext);
  if (!context) throw new Error('useJornada debe usarse dentro de JornadaProvider.');
  return context;
};
