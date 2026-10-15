import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';
import { formatSignedCurrency } from '../../utils';
import { Balance } from '../../types';

interface Props {
  balance: Balance | null;
  onPressIncome?: () => void;
  onPressExpense?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tarjeta blanca flotante con Ingresos y Gastos del día.
 * Pensada para solaparse sobre el borde inferior de la franja de Inicio.
 */
export function HomeStatsCard({ balance, onPressIncome, onPressExpense, style }: Props) {
  const ingresos = balance?.ingresos ?? 0;
  const gastos = balance?.egresos ?? 0;

  return (
    <View style={[styles.card, style]}>
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
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    ...Shadows.card,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
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
    color: Colors.muted,
  },
  hint: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.muted,
  },
  value: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
  },
});
