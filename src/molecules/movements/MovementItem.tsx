import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AmountDisplay, AppText, Card, StatusBadge } from '../../atoms';
import { Movimiento } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';
import { formatDate, formatTime } from '../../utils';

interface Props {
  movement: Movimiento;
}

export function MovementItem({ movement }: Props) {
  const isIncome = movement.tipo === 'INGRESO';
  const isRetiro = movement.tipo === 'RETIRO';

  const config = isIncome
    ? {
        symbol: '↗',
        color: Colors.success,
        bg: Colors.successSoft,
        tone: 'success' as const,
        prefix: '+',
      }
    : isRetiro
    ? {
        symbol: '⇱',
        color: Colors.warning,
        bg: Colors.warningSoft,
        tone: 'warning' as const,
        prefix: '-',
      }
    : {
        symbol: '↘',
        color: Colors.danger,
        bg: Colors.dangerSoft,
        tone: 'danger' as const,
        prefix: '-',
      };

  const isAutomatic = movement.origen === 'AUTOMATICO';
  const typeLabel = isIncome ? 'Ingreso' : isRetiro ? 'Retiro' : 'Egreso';

  return (
    <Card style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: config.bg }]}>
        <AppText variant="subheading" color={config.color} style={styles.symbol}>
          {config.symbol}
        </AppText>
      </View>

      <View style={styles.centerCol}>
        <AppText variant="subheading" numberOfLines={1} color={Colors.text}>
          {movement.concepto}
        </AppText>
        <View style={styles.metaRow}>
          <AppText variant="caption" color={Colors.textMuted}>
            {formatDate(movement.fechaHoraOrigen)} · {formatTime(movement.fechaHoraOrigen)}
          </AppText>
          {isAutomatic ? (
            <StatusBadge label="Automático" tone="brand" showDot />
          ) : (
            <StatusBadge label={typeLabel} tone={config.tone} />
          )}
        </View>
      </View>

      <View style={styles.amountCol}>
        <AmountDisplay
          amount={movement.monto}
          tone={config.tone}
          size="md"
          prefix={config.prefix}
          style={styles.amountText}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    padding: Spacing.sm + 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  centerCol: {
    flex: 1,
    gap: Spacing.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  amountCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontWeight: '700',
  },
});

