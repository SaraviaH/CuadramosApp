import React, { useMemo, useState } from 'react';
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

const parseMovementDate = (m: Movimiento): Date => {
  if (m.fechaHoraOrigen) {
    const parsed = new Date(m.fechaHoraOrigen);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
};

export function MovementList({ movements, onAddPress }: Props) {
  const [filter, setFilter] = useState<'Hoy' | 'Semana' | 'Mes'>('Hoy');

  const filteredMovements = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (filter === 'Hoy') {
      return movements.filter(m => {
        const d = parseMovementDate(m);
        return d >= startOfToday && d <= endOfToday;
      });
    }

    if (filter === 'Semana') {
      const day = now.getDay();
      const diffToMonday = (day + 6) % 7;
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
      return movements.filter(m => {
        const d = parseMovementDate(m);
        return d >= startOfWeek && d <= endOfWeek;
      });
    }

    if (filter === 'Mes') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return movements.filter(m => {
        const d = parseMovementDate(m);
        return d >= startOfMonth && d <= endOfMonth;
      });
    }

    return movements;
  }, [movements, filter]);

  const isEmpty = filteredMovements.length === 0;

  const totalBalance = useMemo(() => {
    return filteredMovements.reduce((acc, m) => {
      if (m.tipo === 'INGRESO') return acc + m.monto;
      if (m.tipo === 'EGRESO') return acc - m.monto;
      if (m.tipo === 'RETIRO') return acc - m.monto;
      return acc;
    }, 0);
  }, [filteredMovements]);

  const dateLabel = useMemo(() => {
    const now = new Date();
    if (filter === 'Hoy') {
      try {
        const formatted = now.toLocaleDateString('es-PE', {
          day: 'numeric',
          month: 'long',
        });
        return `Hoy, ${formatted}`;
      } catch {
        return 'Hoy';
      }
    }
    if (filter === 'Semana') {
      return 'Esta semana';
    }
    try {
      const monthFormatted = now.toLocaleDateString('es-PE', {
        month: 'long',
        year: 'numeric',
      });
      return `Este mes (${monthFormatted.charAt(0).toUpperCase() + monthFormatted.slice(1)})`;
    } catch {
      return 'Este mes';
    }
  }, [filter]);

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
          <View
            style={[
              styles.dailyTotal,
              { backgroundColor: totalBalance >= 0 ? Colors.greenLight : Colors.redLight },
            ]}
          >
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
            <AppText style={styles.dateLabel}>{dateLabel}</AppText>
            <AppText style={styles.dateCount}>
              {filteredMovements.length} {filteredMovements.length === 1 ? 'movimiento' : 'movimientos'}
            </AppText>
          </View>

          <View style={styles.list}>
            {filteredMovements.map(item => (
              <MovementCard
                key={item.id}
                movement={item}
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
    gap: 8,
  },
  dailyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xs,
  },
  dailyTotalLabel: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.text,
  },
  dailyTotalValue: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
  },
});
