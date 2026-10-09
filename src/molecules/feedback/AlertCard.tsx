import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon, IconName } from '../../atoms';

export type AlertTone = 'success' | 'warning' | 'pink';

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
    border: '#BCE5D3',
    color: '#106D4C',
    iconBg: 'rgba(255, 255, 255, 0.85)',
  },
  warning: {
    bg: '#FFF9DF',
    border: '#F1DC88',
    color: '#6F5611',
    iconBg: 'rgba(255, 255, 255, 0.85)',
  },
  pink: {
    bg: Colors.brandSoft,
    border: '#F7D5E4',
    color: Colors.brandDark,
    iconBg: 'rgba(255, 255, 255, 0.85)',
  },
};

export function AlertCard({ tone, icon, title, eyebrow, children }: Props) {
  const current = toneStyles[tone];

  return (
    <View style={[styles.card, { backgroundColor: current.bg, borderColor: current.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: current.iconBg }]}>
        <Icon name={icon} color={current.color} size={18} />
      </View>
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
    ...Radius.asymmetricButton,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyWrap: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 2,
  },
  body: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.muted,
  },
});
