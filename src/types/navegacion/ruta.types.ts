export type TabPrincipal = 'INICIO' | 'MOVIMIENTOS' | 'RESUMEN' | 'MAS';

export type Ruta =
  | TabPrincipal
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

