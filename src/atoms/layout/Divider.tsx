import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../theme';

interface Props {
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Divider({ spacing = 'none', style }: Props) {
  const marginVertical = spacing === 'none' ? 0 : Spacing[spacing];
  return <View style={[styles.divider, { marginVertical }, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
});

