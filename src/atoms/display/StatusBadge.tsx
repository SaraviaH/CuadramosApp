import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from './AppText';

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'brand' | 'accent';

interface Props {
  label: string;
  tone?: StatusTone;
  showDot?: boolean;
}

const colorMap: Record<StatusTone, { background: string; text: string; dot: string; border: string }> = {
  success: {
    background: Colors.successSoft,
    text: Colors.success,
    dot: Colors.success,
    border: Colors.successBorder,
  },
  warning: {
    background: Colors.warningSoft,
    text: Colors.warning,
    dot: Colors.warning,
    border: Colors.warningBorder,
  },
  danger: {
    background: Colors.dangerSoft,
    text: Colors.danger,
    dot: Colors.danger,
    border: Colors.dangerBorder,
  },
  neutral: {
    background: Colors.neutralSoft,
    text: Colors.text,
    dot: Colors.text,
    border: Colors.border,
  },
  brand: {
    background: Colors.brandSoft,
    text: Colors.brandDark,
    dot: Colors.brand,
    border: Colors.brandBorder,
  },
  accent: {
    background: Colors.accentSoft,
    text: Colors.accentInk,
    dot: Colors.accent,
    border: Colors.accentBorder,
  },
};

export function StatusBadge({ label, tone = 'neutral', showDot = false }: Props) {
  const current = colorMap[tone];

  return (
    <View style={[styles.badge, { backgroundColor: current.background, borderColor: current.border }]}>
      {showDot ? <View style={[styles.dot, { backgroundColor: current.dot }]} /> : null}
      <AppText variant="captionBold" color={current.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs + 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

