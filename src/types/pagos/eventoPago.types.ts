export type EstadoEventoPago = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
export type TipoEventoPago = 'PAGO_RECIBIDO' | 'PAGO_REALIZADO';

export interface EventoPago {
  idOperacion: string;
  monto: number;
  concepto: string;
  origenReferencia: string;
  tipoEvento: TipoEventoPago;
  estado: EstadoEventoPago;
  fechaHoraEvento: string;
  fechaHoraProcesamiento: string | null;
  jornadaId: string;
}
