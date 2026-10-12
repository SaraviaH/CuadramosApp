import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, IconBox, IconName } from '../../atoms';
import { formatSignedCurrency } from '../../utils';
import { Movimiento } from '../../types';

interface Props {
  movement: Movimiento;
}

export function MovementCard({ movement }: Props) {
  const isIncome = movement.tipo === 'INGRESO';
  const isExpense = movement.tipo === 'EGRESO';

  const toneColor = isIncome ? Colors.green : isExpense ? Colors.red : Colors.orange;
  const toneBg = isIncome ? Colors.greenLight : isExpense ? Colors.redLight : Colors.warningSoft;
  const formattedAmount = formatSignedCurrency(
    movement.monto,
    isIncome ? 'income' : isExpense ? 'expense' : 'neutral',
  );

  const iconName: IconName = isIncome
    ? (movement.categoria?.includes('Cobro') ? 'wallet' : 'store')
    : isExpense
    ? (movement.categoria?.includes('Transporte') ? 'bus' : 'package')
    : 'wallet';

  const details = [
    movement.categoria || movement.concepto,
    movement.metodoPago,
  ].filter(Boolean).join(' · ');

  const hour = [
    movement.horaLegible || '10:00 a. m.',
  ];

  return (
    <View style={styles.card}>
      <IconBox
        name={iconName}
        color={toneColor}
        backgroundColor={toneBg}
        size={42}
        iconSize={20}
        shape="card"
      />
      <View style={styles.details}>
        <AppText numberOfLines={2} style={styles.title}>
          {movement.descripcion || movement.concepto}
        </AppText>
        <AppText numberOfLines={2} style={styles.subtitle}>
          {details}
        </AppText>
      </View>
      <View style={styles.amountAndDate}>
        <AppText style={[styles.amount, { color: toneColor }]}>
          {formattedAmount}
        </AppText>
        <AppText numberOfLines={2} style={styles.date}>
          {hour}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  details: {
    fontSize: Typography.caption.fontSize,
    flex: 1,
    justifyContent: 'center',
  },
  amountAndDate: {
    fontWeight: '800',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
  },
  amount: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '800',
  },
  date: {
    fontSize: Typography.caption.fontSize,
    color: Colors.muted,
  },
});
