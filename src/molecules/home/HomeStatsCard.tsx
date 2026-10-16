import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Surfaces, Typography } from '../../theme';
import { AppText } from '../../atoms';
import { SectionHeader } from '../layout/SectionHeader';
import { formatSignedCurrency } from '../../utils';
import { Balance } from '../../types';

interface Props {
  balance: Balance | null;
  movementsCount?: number;
  onPressIncome?: () => void;
  onPressExpense?: () => void;
  onSeeAll?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Sección de Ingresos y Gastos del día. El título ("Movimientos de hoy") y el
 * conteo (como badge) van FUERA de la tarjeta, igual que las demás secciones de
 * Inicio; la tarjeta muestra los montos y una barra de proporción ingreso/gasto.
 */
export function HomeStatsCard({
  balance,
  movementsCount = 0,
  onPressIncome,
  onPressExpense,
  onSeeAll,
  style,
}: Props) {
  const ingresos = balance?.ingresos ?? 0;
  const gastos = balance?.egresos ?? 0;
  const total = ingresos + gastos;

  return (
    <View style={[styles.container, style]}>
      <SectionHeader
        icon="clock"
        title="Movimientos de hoy"
        badge={movementsCount > 0 ? String(movementsCount) : undefined}
        actionLabel="Ver todos ›"
        actionAccessibilityLabel="Ver todos los movimientos"
        onAction={onSeeAll}
      />

      <View style={styles.card}>
        <View style={styles.statsRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver ingresos en movimientos"
            onPress={onPressIncome}
            style={({ pressed }) => [styles.col, { opacity: pressed ? 0.85 : 1 }]}
          >
            <AppText numberOfLines={1} style={styles.label}>Ingresos</AppText>
            <AppText
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.value, { color: Colors.success }]}
            >
              {formatSignedCurrency(ingresos, 'income')}
            </AppText>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver gastos en movimientos"
            onPress={onPressExpense}
            style={({ pressed }) => [styles.col, { opacity: pressed ? 0.85 : 1 }]}
          >
            <AppText numberOfLines={1} style={styles.label}>Gastos</AppText>
            <AppText
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.value, { color: Colors.danger }]}
            >
              {formatSignedCurrency(gastos, 'expense')}
            </AppText>
          </Pressable>
        </View>

        {total > 0 ? (
          <View style={styles.bar}>
            <View style={[styles.barSeg, { flex: ingresos, backgroundColor: Colors.success }]} />
            <View style={[styles.barSeg, { flex: gastos, backgroundColor: Colors.danger }]} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  card: {
    ...Surfaces.card,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  col: {
    flex: 1,
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  label: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    marginBottom: 4,
  },
  value: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
  },
  bar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    backgroundColor: Colors.borderLight,
  },
  barSeg: {
    height: '100%',
  },
});
