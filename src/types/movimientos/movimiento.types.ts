import { SyncStatus } from '../sync/sync.types';

export type TipoMovimiento = 'INGRESO' | 'EGRESO' | 'RETIRO';
export type OrigenMovimiento = 'MANUAL' | 'AUTOMATICO';
export type MetodoPago = 'Efectivo' | 'Yape' | 'Plin' | 'Transferencia bancaria' | 'Tarjeta';

export interface Movimiento {
  id: string;
  userId?: string;
  tipo: TipoMovimiento;
  origen: OrigenMovimiento;
  monto: number;
  concepto: string;
  categoria?: string;
  metodoPago?: MetodoPago;
  descripcion?: string;
  fechaHoraOrigen: string;
  horaLegible?: string;
  fechaLegible?: string;
  jornadaId: string;
  referenciaEventoPago: string | null;
  syncStatus?: SyncStatus;
  updatedAt?: string;
}

