import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

export type CardVariant = 'default' | 'flat' | 'elevated' | 'accent' | 'brand';

interface Props extends PropsWithChildren {
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'default', style }: Props) {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  default: {},
  flat: {
    borderColor: Colors.borderLight,
  },
  elevated: {
    ...Shadows.hero,
    borderColor: 'transparent',
  },
  accent: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accentBorder,
  },
  brand: {
    backgroundColor: Colors.brandSoft,
    borderColor: Colors.brandBorder,
  },
});

