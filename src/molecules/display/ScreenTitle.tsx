import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';

interface Props {
  title: string;
  subtitle?: string;
  alignCenter?: boolean;
  /** Accesorio opcional alineado a la derecha del título (p. ej. un dropdown). */
  right?: React.ReactNode;
}

export function ScreenTitle({ title, subtitle, alignCenter = false, right }: Props) {
  return (
    <View style={[styles.container, alignCenter && styles.center]}>
      <View style={right ? styles.titleRow : undefined}>
        <AppText
          style={[styles.title, alignCenter && styles.centerText, right ? styles.titleGrow : undefined]}
        >
          {title}
        </AppText>
        {right ? <View style={styles.rightSlot}>{right}</View> : null}
      </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  titleGrow: {
    flex: 1,
  },
  rightSlot: {
    marginTop: -Spacing.xs,
    marginBottom: -Spacing.xs,
  },
  center: {
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  title: {
    fontSize: Typography.title.fontSize,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.caption.fontSize,
    lineHeight: 19,
    color: Colors.text,
    marginTop: 5,
    maxWidth: 340,
  },
});
