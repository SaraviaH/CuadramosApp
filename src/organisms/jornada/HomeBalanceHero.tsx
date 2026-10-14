import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';
import { formatAmount, formatSignedCurrency } from '../../utils';
import { Balance } from '../../types';

interface Props {
  balance: Balance | null;
  greeting: string;
  dateTitle: string;
  isOpen?: boolean;
  movementsCount?: number;
  onPressIncome?: () => void;
  onPressExpense?: () => void;
}

export function HomeBalanceHero({
  balance,
  greeting,
  dateTitle,
  isOpen = true,
  movementsCount = 0,
  onPressIncome,
  onPressExpense,
}: Props) {
  const currentBalance = balance?.saldoActual ?? 0;
  const ingresos = balance?.ingresos ?? 0;
  const gastos = balance?.egresos ?? 0;

  const countLabel =
    movementsCount === 1 ? '· 1 movimiento registrado hoy' : `· ${movementsCount} movimientos hoy`;

  return (
    <View>
      <View style={styles.topRow}>
        <View style={styles.greetingCol}>
          <AppText numberOfLines={1} style={styles.greeting}>
            {greeting}
          </AppText>
          <AppText numberOfLines={1} style={styles.date}>
            {dateTitle}
          </AppText>
        </View>

        <View style={[styles.livePill, !isOpen && styles.livePillClosed]}>
          {isOpen ? <View style={styles.liveDot} /> : null}
          <AppText style={styles.livePillText}>
            {isOpen ? 'Caja abierta' : 'Caja cerrada'}
          </AppText>
        </View>
      </View>

      <AppText style={styles.eyebrow}>SALDO DISPONIBLE EN CAJA</AppText>
      <AppText
        numberOfLines={1}
        adjustsFontSizeToFit
        style={styles.balanceText}
      >
        {formatAmount(currentBalance)}
      </AppText>

      {isOpen ? (
        <>
          <View style={styles.statsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver ingresos en movimientos"
              onPress={onPressIncome}
              style={({ pressed }) => [
                styles.statBox,
                styles.statBoxIncome,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={styles.statLabelRow}>
                <AppText numberOfLines={1} style={styles.statLabel}>Ingresos</AppText>
                <AppText style={styles.statHintText}>↗ Ver</AppText>
              </View>
              <AppText
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.statValue, { color: Colors.success }]}
              >
                {formatSignedCurrency(ingresos, 'income')}
              </AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver gastos en movimientos"
              onPress={onPressExpense}
              style={({ pressed }) => [
                styles.statBox,
                styles.statBoxExpense,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={styles.statLabelRow}>
                <AppText numberOfLines={1} style={styles.statLabel}>Gastos</AppText>
                <AppText style={styles.statHintText}>↘ Ver</AppText>
              </View>
              <AppText
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.statValue, { color: Colors.danger }]}
              >
                {formatSignedCurrency(gastos, 'expense')}
              </AppText>
            </Pressable>
          </View>

          <AppText style={styles.countText}>{countLabel}</AppText>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  greetingCol: {
    flex: 1,
  },
  greeting: {
    fontSize: Typography.heading.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.onColorStrong,
    marginTop: 2,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.onColorSurfaceFaint,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  livePillClosed: {
    backgroundColor: Colors.onColorSurface,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.successBright,
  },
  livePillText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.white,
  },
  eyebrow: {
    fontSize: Typography.micro.fontSize,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: Colors.onColorStrong,
    marginTop: Spacing.md,
  },
  balanceText: {
    fontSize: Typography.display.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
  },
  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: Radius.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  statBoxIncome: {
    backgroundColor: Colors.greenLight,
  },
  statBoxExpense: {
    backgroundColor: Colors.redLight,
  },
  statLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
  },
  statHintText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.muted,
  },
  statValue: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
  },
  countText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.onColorStrong,
    marginTop: Spacing.sm,
  },
});
