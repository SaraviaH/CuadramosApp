import { TipoMovimiento } from '../movimientos/movimiento.types';

export type TabPrincipal = 'INICIO' | 'MOVIMIENTOS' | 'RESUMEN' | 'HISTORIAL_CAJAS' | 'MAS';

export type Ruta =
  | TabPrincipal
  | 'BIENVENIDA'
  | 'ABRIR_JORNADA'
  | 'NUEVO_MOVIMIENTO'
  | 'MOVIMIENTO'       // Alias retrocompatible
  | 'BALANCE'          // Alias retrocompatible
  | 'HISTORIAL'        // Alias retrocompatible
  | 'CERRAR_JORNADA'
  | 'SIMULADOR'
  | 'DEMO'             // Alias retrocompatible
  | 'HISTORIAL_CAJAS'
  | 'CONFIGURACION'    // Alias retrocompatible
  | 'LOGIN'
  | 'REGISTRO';

/** Parámetros opcionales que acompañan a una navegación. */
export interface NavigationParams {
  /** Tipo preseleccionado al abrir el formulario de nuevo movimiento. */
  movimientoTipo?: TipoMovimiento;
  /** Filtro preseleccionado al abrir la pantalla de movimientos. */
  filtroTipo?: TipoMovimiento | 'TODOS';
  /** Filtro inicial para deep-linking desde Inicio ('INGRESOS', 'GASTOS', etc.). */
  filtroInicial?: 'INGRESOS' | 'GASTOS' | 'TODOS' | TipoMovimiento;
}

export type NavigateFn = (route: Ruta, params?: NavigationParams) => void;
