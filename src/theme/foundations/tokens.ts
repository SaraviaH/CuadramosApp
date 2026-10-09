import { Platform } from 'react-native';

export const Colors = {
  // Paleta oficial Compartamos
  brand: '#D5005D',        // Magenta principal de identidad
  brandDark: '#A90049',    // Magenta oscuro para cabeceras y elementos destacados
  brandSoft: '#FFF1F6',    // Rosa suave para fondos y badges
  accent: '#FFB800',       // Amarillo de acento
  accentSoft: '#FFF3CC',   // Acento suave

  // Semántica contable
  green: '#159B68',        // Verde para ingresos y estados positivos
  greenLight: '#EAF8F1',   // Fondo suave verde
  red: '#E64949',          // Rojo para gastos y acciones destructivas
  redLight: '#FFF0F0',     // Fondo suave rojo
  orange: '#C98515',       // Naranja para retiros
  lemon: '#FFF5C9',        // Amarillo claro para destacados
  yellow: '#FFF3C4',       // Amarillo suave

  // Acentos pasteles y visuales
  sky: '#EAF5FF',          // Azul cielo suave para simulador
  skyDark: '#1765A3',      // Azul para badges informativos
  lilac: '#F1EDFF',        // Lila suave para fondos de auditoría
  peach: '#FFE7DC',        // Durazno suave
  cream: '#FFFAF4',        // Crema

  // Neutros de interfaz
  ink: '#252525',          // Texto principal de alto contraste
  text: '#252525',         // Alias texto
  muted: '#6B6B6B',        // Texto secundario y etiquetas
  textMuted: '#6B6B6B',    // Alias texto secundario
  line: '#E6E6E9',         // Líneas y bordes
  border: '#E6E6E9',       // Alias borde
  borderLight: '#F3F4F6',  // Borde muy sutil
  borderFocus: '#D5005D',  // Borde activo
  surface: '#FFFFFF',      // Superficie de tarjetas
  background: '#F7F7F8',   // Fondo general claro
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(25, 25, 30, 0.45)', // Fondo modal oscurecido

  // Compatibilidad hacia atrás
  success: '#159B68',
  successSoft: '#EAF8F1',
  danger: '#E64949',
  dangerSoft: '#FFF0F0',
  warning: '#C98515',
  warningSoft: '#FFF3C4',
  neutralSoft: '#F3F4F6',
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

  // Radios asimétricos modernos característicos del diseño
  asymmetricCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 10,
  },
  asymmetricHero: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 12,
  },
  asymmetricButton: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 7,
  },
  asymmetricChip: {
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
    borderBottomLeftRadius: 5,
  },
  asymmetricIcon: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 5,
  },
} as const;

export const Sizes = {
  iconSm: 16,
  icon: 20,
  iconLg: 26,
  touchTarget: 48,
  buttonHeight: 54,
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

import { BASE_TYPOGRAPHY } from '../typography/textScale';

export const Typography = BASE_TYPOGRAPHY;

