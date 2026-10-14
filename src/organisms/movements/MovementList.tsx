import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppButton, AppText, Icon, IconBox } from '../../atoms';
import { EmptyState, MovementCard, SegmentedControl } from '../../molecules';
import { formatAmount, formatSignedCurrency } from '../../utils';
import { Movimiento, TipoMovimiento } from '../../types';

interface Props {
  movements: Movimiento[];
  initialTypeFilter?: TipoMovimiento | 'TODOS';
  onAddPress?: () => void;
}

type PeriodFilter = 'TODOS' | 'HOY' | 'SEMANA' | 'MES';

const parseMovementDate = (m: Movimiento): Date => {
  if (m.fechaHoraOrigen) {
    const parsed = new Date(m.fechaHoraOrigen);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
};

const PAGE_SIZE = 25;

export function MovementList({
  movements,
  initialTypeFilter = 'TODOS',
  onAddPress,
}: Props) {
  const [typeFilter, setTypeFilter] = useState<TipoMovimiento | 'TODOS'>(initialTypeFilter);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Determinar si existen retiros históricos en el conjunto de datos
  const hasHistoricalRetiros = useMemo(
    () => movements.some(m => m.tipo === 'RETIRO'),
    [movements],
  );

  const typeOptions: (TipoMovimiento | 'TODOS')[] = useMemo(() => {
    if (hasHistoricalRetiros) {
      return ['TODOS', 'INGRESO', 'EGRESO', 'RETIRO'];
    }
    return ['TODOS', 'INGRESO', 'EGRESO'];
  }, [hasHistoricalRetiros]);

  const typeLabels = useMemo(() => {
    if (hasHistoricalRetiros) {
      return ['Todos', 'Ingresos', 'Gastos', 'Retiros'];
    }
    return ['Todos', 'Ingresos / Ventas', 'Gastos'];
  }, [hasHistoricalRetiros]);

  // Lista de categorías únicas presentes en los datos
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    for (const m of movements) {
      const cat = m.categoria || m.concepto;
      if (cat) set.add(cat);
    }
    return ['TODAS', ...Array.from(set)];
  }, [movements]);

  // Filtrado compuesto: Tipo + Período + Categoría
  const filteredMovements = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const day = now.getDay();
    const diffToMonday = (day + 6) % 7;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return movements.filter(m => {
      // 1. Filtro de tipo
      if (typeFilter !== 'TODOS' && m.tipo !== typeFilter) {
        return false;
      }

      // 2. Filtro de categoría
      if (categoryFilter !== 'TODAS') {
        const cat = m.categoria || m.concepto;
        if (cat !== categoryFilter) return false;
      }

      // 3. Filtro de fecha
      if (periodFilter === 'TODOS') return true;

      const d = parseMovementDate(m);
      if (periodFilter === 'HOY') {
        return d >= startOfToday && d <= endOfToday;
      }
      if (periodFilter === 'SEMANA') {
        return d >= startOfWeek && d <= endOfWeek;
      }
      if (periodFilter === 'MES') {
        return d >= startOfMonth && d <= endOfMonth;
      }

      return true;
    });
  }, [movements, typeFilter, periodFilter, categoryFilter]);

  // Totales del subconjunto filtrado
  const { totalBalance, totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    let withdraw = 0;

    for (const m of filteredMovements) {
      if (m.tipo === 'INGRESO') income += m.monto;
      else if (m.tipo === 'EGRESO') expense += m.monto;
      else if (m.tipo === 'RETIRO') withdraw += m.monto;
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense - withdraw,
    };
  }, [filteredMovements]);

  const displayedMovements = filteredMovements.slice(0, visibleCount);
  const hasMore = filteredMovements.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  const periodOptions: { id: PeriodFilter; label: string }[] = [
    { id: 'TODOS', label: 'Todo' },
    { id: 'HOY', label: 'Hoy' },
    { id: 'SEMANA', label: 'Esta semana' },
    { id: 'MES', label: 'Este mes' },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Filtro principal por Tipo de movimiento */}
      <SegmentedControl
        options={typeOptions}
        labels={typeLabels}
        selected={typeFilter}
        onSelect={t => {
          setTypeFilter(t);
          setVisibleCount(PAGE_SIZE);
        }}
        tone="magenta"
      />

      {/* 2. Filtros secundarios de Fecha y Categoría */}
      <View style={styles.filtersSection}>
        {/* Pills de Período */}
        <View style={styles.pillsRow}>
          {periodOptions.map(p => {
            const isSelected = periodFilter === p.id;
            return (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={p.label}
                onPress={() => {
                  setPeriodFilter(p.id);
                  setVisibleCount(PAGE_SIZE);
                }}
                style={[styles.periodPill, isSelected && styles.periodPillActive]}
              >
                <AppText
                  style={[
                    styles.periodPillText,
                    isSelected && styles.periodPillTextActive,
                  ]}
                >
                  {p.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {/* Chips de Categorías (solo si hay más de 1 categoría) */}
        {categoriesList.length > 2 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categoriesList.map(cat => {
              const isSelected = categoryFilter === cat;
              return (
                <Pressable
                  key={cat}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    setCategoryFilter(cat);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                >
                  <AppText
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* 3. Panel de balance del filtro actual */}
      {filteredMovements.length > 0 && (
        <View style={styles.summaryBox}>
          <View style={styles.summaryLeft}>
            <AppText style={styles.summaryLabel}>Balance filtrado</AppText>
            <AppText
              style={[
                styles.summaryBalance,
                { color: totalBalance >= 0 ? Colors.green : Colors.red },
              ]}
            >
              {formatSignedCurrency(totalBalance, totalBalance >= 0 ? 'income' : 'expense')}
            </AppText>
          </View>
          <View style={styles.summaryRight}>
            <AppText style={styles.summaryCount}>
              {filteredMovements.length}{' '}
              {filteredMovements.length === 1 ? 'registro' : 'registros'}
            </AppText>
            <AppText style={styles.summarySub}>
              +{formatAmount(totalIncome)} · −{formatAmount(totalExpense)}
            </AppText>
          </View>
        </View>
      )}

      {/* 4. Lista unificada de movimientos */}
      {filteredMovements.length === 0 ? (
        <EmptyState
          icon="list"
          title="Sin movimientos coincidentes"
          subtitle="No encontramos registros para los filtros seleccionados. Intenta cambiar el tipo, fecha o categoría."
          actionLabel={onAddPress ? 'Registrar movimiento' : undefined}
          actionIcon="+"
          onActionPress={onAddPress}
          tone="brand"
          variant="dashed"
        />
      ) : (
        <View style={styles.list}>
          {displayedMovements.map(item => (
            <MovementCard key={item.id} movement={item} />
          ))}

          {/* Botón "Ver más" para carga progresiva */}
          {hasMore && (
            <AppButton
              label={`Ver más movimientos (quedan ${filteredMovements.length - visibleCount})`}
              variant="outline"
              onPress={handleShowMore}
              style={styles.moreButton}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  filtersSection: {
    gap: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  periodPill: {
    flex: 1,
    minHeight: 34,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  periodPillActive: {
    backgroundColor: Colors.brandSoft,
    borderColor: Colors.brandBorder,
  },
  periodPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.muted,
  },
  periodPillTextActive: {
    color: Colors.brand,
    fontWeight: '800',
  },
  categoryScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.brandSoft,
    borderColor: Colors.brand,
  },
  categoryChipText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: Colors.brandDark,
    fontWeight: '800',
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    padding: Spacing.sm,
  },
  summaryLeft: {
    gap: 2,
  },
  summaryLabel: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
    fontWeight: '600',
  },
  summaryBalance: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '800',
  },
  summaryRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  summaryCount: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  summarySub: {
    fontSize: 10,
    color: Colors.muted,
  },
  list: {
    gap: 8,
    paddingBottom: Spacing.md,
  },
  moreButton: {
    marginTop: Spacing.xs,
  },
});
