import { Movimiento } from '../movimientos/movimiento.types';
import { SyncStatus } from '../sync/sync.types';

export interface RegistroHistorialCaja {
  id: string;
  userId?: string;
  fecha: string;
  horaApertura: string;
  horaCierre: string;
  saldoInicial: number;
  ingresos: number;
  gastos: number;
  retiros: number;
  saldoEsperado: number;
  saldoReal: number;
  diferencia: number;
  movimientos: Movimiento[];
  syncStatus?: SyncStatus;
  updatedAt?: string;
}
