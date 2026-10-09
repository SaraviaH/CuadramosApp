import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon, IconName } from '../../atoms';
import { Movimiento } from '../../types';

interface Props {
  movement: Movimiento;
}

export function MovementCard({ movement }: Props) {
  const isIncome = movement.tipo === 'INGRESO';
  const isExpense = movement.tipo === 'EGRESO';

  const toneColor = isIncome ? Colors.green : isExpense ? Colors.red : Colors.orange;
  const toneBg = isIncome ? Colors.greenLight : isExpense ? Colors.redLight : '#FFF6DF';
  const sign = isIncome ? '+ ' : isExpense ? '− ' : '';
  const formattedAmount = `${sign}S/ ${movement.monto.toFixed(2)}`;

  const iconName: IconName = isIncome
    ? (movement.categoria?.includes('Cobro') ? 'wallet' : 'store')
    : isExpense
    ? (movement.categoria?.includes('Transporte') ? 'bus' : 'package')
    : 'wallet';

  const details = [
    movement.categoria || movement.concepto,
    movement.metodoPago,
    movement.horaLegible || '10:00 a. m.',
  ].filter(Boolean).join(' · ');

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: toneBg }]}>
        <Icon name={iconName} color={toneColor} size={20} />
      </View>
      <View style={styles.copyWrap}>
        <AppText numberOfLines={1} style={styles.title}>
          {movement.descripcion || movement.concepto}
        </AppText>
        <AppText numberOfLines={1} style={styles.subtitle}>
          {details}
        </AppText>
      </View>
      <AppText style={[styles.amount, { color: toneColor }]}>
        {formattedAmount}
      </AppText>
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
    borderColor: Colors.line,
    ...Radius.asymmetricCard,
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    ...Radius.asymmetricIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.muted,
  },
  amount: {
    fontSize: 13,
    fontWeight: '800',
  },
});
