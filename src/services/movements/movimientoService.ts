import { Balance, GUEST_USER_ID, MetodoPago, Movimiento, TipoMovimiento } from '../../types';
import { jornadaSqliteRepository, movimientoSqliteRepository, loadBoxHistory, loadActiveUserId } from '../../storage';
import { calculateBalance, createId, validateAmount } from '../../utils';
import { formatFriendlyDate, formatFriendlyTime } from '../../utils/formatters/format';

const create = async (
  tipo: TipoMovimiento,
  monto: number,
  concepto: string,
  origen: Movimiento['origen'],
  referenciaEventoPago: string | null,
  categoria?: string,
  metodoPago?: MetodoPago,
  descripcion?: string,
): Promise<Movimiento> => {
  if (!validateAmount(monto)) throw new Error('Ingresa un monto mayor a cero.');
  if (!concepto.trim()) throw new Error('Ingresa un concepto para el movimiento.');

  const jornada = await jornadaSqliteRepository.getActiveJornada();
  if (!jornada) throw new Error('Abre una jornada antes de registrar movimientos.');

  const now = new Date();
  const movimiento: Movimiento = {
    id: createId('mov'),
    tipo,
    origen,
    monto,
    concepto: concepto.trim(),
    categoria: categoria ?? concepto.trim(),
    metodoPago: metodoPago ?? 'Efectivo',
    descripcion: descripcion?.trim() || concepto.trim(),
    fechaHoraOrigen: now.toISOString(),
    horaLegible: formatFriendlyTime(now),
    fechaLegible: formatFriendlyDate(now),
    jornadaId: jornada.id,
    referenciaEventoPago,
    userId: jornada.userId,
    syncStatus: 'PENDING',
  };

  await movimientoSqliteRepository.insertMovimiento(movimiento);

  if (movimiento.userId && movimiento.userId !== 'guest_local') {
    const { syncQueueRepository } = require('../../storage');
    await syncQueueRepository.enqueue({
      userId: movimiento.userId,
      tableName: 'movimientos',
      recordId: movimiento.id,
      action: 'INSERT',
      payload: movimiento,
    }).catch(() => {});
  }

  return movimiento;
};

export const movimientoService = {
  createIngreso: (
    monto: number,
    concepto: string,
    categoria?: string,
    metodoPago?: MetodoPago,
    descripcion?: string,
  ) => create('INGRESO', monto, concepto, 'MANUAL', null, categoria, metodoPago, descripcion),

  createEgreso: (
    monto: number,
    concepto: string,
    categoria?: string,
    metodoPago?: MetodoPago,
    descripcion?: string,
  ) => create('EGRESO', monto, concepto, 'MANUAL', null, categoria, metodoPago, descripcion),

  createRetiro: (
    monto: number,
    concepto: string,
    categoria?: string,
    metodoPago?: MetodoPago,
    descripcion?: string,
  ) => create('RETIRO', monto, concepto, 'MANUAL', null, categoria, metodoPago, descripcion),

  async getForActiveJornada(): Promise<Movimiento[]> {
    const jornada = await jornadaSqliteRepository.getActiveJornada();
    return jornada ? movimientoSqliteRepository.getMovimientosByJornadaId(jornada.id) : [];
  },

  async calculateActiveBalance(): Promise<Balance | null> {
    const jornada = await jornadaSqliteRepository.getActiveJornada();
    if (!jornada) return null;
    const movements = await movimientoSqliteRepository.getMovimientosByJornadaId(jornada.id);
    return calculateBalance(jornada.saldoInicial, movements);
  },

  async getAllForUser(userId?: string): Promise<Movimiento[]> {
    const targetUserId = userId || (await loadActiveUserId()) || GUEST_USER_ID;
    const sqliteMovements = await movimientoSqliteRepository.getAllMovimientos(targetUserId);
    const boxHistory = await loadBoxHistory(targetUserId);

    const existingIds = new Set(sqliteMovements.map(m => m.id));
    const merged = [...sqliteMovements];

    for (const box of boxHistory) {
      if (box.movimientos && Array.isArray(box.movimientos)) {
        for (const mov of box.movimientos) {
          if (!existingIds.has(mov.id)) {
            existingIds.add(mov.id);
            merged.push(mov);
          }
        }
      }
    }

    return merged.sort((a, b) => {
      const timeA = new Date(a.fechaHoraOrigen || 0).getTime();
      const timeB = new Date(b.fechaHoraOrigen || 0).getTime();
      return timeB - timeA;
    });
  },
};
