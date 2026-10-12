import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppButton, AppText, Icon, IconName } from '../../atoms';

type EmptyStateVariant = 'dashed' | 'card' | 'plain';

interface Props {
  icon: IconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: string;
  onActionPress?: () => void;
  tone?: 'brand' | 'success';
  variant?: EmptyStateVariant;
}

const toneMap = {
  brand: { bg: Colors.brandSoft, icon: Colors.brand },
  success: { bg: Colors.successSoft, icon: Colors.success },
};

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onActionPress,
  tone = 'brand',
  variant = 'dashed',
}: Props) {
  const current = toneMap[tone];

  return (
    <View
      style={[
        styles.container,
        variant === 'dashed' && styles.dashed,
        variant === 'card' && styles.card,
        variant === 'plain' && styles.plain,
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: current.bg }]}>
        <Icon name={icon} color={current.icon} size={24} />
      </View>
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
      {actionLabel && onActionPress ? (
        <AppButton
          variant="secondary"
          label={actionLabel}
          icon={actionIcon}
          onPress={onActionPress}
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.xs,
  },
  dashed: {
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  plain: {
    padding: Spacing.lg,
  },
  iconBox: {
    width: 52,
    height: 52,
    ...Radius.asymmetricHero,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.body.fontSize,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  action: {
    minHeight: 44,
  },
});
