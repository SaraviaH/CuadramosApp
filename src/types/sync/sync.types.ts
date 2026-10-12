export type SyncStatus = 'PENDING' | 'SYNCED' | 'ERROR';

export type SyncAction = 'INSERT' | 'UPDATE' | 'DELETE';

export type SyncTable = 'perfiles' | 'jornadas' | 'movimientos' | 'eventos_pago' | 'historial_cajas';

export interface SyncQueueItem {
  id: string;
  userId: string;
  tableName: SyncTable;
  recordId: string;
  action: SyncAction;
  payloadJson: string;
  createdAt: string;
  status: 'PENDING' | 'IN_FLIGHT' | 'FAILED';
  retryCount: number;
  lastError?: string | null;
}
