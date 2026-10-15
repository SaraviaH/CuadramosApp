import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';

interface Props {
  label: string;
  value: string;
  tone: 'income' | 'expense' | 'warning' | 'balance';
}

const toneStyles = {
  income: { bg: Colors.greenLight, color: Colors.green },
  expense: { bg: Colors.redLight, color: Colors.red },
  warning: { bg: Colors.warningSoft, color: Colors.orange },
  balance: { bg: Colors.brandSoft, color: Colors.brand },
};

export function SummaryCard({ label, value, tone }: Props) {
  const current = toneStyles[tone];
  return (
    <View style={[styles.card, { backgroundColor: current.bg }]}>
      <AppText numberOfLines={1} style={styles.label}>{label}</AppText>
      <AppText numberOfLines={1} adjustsFontSizeToFit style={[styles.value, { color: current.color }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 74,
    ...Radius.asymmetricChip,
    padding: Spacing.sm,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.text,
  },
  value: {
    fontSize: Typography.body.fontSize,
    fontWeight: '800',
    marginTop: 4,
  },
});
