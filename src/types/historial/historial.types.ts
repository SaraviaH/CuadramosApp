import { Movimiento } from '../movimientos/movimiento.types';

export interface RegistroHistorialCaja {
  id: string;
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
}
