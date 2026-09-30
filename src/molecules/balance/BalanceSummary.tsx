import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AmountDisplay, AppText, Card } from '../../atoms';
import { Balance } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';
import { formatCurrency } from '../../utils';

interface Props {
  balance: Balance;
}

export function BalanceSummary({ balance }: Props) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <View style={styles.indicatorDot} />
          <AppText variant="label" color={Colors.textMuted}>
            SALDO DISPONIBLE EN CAJA
          </AppText>
        </View>
        <AmountDisplay
          amount={balance.saldoActual}
          tone={balance.saldoActual >= 0 ? 'brand' : 'danger'}
          size="display"
          style={styles.heroAmount}
        />
        <AppText variant="caption" color={Colors.textMuted} style={styles.initialText}>
          Iniciado con {formatCurrency(balance.saldoInicial)} en efectivo
        </AppText>
      </View>

      <View style={styles.metricsRow}>
        <MetricChip
          symbol="↗"
          label="Ingresos"
          amount={balance.ingresos}
          color={Colors.success}
          bg={Colors.successSoft}
        />
        <MetricChip
          symbol="↘"
          label="Egresos"
          amount={balance.egresos}
          color={Colors.danger}
          bg={Colors.dangerSoft}
        />
        <MetricChip
          symbol="⇱"
          label="Retiros"
          amount={balance.retiros}
          color={Colors.warning}
          bg={Colors.warningSoft}
        />
      </View>
    </Card>
  );
}

function MetricChip({
  symbol,
  label,
  amount,
  color,
  bg,
}: {
  symbol: string;
  label: string;
  amount: number;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.metricChip, { backgroundColor: bg }]}>
      <View style={styles.metricHeader}>
        <View style={[styles.symbolCircle, { backgroundColor: Colors.surface }]}>
          <AppText variant="captionBold" color={color}>
            {symbol}
          </AppText>
        </View>
        <AppText variant="captionBold" color={color}>
          {label}
        </AppText>
      </View>
      <AmountDisplay
        amount={amount}
        color={color}
        size="sm"
        style={styles.metricAmount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  header: {
    gap: Spacing.xxs,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brand,
  },
  heroAmount: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    marginVertical: Spacing.xxs,
  },
  initialText: {
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metricChip: {
    flex: 1,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs + 2,
  },
  symbolCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricAmount: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
});

