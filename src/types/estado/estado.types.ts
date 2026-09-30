import { EventoPago } from '../pagos/eventoPago.types';
import { Jornada } from '../jornada/jornada.types';
import { Movimiento } from '../movimientos/movimiento.types';

export interface EstadoCuadramos {
  jornadas: Jornada[];
  movimientos: Movimiento[];
  eventosPago: EventoPago[];
}

export interface Balance {
  saldoInicial: number;
  ingresos: number;
  egresos: number;
  retiros: number;
  saldoActual: number;
}
