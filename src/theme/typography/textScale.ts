export type TextScaleLevel = 'pequeno' | 'mediano' | 'grande';

export interface TextScaleOption {
  id: TextScaleLevel;
  label: string;
  factor: number;
  description: string;
}

export const TEXT_SCALE_OPTIONS: readonly TextScaleOption[] = [
  { id: 'pequeno', label: 'Pequeño', factor: 1.0, description: 'Tamaño estándar actual' },
  { id: 'mediano', label: 'Mediano', factor: 1.15, description: 'Lectura más cómoda' },
  { id: 'grande', label: 'Grande', factor: 1.3, description: 'Máxima legibilidad y contraste' },
] as const;

export const TEXT_SCALE_FACTORS: Record<TextScaleLevel, number> = {
  pequeno: 1.0,
  mediano: 1.15,
  grande: 1.3,
};

export const BASE_TYPOGRAPHY = {
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
  subtitle: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
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
  balance: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
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
} as const;

export type TypographyVariant = keyof typeof BASE_TYPOGRAPHY;

export function scaleFontSize(baseSize: number, factor: number): number {
  return Math.round(baseSize * factor);
}

export function scaleLineHeight(baseLineHeight: number, factor: number): number {
  return Math.round(baseLineHeight * factor);
}

export function getScaledTypography(factor: number): Record<TypographyVariant, {
  fontSize: number;
  lineHeight: number;
  fontWeight: any;
  letterSpacing?: number;
}> {
  const result: any = {};
  for (const key of Object.keys(BASE_TYPOGRAPHY) as TypographyVariant[]) {
    const item = BASE_TYPOGRAPHY[key];
    result[key] = {
      ...item,
      fontSize: scaleFontSize(item.fontSize, factor),
      lineHeight: scaleLineHeight(item.lineHeight, factor),
    };
  }
  return result;
}

export function scaleTextStyle(style: any, factor: number): any {
  if (!style || factor === 1) return style;

  if (Array.isArray(style)) {
    return style.map(item => scaleTextStyle(item, factor)).filter(Boolean);
  }

  if (typeof style === 'object') {
    let next = style;
    let modified = false;

    if (typeof style.fontSize === 'number') {
      next = { ...next, fontSize: scaleFontSize(style.fontSize, factor) };
      modified = true;
    }
    if (typeof style.lineHeight === 'number') {
      next = { ...next, lineHeight: scaleLineHeight(style.lineHeight, factor) };
      modified = true;
    }

    return modified ? next : style;
  }

  return style;
}
