export type EstadoJornada = 'ABIERTA' | 'CERRADA';

export interface Jornada {
  id: string;
  saldoInicial: number;
  estado: EstadoJornada;
  fechaHoraApertura: string;
  fechaHoraCierre: string | null;
}
