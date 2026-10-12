import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppButton, AppText, Icon } from '../../atoms';
import { MovementCard, SegmentedControl } from '../../molecules';
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
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Icon name="list" color={Colors.brand} size={24} />
          </View>
          <AppText style={styles.emptyTitle}>Sin movimientos registrados</AppText>
          <AppText style={styles.emptySubtitle}>
            No se encontraron registros para este periodo.
          </AppText>
          {onAddPress ? (
            <AppButton
              variant="secondary"
              label="Registrar movimiento"
              icon="+"
              onPress={onAddPress}
              style={{ minHeight: 44 }}
            />
          ) : null}
        </View>
      ) : (
        <>
          <View style={styles.dateRow}>
            <AppText style={styles.dateLabel}>
              {filter === 'Hoy' ? 'Hoy, 28 de enero' : 'Esta semana'}
            </AppText>
            <AppText style={styles.dateCount}>{movements.length} movimientos</AppText>
          </View>

          <View style={styles.list}>
            {movements.map(item => (
              <MovementCard key={item.id} movement={item} />
            ))}
          </View>

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
    gap: 8,
  },
  dailyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  dailyTotalLabel: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.muted,
  },
  dailyTotalValue: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    padding: Spacing.xl,
    gap: Spacing.xs,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    ...Radius.asymmetricHero,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
