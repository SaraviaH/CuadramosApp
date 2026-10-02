import { useWindowDimensions } from 'react-native';

/**
 * Ancho en dp a partir del cual el diseño deja de caber en dos columnas
 * comfortably. Los móviles pequeños (320-328dp) quedan por debajo.
 */
export const COMPACT_BREAKPOINT = 340;

/**
 * Indica si la pantalla es lo bastante estrecha como para apilar el contenido
 * en una sola columna. Se recalcula al rotar el dispositivo.
 */
export function useCompactLayout(): boolean {
  const { width } = useWindowDimensions();
  return width < COMPACT_BREAKPOINT;
}