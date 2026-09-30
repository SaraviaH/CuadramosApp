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
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  default: {
    ...Shadows.card,
  },
  flat: {
    borderColor: Colors.border,
  },
  elevated: {
    ...Shadows.hero,
    borderColor: 'transparent',
  },
  accent: {
    backgroundColor: Colors.accentSoft,
    borderColor: 'rgba(255, 184, 0, 0.4)',
  },
  brand: {
    backgroundColor: Colors.brandSoft,
    borderColor: 'rgba(213, 0, 93, 0.25)',
  },
});

