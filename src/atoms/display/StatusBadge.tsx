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
    border: 'rgba(24, 134, 75, 0.20)',
  },
  warning: {
    background: Colors.warningSoft,
    text: Colors.warning,
    dot: Colors.warning,
    border: 'rgba(183, 121, 31, 0.25)',
  },
  danger: {
    background: Colors.dangerSoft,
    text: Colors.danger,
    dot: Colors.danger,
    border: 'rgba(199, 58, 58, 0.20)',
  },
  neutral: {
    background: Colors.neutralSoft,
    text: Colors.textMuted,
    dot: Colors.textMuted,
    border: Colors.border,
  },
  brand: {
    background: Colors.brandSoft,
    text: Colors.brandDark,
    dot: Colors.brand,
    border: 'rgba(213, 0, 93, 0.20)',
  },
  accent: {
    background: Colors.accentSoft,
    text: '#8A5D00',
    dot: Colors.accent,
    border: 'rgba(255, 184, 0, 0.35)',
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

