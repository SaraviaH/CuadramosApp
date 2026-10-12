import { SyncQueueItem, SyncTable, SyncAction } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';
import { createId } from '../../utils';

interface SyncQueueRow {
  id: string;
  user_id: string;
  table_name: SyncTable;
  record_id: string;
  action: SyncAction;
  payload_json: string;
  created_at: string;
  status: 'PENDING' | 'IN_FLIGHT' | 'FAILED';
  retry_count: number;
  last_error: string | null;
}

const mapRowToSyncQueueItem = (row: SyncQueueRow): SyncQueueItem => ({
  id: row.id,
  userId: row.user_id,
  tableName: row.table_name,
  recordId: row.record_id,
  action: row.action,
  payloadJson: row.payload_json,
  createdAt: row.created_at,
  status: row.status,
  retryCount: Number(row.retry_count || 0),
  lastError: row.last_error ?? undefined,
});

export const syncQueueRepository = {
  async enqueue(
    item: {
      userId: string;
      tableName: SyncTable;
      recordId: string;
      action: SyncAction;
      payload: any;
    },
    tx?: IDatabase,
  ): Promise<SyncQueueItem> {
    const db = tx ?? (await getDatabase());
    const id = createId('sq');
    const now = new Date().toISOString();
    const payloadJson = typeof item.payload === 'string' ? item.payload : JSON.stringify(item.payload);

    await db.execute(
      `INSERT INTO sync_queue (
        id, user_id, table_name, record_id, action, payload_json, created_at, status, retry_count, last_error
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        item.userId,
        item.tableName,
        item.recordId,
        item.action,
        payloadJson,
        now,
        'PENDING',
        0,
        null,
      ],
    );

    return {
      id,
      userId: item.userId,
      tableName: item.tableName,
      recordId: item.recordId,
      action: item.action,
      payloadJson,
      createdAt: now,
      status: 'PENDING',
      retryCount: 0,
    };
  },

  async getPendingItems(userId: string, limit = 50, tx?: IDatabase): Promise<SyncQueueItem[]> {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<SyncQueueRow>(
      `SELECT id, user_id, table_name, record_id, action, payload_json, created_at, status, retry_count, last_error
       FROM sync_queue
       WHERE user_id = ? AND status IN ('PENDING', 'FAILED')
       ORDER BY created_at ASC
       LIMIT ?;`,
      [userId, limit],
    );
    return res.rows.map(mapRowToSyncQueueItem);
  },

  async markInFlight(id: string, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(`UPDATE sync_queue SET status = ? WHERE id = ?;`, ['IN_FLIGHT', id]);
  },

  async markFailed(id: string, error: string, retryCount: number, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(
      `UPDATE sync_queue SET status = ?, retry_count = ?, last_error = ? WHERE id = ?;`,
      ['FAILED', retryCount, error, id],
    );
  },

  async remove(id: string, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(`DELETE FROM sync_queue WHERE id = ?;`, [id]);
  },

  async clearQueueForUser(userId: string, tx?: IDatabase): Promise<void> {
    const db = tx ?? (await getDatabase());
    await db.execute(`DELETE FROM sync_queue WHERE user_id = ?;`, [userId]);
  },
};
