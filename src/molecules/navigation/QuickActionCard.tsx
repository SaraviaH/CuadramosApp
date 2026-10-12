import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, IconName } from '../../atoms';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

export type QuickActionTone = 'brand' | 'warning' | 'neutral' | 'accent' | 'success';

interface Props {
  icon?: string;
  iconName?: IconName;
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
  iconName,
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
            {iconName ? (
              <Icon name={iconName} color={current.iconColor} size={20} />
            ) : (
              <AppText variant="heading" color={current.iconColor} style={styles.icon}>
                {icon}
              </AppText>
            )}
          </View>
          {badge ? (
            <View style={styles.badge}>
              <AppText variant="captionBold" color={Colors.white}>
                {badge}
              </AppText>
            </View>
          ) : null}
        </View>

        <View style={styles.textWrap}>
          <AppText variant="label" color={Colors.text} style={styles.title}>
            {title}
          </AppText>
          <AppText
            variant="caption"
            color={Colors.textMuted}
            numberOfLines={1}
            style={styles.description}
          >
            {description}
          </AppText>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: Radius.md,
  },
  card: {
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1.5,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  icon: {
    fontSize: 18,
    lineHeight: 22,
  },
  badge: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  textWrap: {
    gap: 2,
  },
  title: {
    letterSpacing: 0.1,
  },
  description: {
    letterSpacing: 0.1,
  },
});
