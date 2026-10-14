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

  const categoryLabel = movement.categoria || movement.concepto || 'General';
  const metaLine = [
    movement.metodoPago || 'Efectivo',
    movement.fechaLegible ? `${movement.fechaLegible} · ${movement.horaLegible || ''}` : movement.horaLegible,
  ].filter(Boolean).join(' · ');

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
        <View style={styles.topDetailsRow}>
          <View style={[styles.categoryBadge, { backgroundColor: toneBg }]}>
            <AppText numberOfLines={1} style={[styles.categoryText, { color: toneColor }]}>
              {categoryLabel}
            </AppText>
          </View>
        </View>
        <AppText numberOfLines={2} style={styles.title}>
          {movement.descripcion || movement.concepto}
        </AppText>
        <AppText numberOfLines={1} style={styles.subtitle}>
          {metaLine}
        </AppText>
      </View>
      <View style={styles.amountWrap}>
        <AppText
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.amount, { color: toneColor }]}
        >
          {formattedAmount}
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
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  topDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
  },
  amountWrap: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    maxWidth: 110,
  },
  amount: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '800',
  },
});
