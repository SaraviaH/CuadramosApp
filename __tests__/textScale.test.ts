import {
  TEXT_SCALE_FACTORS,
  TEXT_SCALE_OPTIONS,
  getScaledTypography,
  scaleFontSize,
  scaleLineHeight,
  scaleTextStyle,
} from '../src/theme/typography/textScale';
import {
  loadSavedTextScale,
  saveTextScale,
} from '../src/storage/repositories/textScaleRepository';

describe('Text Scaling System', () => {
  it('should define exactly 3 scale levels: pequeno, mediano, grande', () => {
    expect(TEXT_SCALE_OPTIONS).toHaveLength(3);
    expect(TEXT_SCALE_OPTIONS.map(o => o.id)).toEqual(['pequeno', 'mediano', 'grande']);
    expect(TEXT_SCALE_FACTORS.pequeno).toBe(1.0);
    expect(TEXT_SCALE_FACTORS.mediano).toBe(1.15);
    expect(TEXT_SCALE_FACTORS.grande).toBe(1.3);
  });

  it('should maintain strict visual hierarchy across all scales', () => {
    ['pequeno', 'mediano', 'grande'].forEach(level => {
      const factor = TEXT_SCALE_FACTORS[level as keyof typeof TEXT_SCALE_FACTORS];
      const scaled = getScaledTypography(factor);

      // Hierarchy: display > title > subtitle/heading > subheading > body > caption
      expect(scaled.display.fontSize).toBeGreaterThan(scaled.title.fontSize);
      expect(scaled.title.fontSize).toBeGreaterThan(scaled.subtitle.fontSize);
      expect(scaled.subtitle.fontSize).toBeGreaterThan(scaled.subheading.fontSize);
      expect(scaled.subheading.fontSize).toBeGreaterThan(scaled.body.fontSize);
      expect(scaled.body.fontSize).toBeGreaterThan(scaled.caption.fontSize);
    });
  });

  it('should scale font sizes and line heights proportionally', () => {
    expect(scaleFontSize(14, 1.0)).toBe(14);
    expect(scaleFontSize(14, 1.15)).toBe(16);
    expect(scaleFontSize(14, 1.3)).toBe(18);

    expect(scaleLineHeight(20, 1.0)).toBe(20);
    expect(scaleLineHeight(20, 1.15)).toBe(23);
    expect(scaleLineHeight(20, 1.3)).toBe(26);
  });

  it('scaleTextStyle should scale explicit font sizes and line heights', () => {
    const inputStyle = { fontSize: 16, lineHeight: 22, color: '#FF007A' };
    const scaled = scaleTextStyle(inputStyle, 1.3);

    expect(scaled).toEqual({
      fontSize: Math.round(16 * 1.3),
      lineHeight: Math.round(22 * 1.3),
      color: '#FF007A',
    });
  });

  it('should persist and load text scale preferences', async () => {
    await saveTextScale('grande');
    const loaded = await loadSavedTextScale();
    expect(loaded).toBe('grande');

    await saveTextScale('pequeno');
    const reset = await loadSavedTextScale();
    expect(reset).toBe('pequeno');
  });

  it('should format amounts consistently with thousands separators and 2 decimals (Tarea 10)', () => {
    const { formatAmount, formatSignedCurrency } = require('../src/utils');

    expect(formatAmount(1000)).toBe('S/ 1,000.00');
    expect(formatAmount(20000)).toBe('S/ 20,000.00');
    expect(formatAmount(40000)).toBe('S/ 40,000.00');
    expect(formatAmount(250000)).toBe('S/ 250,000.00');
    expect(formatAmount(32784)).toBe('S/ 32,784.00');

    expect(formatSignedCurrency(32784, 'income')).toBe('+ S/ 32,784.00');
    expect(formatSignedCurrency(18031.2, 'expense')).toBe('− S/ 18,031.20');
  });
});
