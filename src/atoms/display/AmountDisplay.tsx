import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Colors } from '../../theme';
import { formatCurrency } from '../../utils';
import { AppText } from './AppText';

export type AmountTone = 'default' | 'success' | 'danger' | 'warning' | 'brand' | 'white';
export type AmountSize = 'sm' | 'md' | 'lg' | 'display';

interface Props {
  amount: number;
  tone?: AmountTone;
  size?: AmountSize;
  color?: string;
  prefix?: string;
  style?: StyleProp<TextStyle>;
}

const tones: Record<AmountTone, string> = {
  default: Colors.text,
  success: Colors.success,
  danger: Colors.danger,
  warning: Colors.warning,
  brand: Colors.brand,
  white: Colors.white,
};

const typographyVariant = {
  sm: 'subheading',
  md: 'heading',
  lg: 'title',
  display: 'display',
} as const;

export function AmountDisplay({
  amount,
  tone = 'default',
  size = 'md',
  color,
  prefix,
  style,
}: Props) {
  const formatted = formatCurrency(amount);
  const text = prefix ? `${prefix} ${formatted}` : formatted;

  return (
    <AppText
      variant={typographyVariant[size]}
      color={color ?? tones[tone]}
      style={style}
    >
      {text}
    </AppText>
  );
}

