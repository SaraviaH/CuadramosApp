import { GUEST_USER_ID } from '../../types';
import {
  getDatabase,
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  boxHistoryRepository,
  syncQueueRepository,
} from '../../storage';
import { supabase, isSupabaseConfigured } from '../supabase/supabaseClient';

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  error?: string;
}

export const syncService = {
  /**
   * Procesa la cola de operaciones pendientes y las envía a Supabase
   */
  async syncPendingChanges(userId: string): Promise<SyncResult> {
    if (!userId || userId === GUEST_USER_ID) {
      return { success: true, syncedCount: 0, failedCount: 0 };
    }

    if (!isSupabaseConfigured()) {
      return { success: false, syncedCount: 0, failedCount: 0, error: 'Supabase no está configurado.' };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session || sessionData.session.user.id !== userId) {
      return { success: false, syncedCount: 0, failedCount: 0, error: 'No hay una sesión activa para este usuario.' };
    }

    const pending = await syncQueueRepository.getPendingItems(userId, 50);
    if (pending.length === 0) {
      return { success: true, syncedCount: 0, failedCount: 0 };
    }

    let syncedCount = 0;
    let failedCount = 0;
    const db = await getDatabase();

    for (const item of pending) {
      try {
        await syncQueueRepository.markInFlight(item.id);
        const payload = JSON.parse(item.payloadJson);

        let error: any = null;

        if (item.tableName === 'jornadas') {
          const res = await supabase.from('jornadas').upsert({
            id: payload.id,
            user_id: userId,
            saldo_inicial: payload.saldoInicial,
            estado: payload.estado,
            fecha_hora_apertura: payload.fechaHoraApertura,
            fecha_hora_cierre: payload.fechaHoraCierre ?? null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
          error = res.error;
          if (!error) {
            await db.execute(
              `UPDATE jornadas SET sync_status = 'SYNCED' WHERE id = ?;`,
              [item.recordId],
            );
          }
        } else if (item.tableName === 'movimientos') {
          const res = await supabase.from('movimientos').upsert({
            id: payload.id,
            user_id: userId,
            jornada_id: payload.jornadaId,
            tipo: payload.tipo,
            origen: payload.origen,
            monto: payload.monto,
            concepto: payload.concepto,
            categoria: payload.categoria ?? null,
            metodo_pago: payload.metodoPago ?? null,
            descripcion: payload.descripcion ?? null,
            fecha_hora_origen: payload.fechaHoraOrigen,
            hora_legible: payload.horaLegible ?? null,
            fecha_legible: payload.fechaLegible ?? null,
            referencia_evento_pago: payload.referenciaEventoPago ?? null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
          error = res.error;
          if (!error) {
            await db.execute(
              `UPDATE movimientos SET sync_status = 'SYNCED' WHERE id = ?;`,
              [item.recordId],
            );
          }
        } else if (item.tableName === 'eventos_pago') {
          const res = await supabase.from('eventos_pago').upsert({
            id_operacion: payload.idOperacion,
            user_id: userId,
            jornada_id: payload.jornadaId,
            monto: payload.monto,
            concepto: payload.concepto,
            origen_referencia: payload.origenReferencia,
            tipo_evento: payload.tipoEvento,
            estado: payload.estado,
            fecha_hora_evento: payload.fechaHoraEvento,
            fecha_hora_procesamiento: payload.fechaHoraProcesamiento ?? null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id_operacion' });
          error = res.error;
          if (!error) {
            await db.execute(
              `UPDATE eventos_pago SET sync_status = 'SYNCED' WHERE id_operacion = ?;`,
              [item.recordId],
            );
          }
        } else if (item.tableName === 'historial_cajas') {
          const res = await supabase.from('historial_cajas').upsert({
            id: payload.id,
            user_id: userId,
            fecha: payload.fecha,
            hora_apertura: payload.horaApertura,
            hora_cierre: payload.horaCierre,
            saldo_inicial: payload.saldoInicial,
            ingresos: payload.ingresos,
            gastos: payload.gastos,
            retiros: payload.retiros,
            saldo_esperado: payload.saldoEsperado,
            saldo_real: payload.saldoReal,
            diferencia: payload.diferencia,
            movimientos_json: payload.movimientos || [],
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
          error = res.error;
          if (!error) {
            await db.execute(
              `UPDATE historial_cajas SET sync_status = 'SYNCED' WHERE id = ?;`,
              [item.recordId],
            );
          }
        }

        if (error) {
          failedCount++;
          await syncQueueRepository.markFailed(item.id, error.message || 'Error en Supabase', item.retryCount + 1);
        } else {
          syncedCount++;
          await syncQueueRepository.remove(item.id);
        }
      } catch (err: any) {
        failedCount++;
        await syncQueueRepository.markFailed(item.id, err?.message || 'Error de red', item.retryCount + 1);
      }
    }

    return {
      success: failedCount === 0,
      syncedCount,
      failedCount,
    };
  },

  /**
   * Descarga la información del usuario desde la nube a SQLite (nuevo dispositivo o reinstalación)
   */
  async pullUserDataFromCloud(userId: string): Promise<{ success: boolean; count: number }> {
    if (!userId || userId === GUEST_USER_ID || !isSupabaseConfigured()) {
      return { success: false, count: 0 };
    }

    try {
      let count = 0;

      // 1. Descargar jornadas
      const { data: jornadasCloud } = await supabase
        .from('jornadas')
        .select('*')
        .eq('user_id', userId)
        .order('fecha_hora_apertura', { ascending: true });

      if (jornadasCloud && jornadasCloud.length > 0) {
        for (const j of jornadasCloud) {
          await jornadaSqliteRepository.insertJornada({
            id: j.id,
            userId,
            saldoInicial: Number(j.saldo_inicial),
            estado: j.estado,
            fechaHoraApertura: j.fecha_hora_apertura,
            fechaHoraCierre: j.fecha_hora_cierre,
            syncStatus: 'SYNCED',
            updatedAt: j.updated_at,
          });
          count++;
        }
      }

      // 2. Descargar movimientos
      const { data: movsCloud } = await supabase
        .from('movimientos')
        .select('*')
        .eq('user_id', userId)
        .order('fecha_hora_origen', { ascending: true });

      if (movsCloud && movsCloud.length > 0) {
        for (const m of movsCloud) {
          await movimientoSqliteRepository.insertMovimiento({
            id: m.id,
            userId,
            tipo: m.tipo,
            origen: m.origen,
            monto: Number(m.monto),
            concepto: m.concepto,
            categoria: m.categoria,
            metodoPago: m.metodo_pago,
            descripcion: m.descripcion,
            fechaHoraOrigen: m.fecha_hora_origen,
            horaLegible: m.hora_legible,
            fechaLegible: m.fecha_legible,
            jornadaId: m.jornada_id,
            referenciaEventoPago: m.referencia_evento_pago,
            syncStatus: 'SYNCED',
            updatedAt: m.updated_at,
          });
          count++;
        }
      }

      // 3. Descargar historial de cajas
      const { data: cajasCloud } = await supabase
        .from('historial_cajas')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (cajasCloud && cajasCloud.length > 0) {
        for (const c of cajasCloud) {
          await boxHistoryRepository.appendClosedBox({
            id: c.id,
            userId,
            fecha: c.fecha,
            fechaHoraApertura: c.fecha_hora_apertura ?? c.updated_at,
            horaApertura: c.hora_apertura,
            horaCierre: c.hora_cierre,
            saldoInicial: Number(c.saldo_inicial),
            ingresos: Number(c.ingresos),
            gastos: Number(c.gastos),
            retiros: Number(c.retiros),
            saldoEsperado: Number(c.saldo_esperado),
            saldoReal: Number(c.saldo_real),
            diferencia: Number(c.diferencia),
            movimientos: Array.isArray(c.movimientos_json) ? c.movimientos_json : [],
            syncStatus: 'SYNCED',
            updatedAt: c.updated_at,
          });
          count++;
        }
      }

      return { success: true, count };
    } catch {
      return { success: false, count: 0 };
    }
  },

  /**
   * Encola un registro para sincronización
   */
  async enqueueForSync(
    userId: string,
    tableName: 'jornadas' | 'movimientos' | 'eventos_pago' | 'historial_cajas',
    recordId: string,
    action: 'INSERT' | 'UPDATE' | 'DELETE',
    payload: any,
  ): Promise<void> {
    if (!userId || userId === GUEST_USER_ID) return;

    await syncQueueRepository.enqueue({
      userId,
      tableName,
      recordId,
      action,
      payload,
    });

    // Intentar sincronizar en segundo plano de forma no bloqueante
    this.syncPendingChanges(userId).catch(() => {});
  },
};
