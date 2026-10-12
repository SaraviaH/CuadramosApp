import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';
import { EmptyState, MovementCard, SegmentedControl } from '../../molecules';
import { formatSignedCurrency } from '../../utils';
import { Movimiento } from '../../types';

interface Props {
  movements: Movimiento[];
  onAddPress?: () => void;
}

export function MovementList({ movements, onAddPress }: Props) {
  const [filter, setFilter] = useState<'Hoy' | 'Semana' | 'Mes'>('Hoy');
  const isEmpty = filter === 'Mes' || movements.length === 0;

  const totalBalance = movements.reduce((acc, m) => {
    if (m.tipo === 'INGRESO') return acc + m.monto;
    if (m.tipo === 'EGRESO') return acc - m.monto;
    if (m.tipo === 'RETIRO') return acc - m.monto;
    return acc;
  }, 0);

  return (
    <View style={styles.container}>
      <SegmentedControl
        options={['Hoy', 'Semana', 'Mes'] as const}
        selected={filter}
        onSelect={setFilter}
        tone="magenta"
      />

      {isEmpty ? (
        <EmptyState
          icon="list"
          title="Sin movimientos registrados"
          subtitle="No se encontraron registros para este periodo."
          actionLabel={onAddPress ? 'Registrar movimiento' : undefined}
          actionIcon="+"
          onActionPress={onAddPress}
          tone="brand"
          variant="dashed"
        />
      ) : (
        <>
          <View style={styles.dailyTotal}>
            <AppText style={styles.dailyTotalLabel}>Balance del periodo</AppText>
            <AppText
              style={[
                styles.dailyTotalValue,
                { color: totalBalance >= 0 ? Colors.green : Colors.red },
              ]}
            >
              {formatSignedCurrency(totalBalance, totalBalance >= 0 ? 'income' : 'expense')}
            </AppText>
          </View>

          <View style={styles.dateRow}>
            <AppText style={styles.dateLabel}>
              {filter === 'Hoy' ? 'Hoy, 28 de enero' : 'Esta semana'}
            </AppText>
            <AppText style={styles.dateCount}>{movements.length} movimientos</AppText>
          </View>

          <View style={styles.list}>
            {movements.map((item, index) => (
              <MovementCard
                key={item.id}
                movement={item}
                variant="timeline"
                isLast={index === movements.length - 1}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  dateCount: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
  },
  list: {
    gap: 0,
  },
  dailyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  dailyTotalLabel: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.mutedStrong,
  },
  dailyTotalValue: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
  },
});
