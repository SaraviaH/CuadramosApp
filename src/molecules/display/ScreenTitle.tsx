import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '../../theme';
import { AppText } from '../../atoms';

interface Props {
  title: string;
  subtitle?: string;
  alignCenter?: boolean;
}

export function ScreenTitle({ title, subtitle, alignCenter = false }: Props) {
  return (
    <View style={[styles.container, alignCenter && styles.center]}>
      <AppText style={[styles.title, alignCenter && styles.centerText]}>{title}</AppText>
      {subtitle ? (
        <AppText style={[styles.subtitle, alignCenter && styles.centerText]}>{subtitle}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  center: {
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.muted,
    marginTop: 5,
    maxWidth: 340,
  },
});
