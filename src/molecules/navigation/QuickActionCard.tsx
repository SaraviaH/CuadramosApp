import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Card } from '../../atoms';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

export type QuickActionTone = 'brand' | 'warning' | 'neutral' | 'accent' | 'success';

interface Props {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  tone?: QuickActionTone;
  badge?: string;
}

const toneMap: Record<QuickActionTone, { bg: string; iconColor: string; border: string }> = {
  brand: {
    bg: Colors.brandSoft,
    iconColor: Colors.brand,
    border: 'rgba(213, 0, 93, 0.25)',
  },
  warning: {
    bg: Colors.warningSoft,
    iconColor: Colors.warning,
    border: 'rgba(183, 121, 31, 0.30)',
  },
  neutral: {
    bg: Colors.neutralSoft,
    iconColor: Colors.textMuted,
    border: Colors.border,
  },
  accent: {
    bg: Colors.accentSoft,
    iconColor: '#9E6A00',
    border: 'rgba(255, 184, 0, 0.40)',
  },
  success: {
    bg: Colors.successSoft,
    iconColor: Colors.success,
    border: 'rgba(24, 134, 75, 0.25)',
  },
};

export function QuickActionCard({
  icon,
  title,
  description,
  onPress,
  tone = 'brand',
  badge,
}: Props) {
  const current = toneMap[tone];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        {
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Card style={[styles.card, { borderColor: current.border }]}>
        <View style={styles.iconRow}>
          <View style={[styles.iconBox, { backgroundColor: current.bg }]}>
            <AppText variant="heading" color={current.iconColor} style={styles.icon}>
              {icon}
            </AppText>
          </View>
          {badge ? (
            <View style={styles.badge}>
              <AppText variant="captionBold" color={Colors.white}>
                {badge}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText variant="subheading" color={Colors.text} numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="caption" color={Colors.textMuted} numberOfLines={2}>
          {description}
        </AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  card: {
    minHeight: 104,
    gap: Spacing.xxs,
    padding: Spacing.sm + 2,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxs,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
  badge: {
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 1,
    borderRadius: Radius.pill,
  },
});

