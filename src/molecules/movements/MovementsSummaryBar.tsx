import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing, Surfaces, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { formatAmount } from '../../utils/formatters/format';
import type { TipoMovimiento } from '../../types';

interface Props {
  /** Número de movimientos que cumplen los filtros activos. */
  count: number;
  ingresos: number;
  egresos: number;
  /** Tipo activo en el segmentado; decide qué totales mostrar. */
  tipo: TipoMovimiento | 'TODOS';
}

/**
 * Banda de resumen bajo los filtros de Movimientos. Muestra el conteo y los
 * totales del filtro activo (doble codificación: color + flecha).
 * - TODOS    → ↑ ingresos y ↓ gastos.
 * - INGRESO  → solo ↑ ingresos.
 * - EGRESO   → solo ↓ gastos.
 * Sin resultados (count 0) no renderiza nada.
 */
export function MovementsSummaryBar({ count, ingresos, egresos, tipo }: Props) {
  if (count <= 0) return null;

  const showIngresos = tipo === 'TODOS' || tipo === 'INGRESO';
  const showEgresos = tipo === 'TODOS' || tipo === 'EGRESO';
  const showLabel = tipo !== 'TODOS';

  return (
    <View style={styles.bar} accessibilityRole="summary">
      <AppText numberOfLines={1} style={styles.count}>
        {count} {count === 1 ? 'movimiento' : 'movimientos'}
      </AppText>

      <View style={styles.totals}>
        {showIngresos && (
          <View style={styles.total} accessibilityLabel={`Ingresos: ${formatAmount(ingresos)}`}>
            <Icon name="arrowUp" size={14} color={Colors.green} />
            {showLabel && <AppText style={styles.totalLabel}>Ingresos</AppText>}
            <AppText style={[styles.totalValue, styles.valueIncome]}>
              {formatAmount(ingresos)}
            </AppText>
          </View>
        )}

        {showEgresos && (
          <View style={styles.total} accessibilityLabel={`Gastos: ${formatAmount(egresos)}`}>
            <Icon name="arrowDown" size={14} color={Colors.red} />
            {showLabel && <AppText style={styles.totalLabel}>Gastos</AppText>}
            <AppText style={[styles.totalValue, styles.valueExpense]}>
              {formatAmount(egresos)}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    ...Surfaces.card,
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    columnGap: Spacing.sm,
    rowGap: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  count: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.text,
  },
  totals: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.sm,
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: Spacing.xxs,
  },
  totalLabel: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  valueIncome: {
    color: Colors.green,
  },
  valueExpense: {
    color: Colors.red,
  },
});
