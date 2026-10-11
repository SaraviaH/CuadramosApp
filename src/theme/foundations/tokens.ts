import { Platform } from 'react-native';

export const Colors = {
  // Paleta oficial Compartamos
  brand: '#D50057',        // Magenta principal de identidad
  brandDark: '#960048',    // Vino: cabeceras y elementos destacados
  brandSoft: '#FFE9F1',    // Tinte magenta suave para fondos y badges
  brandBorder: '#F6C6DA',  // Borde magenta suave
  accent: '#FFA400',       // Mango: color de acento
  accentSoft: '#FFF2DC',   // Acento suave
  accentBorder: '#FFD79E', // Borde mango suave
  accentInk: '#7A4F00',    // Texto oscuro sobre fondos mango

  // Semántica contable (verde/rojo cálidos armonizados con la marca)
  green: '#0F7A4C',        // Verde para ingresos y estados positivos
  greenLight: '#E7F3EE',   // Fondo suave verde
  red: '#B23A34',          // Rojo para gastos y acciones destructivas
  redLight: '#FBEAE8',     // Fondo suave rojo
  orange: '#8A5A00',       // Ámbar para retiros

  // Neutros de interfaz (rampa cálida derivada del gris cálido #847770)
  text: '#2C2725',         // Texto principal de alto contraste
  muted: '#847770',        // Texto secundario y etiquetas (gris cálido)
  mutedStrong: '#6E6059',  // Texto secundario pequeño (mejor contraste AA)
  border: '#E8E4E2',       // Líneas y bordes
  borderLight: '#F1EEED',  // Borde muy sutil
  borderFocus: '#D50057',  // Borde activo
  surface: '#FFFFFF',      // Superficie de tarjetas
  background: '#F6F4F3',   // Fondo general claro
  shadow: '#2C2725',       // Color base de sombras
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(44, 39, 37, 0.45)', // Fondo modal oscurecido

  // Contenido y superficies sobre fondos de color
  onColor: 'rgba(255, 255, 255, 0.85)',              // Contenido principal sobre color
  onColorMuted: 'rgba(255, 255, 255, 0.75)',         // Texto secundario sobre color
  onColorFaint: 'rgba(255, 255, 255, 0.65)',         // Texto terciario sobre color
  onColorSurface: 'rgba(255, 255, 255, 0.22)',       // Superficie translúcida sutil
  onColorSurfaceFaint: 'rgba(255, 255, 255, 0.16)',  // Superficie translúcida muy sutil
  successBright: '#6FDC9F',                          // Verde claro para indicadores sobre color

  // Compatibilidad hacia atrás
  success: '#0F7A4C',
  successSoft: '#E7F3EE',
  successBorder: '#BCDECB',
  danger: '#B23A34',
  dangerSoft: '#FBEAE8',
  dangerBorder: '#F0C3BF',
  warning: '#8A5A00',
  warningSoft: '#FFF2DC',
  warningBorder: '#FFD79E',
  neutralSoft: '#F0EDEC',
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
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
    },
    android: { elevation: 1 },
    default: {},
  }),
  card: Platform.select({
    ios: {
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
    default: {},
  }),
  hero: Platform.select({
    ios: {
      shadowColor: Colors.brandDark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.22,
      shadowRadius: 18,
    },
    android: { elevation: 5 },
    default: {},
  }),
  button: Platform.select({
    ios: {
      shadowColor: Colors.brand,
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

