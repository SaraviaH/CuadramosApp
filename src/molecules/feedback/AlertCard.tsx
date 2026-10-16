import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, IconBox, IconName } from '../../atoms';

export type AlertTone = 'success' | 'warning' | 'pink' | 'error';

interface Props {
  tone: AlertTone;
  icon: IconName;
  title?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

const toneStyles: Record<AlertTone, { bg: string; border: string; color: string; iconBg: string }> = {
  success: {
    bg: Colors.greenLight,
    border: Colors.successBorder,
    color: Colors.success,
    iconBg: Colors.onColor,
  },
  warning: {
    bg: Colors.warningSoft,
    border: Colors.warningBorder,
    color: Colors.accentInk,
    iconBg: Colors.onColor,
  },
  pink: {
    bg: Colors.brandSoft,
    border: Colors.brandBorder,
    color: Colors.brandDark,
    iconBg: Colors.onColor,
  },
  error: {
    bg: Colors.redLight,
    border: '#FECACA',
    color: Colors.red,
    iconBg: 'rgba(255, 255, 255, 0.85)',
  },
};

export function AlertCard({ tone, icon, title, eyebrow, children }: Props) {
  const current = toneStyles[tone];

  return (
    <View style={[styles.card, { backgroundColor: current.bg, borderColor: current.border }]}>
      <IconBox
        name={icon}
        color={current.color}
        backgroundColor={current.iconBg}
        size={32}
        iconSize={18}
        shape="square"
      />
      <View style={styles.copyWrap}>
        {eyebrow ? <AppText style={[styles.eyebrow, { color: current.color }]}>{eyebrow}</AppText> : null}
        {title ? <AppText style={styles.title}>{title}</AppText> : null}
        {children ? (
          typeof children === 'string' || typeof children === 'number' || Array.isArray(children) ? (
            <AppText style={styles.body}>{children}</AppText>
          ) : (
            children
          )
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderRadius: Radius.button,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  copyWrap: {
    flex: 1,
  },
  eyebrow: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  body: {
    fontSize: Typography.micro.fontSize,
    lineHeight: 16,
    color: Colors.text,
  },
});
