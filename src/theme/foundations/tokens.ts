import { Platform } from 'react-native';

export const Colors = {
  // Paleta principal solicitada
  brand: '#D5005D',        // Magenta principal de identidad
  brandDark: '#A90048',    // Magenta oscuro para cabeceras y elementos destacados
  brandSoft: '#FCE4EE',    // Magenta suave para fondos, badges y estados secundarios
  accent: '#FFB800',       // Amarillo/Naranja de acento
  accentSoft: '#FFF3CC',   // Acento suave para fondos de advertencia/resaltes
  background: '#F7F7F8',   // Fondo general claro
  surface: '#FFFFFF',      // Superficie de tarjetas y contenedores
  text: '#1F1F1F',         // Texto principal de alto contraste
  textMuted: '#6B7280',    // Texto secundario y etiquetas auxiliares
  success: '#18864B',      // Verde para ingresos y estados positivos
  danger: '#C73A3A',       // Rojo para egresos, errores y acciones destructivas
  warning: '#B7791F',      // Ámbar para pendientes y advertencias

  // Tonos auxiliares armónicos
  successSoft: '#E8F5EE',  // Fondo suave para ingresos y éxito
  dangerSoft: '#FDF0F0',   // Fondo suave para egresos y errores
  warningSoft: '#FFF8E6',  // Fondo suave para pagos pendientes
  neutralSoft: '#F3F4F6',  // Fondo para controles neutros e inputs
  border: '#E5E7EB',       // Bordes sutiles para tarjetas y separadores
  borderLight: '#F3F4F6',  // Borde muy sutil
  borderFocus: '#D5005D',  // Borde activo de inputs
  white: '#FFFFFF',        // Blanco absoluto
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)', // Máscara de oscurecimiento modal
} as const;

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const Sizes = {
  iconSm: 16,
  icon: 20,
  iconLg: 26,
  touchTarget: 48,
  buttonHeight: 50,
  inputHeight: 52,
  contentWidth: 640,
} as const;

export const Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: '#1F1F1F',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
    },
    android: { elevation: 1 },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#1F1F1F',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
    default: {},
  }),
  hero: Platform.select({
    ios: {
      shadowColor: '#A90048',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 18,
    },
    android: { elevation: 5 },
    default: {},
  }),
  button: Platform.select({
    ios: {
      shadowColor: '#D5005D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
};

export const Typography = {
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  heading: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  captionBold: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as const,
  },
};

