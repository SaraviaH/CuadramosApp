import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { Colors, Typography } from '../../theme';

type Variant = keyof typeof Typography;
interface Props extends PropsWithChildren {
  variant?: Variant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export function AppText({ children, variant = 'body', color = Colors.text, align, style, numberOfLines }: Props) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.base,
        Typography[variant],
        { color },
        align ? { textAlign: align } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

