export type TipoMovimiento = 'INGRESO' | 'EGRESO' | 'RETIRO';
export type OrigenMovimiento = 'MANUAL' | 'AUTOMATICO';

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  origen: OrigenMovimiento;
  monto: number;
  concepto: string;
  fechaHoraOrigen: string;
  jornadaId: string;
  referenciaEventoPago: string | null;
}
