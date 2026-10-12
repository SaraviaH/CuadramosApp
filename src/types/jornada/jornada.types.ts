import { SyncStatus } from '../sync/sync.types';

export type EstadoJornada = 'ABIERTA' | 'CERRADA';

export interface Jornada {
  id: string;
  userId?: string;
  saldoInicial: number;
  estado: EstadoJornada;
  fechaHoraApertura: string;
  fechaHoraCierre: string | null;
  syncStatus?: SyncStatus;
  updatedAt?: string;
}
