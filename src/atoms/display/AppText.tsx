import React from 'react';
import { StyleProp, StyleSheet, Text as RNText, TextProps, TextStyle } from 'react-native';
import { TypographyVariant, scaleTextStyle } from '../../theme/typography/textScale';
import { useTextScale } from '../../context/theme/TextScaleContext';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: StyleProp<TextStyle>;
}

function hasFontSize(style: any): boolean {
  if (!style) return false;
  if (Array.isArray(style)) return style.some(hasFontSize);
  return typeof style === 'object' && typeof style.fontSize === 'number';
}

export function AppText({
  children,
  variant,
  color,
  align,
  style,
  ...props
}: AppTextProps) {
  const { scaleFactor, typography } = useTextScale();

  const variantStyle = variant ? typography[variant] : !hasFontSize(style) ? typography.body : undefined;
  const scaledUserStyle = scaleTextStyle(style, scaleFactor);

  return (
    <RNText
      {...props}
      style={[
        styles.base,
        variantStyle,
        color ? { color } : undefined,
        align ? { textAlign: align } : undefined,
        scaledUserStyle,
      ]}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
