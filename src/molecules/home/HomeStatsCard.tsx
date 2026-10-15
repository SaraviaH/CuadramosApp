import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Surfaces, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver todos los movimientos"
        onPress={onSeeAll}
        style={({ pressed }) => [styles.headerRow, { opacity: pressed ? 0.7 : 1 }]}
      >
        <View style={styles.headerLeft}>
          <Icon name="clock" color={Colors.text} size={14} />
          <AppText numberOfLines={1} style={styles.headerLabel}>
            {countLabel}
          </AppText>
        </View>
        <AppText style={styles.headerLink}>Ver todos ›</AppText>
      </Pressable>

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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  headerLabel: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  headerLink: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brand,
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
