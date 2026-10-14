import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppButton, AppText } from '../../atoms';
import { EmptyState, MovementCard, SegmentedControl } from '../../molecules';
import { Movimiento, TipoMovimiento } from '../../types';
import { movimientoSqliteRepository } from '../../storage';

export type PeriodFilter = 'TODOS' | 'HOY' | 'SEMANA' | 'MES';

interface Props {
  initialTypeFilter?: string;
  onAddPress?: () => void;
  /** Lista opcional en memoria para tests o fallback */
  movements?: Movimiento[];
}

const PAGE_SIZE = 5;

export const normalizeTypeFilter = (filter?: string): TipoMovimiento | 'TODOS' => {
  if (!filter) return 'TODOS';
  const upper = filter.trim().toUpperCase();
  if (upper === 'INGRESO' || upper === 'INGRESOS') return 'INGRESO';
  if (upper === 'EGRESO' || upper === 'GASTOS') return 'EGRESO';
  return 'TODOS';
};

export const getDateRangeForPeriod = (
  period: PeriodFilter,
): { startDate?: string; endDate?: string } => {
  if (period === 'TODOS') return {};

  const now = new Date();
  if (period === 'HOY') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }

  if (period === 'SEMANA') {
    const day = now.getDay();
    const diffToMonday = (day + 6) % 7;
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0, 0);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }

  if (period === 'MES') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  }

  return {};
};

export interface MovementDaySection {
  title: string;
  dateKey: string;
  data: Movimiento[];
}

export const formatSectionTitle = (dateString: string): { title: string; dateKey: string } => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) {
    return { title: 'Otras fechas', dateKey: 'unknown' };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const dateKey = `${targetDay.getFullYear()}-${String(targetDay.getMonth() + 1).padStart(2, '0')}-${String(targetDay.getDate()).padStart(2, '0')}`;

  const diffTime = today.getTime() - targetDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { title: 'Hoy', dateKey };
  }
  if (diffDays === 1) {
    return { title: 'Ayer', dateKey };
  }

  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  const day = targetDay.getDate();
  const month = months[targetDay.getMonth()];
  const year = targetDay.getFullYear();

  return { title: `${day} de ${month}, ${year}`, dateKey };
};

export const groupMovimientosByDay = (items: Movimiento[]): MovementDaySection[] => {
  const sectionsMap = new Map<string, MovementDaySection>();

  for (const item of items) {
    const { title, dateKey } = formatSectionTitle(item.fechaHoraOrigen);
    let section = sectionsMap.get(dateKey);
    if (!section) {
      section = { title, dateKey, data: [] };
      sectionsMap.set(dateKey, section);
    }
    section.data.push(item);
  }

  return Array.from(sectionsMap.values());
};

