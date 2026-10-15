import { Platform } from 'react-native';

export const Colors = {
  // Paleta institucional oficial CuadramosApp
  brand: '#D50057',        // Magenta institucional principal
  brandDark: '#960048',    // Vino: acentos secundarios y elementos destacados
  brandSoft: '#FCE7EF',    // Fondo magenta suave
  brandBorder: '#F6C6DA',  // Borde magenta suave
  accent: '#FFA400',       // Mango: advertencias y acentos llamativos
  accentSoft: '#FFF2DC',   // Acento suave
  accentBorder: '#FFD79E', // Borde mango suave
  accentInk: '#7A4F00',    // Texto oscuro sobre fondos mango

  // Semántica contable oficial
  green: '#16805D',        // Verde para indicadores positivos e ingresos
  greenLight: '#E7F4EE',   // Fondo suave para ingresos
  red: '#C64242',          // Rojo para gastos y errores
  redLight: '#FBEAEA',     // Fondo suave para gastos
  orange: '#FFA400',       // Mango/Ámbar para retiros y advertencias

  // Neutros de interfaz oficiales
  text: '#0F0F0F',         // Texto principal de alto contraste (19.2:1 sobre blanco)
  placeholder: '#6E6E6E',  // Gris derivado de text: texto guía de inputs (5.1:1)
  muted: '#847770',        // Reservado: los textos secundarios ahora usan `text`
  mutedStrong: '#6E6059',  // Reservado: los textos secundarios ahora usan `text`
  border: '#E7E1E1',       // Bordes y divisores
  borderLight: '#F0ECEC',  // Borde muy sutil
  borderFocus: '#D50057',  // Borde activo magenta
  surface: '#FFFFFF',      // Blanco: fondo de tarjetas, formularios y superficies
  background: '#F7F4F4',   // Fondo general
  shadow: '#2E2A2C',       // Color base de sombras
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(46, 42, 44, 0.45)', // Fondo modal oscurecido

  // Contenido y superficies sobre fondos de color
  onColor: 'rgba(255, 255, 255, 0.88)',              // Contenido principal sobre color
  onColorStrong: 'rgba(255, 255, 255, 0.95)',        // Texto secundario sobre color
  onColorMuted: 'rgba(255, 255, 255, 0.78)',         // Texto secundario sobre color
  onColorFaint: 'rgba(255, 255, 255, 0.65)',         // Texto terciario sobre color
  onColorSurface: 'rgba(255, 255, 255, 0.22)',       // Superficie translúcida sutil
  onColorSurfaceFaint: 'rgba(255, 255, 255, 0.16)',  // Superficie translúcida muy sutil
  successBright: '#6FDC9F',                          // Verde claro para indicadores sobre color

  // Compatibilidad hacia atrás
  success: '#16805D',
  successSoft: '#E7F4EE',
  successBorder: '#BCDECB',
  danger: '#C64242',
  dangerSoft: '#FBEAEA',
  dangerBorder: '#F0C3BF',
  warning: '#FFA400',
  warningSoft: '#FFF2DC',
  warningBorder: '#FFD79E',
  neutralSoft: '#F0ECEB',
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
  // Franja de Inicio: arriba recto (se une al header) y redondeo solo abajo.
  heroBottom: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
  /** Alto estándar de controles (SegmentedControl, Select/filtros). */
  controlHeight: 54,
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

// "Shell" de tarjeta reutilizable: superficie + borde + radio asimétrico + sombra.
export const Surfaces = {
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    ...Shadows.card,
  },
};

import { BASE_TYPOGRAPHY } from '../typography/textScale';

export const Typography = BASE_TYPOGRAPHY;

