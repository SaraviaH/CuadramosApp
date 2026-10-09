import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import {
  TextScaleLevel,
  TEXT_SCALE_FACTORS,
  getScaledTypography,
  scaleFontSize,
  BASE_TYPOGRAPHY,
} from '../../theme/typography/textScale';
import { loadSavedTextScale, saveTextScale } from '../../storage/repositories/textScaleRepository';

export interface TextScaleContextValue {
  textScale: TextScaleLevel;
  scaleFactor: number;
  typography: Record<keyof typeof BASE_TYPOGRAPHY, {
    fontSize: number;
    lineHeight: number;
    fontWeight: any;
    letterSpacing?: number;
  }>;
  setTextScale: (level: TextScaleLevel) => Promise<void>;
  scaleFontSize: (size: number) => number;
}

const TextScaleContext = createContext<TextScaleContextValue>({
  textScale: 'pequeno',
  scaleFactor: 1.0,
  typography: BASE_TYPOGRAPHY,
  setTextScale: async () => {},
  scaleFontSize: size => size,
});

export function TextScaleProvider({ children }: PropsWithChildren) {
  const [textScale, setTextScaleState] = useState<TextScaleLevel>('pequeno');

  useEffect(() => {
    loadSavedTextScale().then(saved => {
      setTextScaleState(saved);
    });
  }, []);

  const setTextScale = async (level: TextScaleLevel) => {
    setTextScaleState(level);
    await saveTextScale(level);
  };

  const scaleFactor = TEXT_SCALE_FACTORS[textScale];
  const typography = getScaledTypography(scaleFactor);

  const value: TextScaleContextValue = {
    textScale,
    scaleFactor,
    typography,
    setTextScale,
    scaleFontSize: (size: number) => scaleFontSize(size, scaleFactor),
  };

  return <TextScaleContext.Provider value={value}>{children}</TextScaleContext.Provider>;
}

export function useTextScale(): TextScaleContextValue {
  return useContext(TextScaleContext);
}
