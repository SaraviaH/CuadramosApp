import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
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
 * Tarjeta blanca flotante con Ingresos y Gastos del día y un pie con el
 * conteo de movimientos y el enlace "Ver todos".
 * Pensada para solaparse sobre el borde inferior de la franja de Inicio.
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
    <View style={[styles.card, style]}>
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

      <View style={styles.horizontalDivider} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver todos los movimientos"
        onPress={onSeeAll}
        style={({ pressed }) => [styles.footer, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Icon name="clock" color={Colors.muted} size={14} />
        <AppText numberOfLines={1} style={styles.footerText}>
          {countLabel}
        </AppText>
        <View style={styles.footerSpacer} />
        <AppText style={styles.footerLink}>Ver todos</AppText>
        <Icon name="chevron" color={Colors.brand} size={14} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    ...Shadows.card,
    paddingTop: Spacing.sm,
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
  horizontalDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
  },
  footerText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.muted,
  },
  footerSpacer: {
    flex: 1,
  },
  footerLink: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brand,
  },
});
