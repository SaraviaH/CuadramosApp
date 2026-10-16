import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { AppButton, AppText } from '../../atoms';
import { EmptyState, MovementCard, SectionHeader, SegmentedControl, Select } from '../../molecules';
import type { SelectOption } from '../../molecules';
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
  const [metodoFilter, setMetodoFilter] = useState<string>('TODOS');

  const [dbMovements, setDbMovements] = useState<Movimiento[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [categoriesList, setCategoriesList] = useState<string[]>(['TODAS']);
  const [metodosList, setMetodosList] = useState<string[]>(['TODOS']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Si cambia el prop initialTypeFilter (ej. al navegar desde Inicio con 'INGRESOS' o 'GASTOS')
  useEffect(() => {
    if (initialTypeFilter) {
      const normalized = normalizeTypeFilter(initialTypeFilter);
      setTypeFilter(normalized);
    }
  }, [initialTypeFilter]);

  // Categorías dependientes del tipo activo: al cambiar el tipo se recargan y,
  // si la categoría elegida ya no aplica a ese tipo, se vuelve a «TODAS».
  useEffect(() => {
    let isMounted = true;
    movimientoSqliteRepository.getUniqueCategories(typeFilter)
      .then(cats => {
        if (!isMounted) return;
        setCategoriesList(cats);
        setCategoryFilter(prev => (cats.includes(prev) ? prev : 'TODAS'));
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [typeFilter]);

  // Métodos de pago únicos (no dependen del tipo): se cargan una vez.
  useEffect(() => {
    let isMounted = true;
    movimientoSqliteRepository.getUniqueMetodos()
      .then(metodos => {
        if (isMounted) setMetodosList(metodos);
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
    metodo: string,
  ) => {
    setIsLoading(true);
    try {
      const { startDate, endDate } = getDateRangeForPeriod(period);
      const res = await movimientoSqliteRepository.getPaginatedMovimientos({
        tipo,
        startDate,
        endDate,
        categoria: cat,
        metodoPago: metodo,
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
    loadFirstPage(typeFilter, periodFilter, categoryFilter, metodoFilter);
  }, [typeFilter, periodFilter, categoryFilter, metodoFilter, loadFirstPage]);

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
        metodoPago: metodoFilter,
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
  const typeLabels = ['Todos', 'Ingresos', 'Gastos'];

  const periodOptions: SelectOption[] = [
    { value: 'TODOS', label: 'Todo' },
    { value: 'HOY', label: 'Hoy' },
    { value: 'SEMANA', label: 'Esta semana' },
    { value: 'MES', label: 'Este mes' },
  ];

  // Categorías disponibles según el tipo activo (fuente única: SQLite)
  const categoryOptions: SelectOption[] = useMemo(
    () =>
      categoriesList.map(cat => ({
        value: cat,
        label: cat === 'TODAS' ? 'Todas las categorías' : cat,
      })),
    [categoriesList],
  );

  const hasCategories = categoriesList.length > 1;

  // Métodos de pago disponibles
  const metodoOptions: SelectOption[] = useMemo(
    () =>
      metodosList.map(metodo => ({
        value: metodo,
        label: metodo === 'TODOS' ? 'Todos los métodos' : metodo,
      })),
    [metodosList],
  );

  const hasMetodos = metodosList.length > 1;

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

      {/* 2. Filtros secundarios en carrusel horizontal: Período, Categoría y Método */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        <Select
          label="Filtrar por período"
          value={periodFilter}
          options={periodOptions}
          onChange={value => setPeriodFilter(value as PeriodFilter)}
          isActive={periodFilter !== 'TODOS'}
          style={styles.filterSelect}
        />

        {hasCategories && (
          <Select
            label="Filtrar por categoría"
            value={categoryFilter}
            options={categoryOptions}
            onChange={setCategoryFilter}
            isActive={categoryFilter !== 'TODAS'}
            style={styles.filterSelect}
          />
        )}

        {hasMetodos && (
          <Select
            label="Filtrar por método de pago"
            value={metodoFilter}
            options={metodoOptions}
            onChange={setMetodoFilter}
            isActive={metodoFilter !== 'TODOS'}
            style={styles.filterSelect}
          />
        )}
      </ScrollView>

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
          subtitle="No encontramos registros para los filtros seleccionados. Intenta cambiar el tipo, período, categoría o método."
          actionLabel={onAddPress ? 'Registrar movimiento' : undefined}
          actionIcon="+"
          onActionPress={onAddPress}
          tone="brand"
          variant="dashed"
        />
      ) : (
        <View style={styles.list}>
          {daySections.map(section => (
            <View key={section.dateKey}>
              <SectionHeader
                icon="clock"
                title={section.title}
                badge={String(section.data.length)}
              />
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingRight: Spacing.sm,
  },
  filterSelect: {
    minWidth: 132,
  },
  loadingContainer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
  },
  list: {
    gap: 12,
    paddingBottom: Spacing.md,
  },
  sectionCards: {
    gap: 8,
  },
  moreButton: {
    marginTop: Spacing.xs,
  },
});