export function MovementList({
  initialTypeFilter = 'TODOS',
  onAddPress,
  movements: initialMovementsProp,
}: Props) {
  const [typeFilter, setTypeFilter] = useState<TipoMovimiento | 'TODOS'>(() =>
    normalizeTypeFilter(initialTypeFilter),
  );
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');

  const [dbMovements, setDbMovements] = useState<Movimiento[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [categoriesList, setCategoriesList] = useState<string[]>(['TODAS']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Si cambia el prop initialTypeFilter (ej. al navegar desde Inicio con 'INGRESOS' o 'GASTOS')
  useEffect(() => {
    if (initialTypeFilter) {
      const normalized = normalizeTypeFilter(initialTypeFilter);
      setTypeFilter(normalized);
    }
  }, [initialTypeFilter]);

  // Carga inicial de categorías únicas directamente desde SQLite
  useEffect(() => {
    let isMounted = true;
    movimientoSqliteRepository.getUniqueCategories()
      .then(cats => {
        if (isMounted) setCategoriesList(cats);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Consulta paginada (LIMIT 5 OFFSET 0) con Single Source of Truth en SQLite
  const loadFirstPage = useCallback(async (
    tipo: TipoMovimiento | 'TODOS',
    period: PeriodFilter,
    cat: string,
  ) => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = getDateRangeForPeriod(period);
      const res = await movimientoSqliteRepository.getPaginatedMovimientos({
        tipo,
        startDate,
        endDate,
        categoria: cat,
        limit: PAGE_SIZE,
        offset: 0,
      });
      setDbMovements(res.items);
      setTotalCount(res.total);
    } catch {
      setDbMovements([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirstPage(typeFilter, periodFilter, categoryFilter);
  }, [typeFilter, periodFilter, categoryFilter, loadFirstPage]);

  // Paginación incremental al pulsar «Ver más»
  const handleShowMore = async () => {
    if (isLoadingMore || dbMovements.length >= totalCount) return;
    setIsLoadingMore(true);
    try {
      const { startDate, endDate } = getDateRangeForPeriod(periodFilter);
      const res = await movimientoSqliteRepository.getPaginatedMovimientos({
        tipo: typeFilter,
        startDate,
        endDate,
        categoria: categoryFilter,
        limit: PAGE_SIZE,
        offset: dbMovements.length,
      });
      setDbMovements(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newUnique = res.items.filter(item => !existingIds.has(item.id));
        return [...prev, ...newUnique];
      });
      setTotalCount(res.total);
    } catch {
      // Ignorar error de paginación
    } finally {
      setIsLoadingMore(false);
    }
  };

  const typeOptions: (TipoMovimiento | 'TODOS')[] = ['TODOS', 'INGRESO', 'EGRESO'];
  const typeLabels = ['Todos', 'Ingresos / Ventas', 'Gastos'];

  const periodOptions: { id: PeriodFilter; label: string }[] = [
    { id: 'TODOS', label: 'Todo' },
    { id: 'HOY', label: 'Hoy' },
    { id: 'SEMANA', label: 'Esta semana' },
    { id: 'MES', label: 'Este mes' },
  ];

  // Si se pasaron movimientos por prop (fallback/tests), usarlos; sino usar SQLite
  const effectiveMovements = initialMovementsProp && initialMovementsProp.length > 0 && dbMovements.length === 0
    ? initialMovementsProp
    : dbMovements;

  // Agrupación por día calendario ("Hoy", "Ayer", "12 de octubre, 2026")
  const daySections = useMemo(() => {
    return groupMovimientosByDay(effectiveMovements);
  }, [effectiveMovements]);

  const hasMore = effectiveMovements.length < totalCount;
  const remainingCount = Math.max(0, totalCount - effectiveMovements.length);

  return (
    <View style={styles.container}>
      {/* 1. Filtro principal por Tipo de movimiento */}
      <SegmentedControl
        options={typeOptions}
        labels={typeLabels}
        selected={typeFilter}
        onSelect={t => setTypeFilter(t)}
        tone="magenta"
      />

      {/* 2. Filtros secundarios: Período y Categorías */}
      <View style={styles.filtersSection}>
        {/* Pills de Período de fecha */}
        <View style={styles.pillsRow}>
          {periodOptions.map(p => {
            const isSelected = periodFilter === p.id;
            return (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={p.label}
                onPress={() => setPeriodFilter(p.id)}
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

        {/* Chips de Categorías (solo si hay al menos una categoría registrada) */}
        {categoriesList.length > 1 && (
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
                  onPress={() => setCategoryFilter(cat)}
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

      {/* 3. Lista agrupada por fecha o estado vacío */}
      {isLoading && effectiveMovements.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.brand} />
          <AppText style={styles.loadingText}>Consultando SQLite...</AppText>
        </View>
      ) : effectiveMovements.length === 0 ? (
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
          {daySections.map(section => (
            <View key={section.dateKey} style={styles.sectionWrap}>
              <View style={styles.sectionHeader}>
                <AppText style={styles.sectionTitle}>{section.title}</AppText>
                <View style={styles.sectionDivider} />
              </View>
              <View style={styles.sectionCards}>
                {section.data.map(item => (
                  <MovementCard key={item.id} movement={item} />
                ))}
              </View>
            </View>
          ))}

          {/* Botón «Ver más»: visible sólo si hay registros pendientes en SQLite */}
          {hasMore && (
            <AppButton
              label={
                isLoadingMore
                  ? 'Cargando más movimientos...'
                  : `Ver más movimientos (quedan ${remainingCount})`
              }
              variant="outline"
              onPress={handleShowMore}
              disabled={isLoadingMore}
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
  loadingContainer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
  },
  list: {
    gap: 12,
    paddingBottom: Spacing.md,
  },
  sectionWrap: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.muted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  sectionCards: {
    gap: 8,
  },
  moreButton: {
    marginTop: Spacing.xs,
  },
});
