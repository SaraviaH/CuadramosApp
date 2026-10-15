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
 * Sección de Ingresos y Gastos del día. La fila de cabecera (conteo de
 * movimientos + "Ver todos") va FUERA de la tarjeta, igual que las demás
 * secciones de Inicio; la tarjeta solo muestra los montos.
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

  const countLabel =
    movementsCount <= 0
      ? 'Aún sin movimientos hoy'
      : movementsCount === 1
        ? '1 movimiento hoy'
        : `${movementsCount} movimientos hoy`;

  return (
    <View style={[styles.container, style]}>
      <SectionHeader
        icon="clock"
        title={countLabel}
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
            <View style={styles.labelRow}>
              <AppText numberOfLines={1} style={styles.label}>Ingresos</AppText>
              <AppText style={styles.hint}>↗ Ver</AppText>
            </View>
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
            <View style={styles.labelRow}>
              <AppText numberOfLines={1} style={styles.label}>Gastos</AppText>
              <AppText style={styles.hint}>↘ Ver</AppText>
            </View>
            <AppText
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.value, { color: Colors.danger }]}
            >
              {formatSignedCurrency(gastos, 'expense')}
            </AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
  },
  hint: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text,
  },
  value: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
  },
});
