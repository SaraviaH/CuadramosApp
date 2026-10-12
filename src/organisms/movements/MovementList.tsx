import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppButton, AppText, Icon } from '../../atoms';
import { MovementCard } from '../../molecules';
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
      <View style={styles.filterTabs}>
        {(['Hoy', 'Semana', 'Mes'] as const).map(tab => {
          const isActive = filter === tab;
          return (
            <View
              key={tab}
              style={[styles.filterButton, isActive && styles.filterButtonActive]}
            >
              <AppText
                onPress={() => setFilter(tab)}
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {tab}
              </AppText>
            </View>
          );
        })}
      </View>

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
            <AppText style={styles.dateLabel}>{dateLabel}</AppText>
            <AppText style={styles.dateCount}>
              {filteredMovements.length} {filteredMovements.length === 1 ? 'movimiento' : 'movimientos'}
            </AppText>
          </View>

          <View style={styles.list}>
            {filteredMovements.map(item => (
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
              {totalBalance >= 0
                ? `+ S/ ${totalBalance.toFixed(2)}`
                : `− S/ ${Math.abs(totalBalance).toFixed(2)}`}
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
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#EDEDF0',
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
    marginBottom: Spacing.xs,
  },
  filterButton: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  filterButtonActive: {
    backgroundColor: Colors.white,
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
  },
  filterTextActive: {
    color: Colors.brand,
    fontWeight: '800',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.ink,
  },
  dateCount: {
    fontSize: 11,
    color: Colors.muted,
  },
  list: {
    gap: 8,
  },
  dailyTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEEEF1',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  dailyTotalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.muted,
  },
  dailyTotalValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    borderWidth: 1,
    borderColor: '#D4D4D9',
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
    fontSize: 15,
    fontWeight: '700',
    color: Colors.ink,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
});
