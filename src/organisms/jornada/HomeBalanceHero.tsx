import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppText } from '../../atoms';
import { Balance } from '../../types';

interface Props {
  balance: Balance | null;
  openingAmount?: number;
}

export function HomeBalanceHero({ balance, openingAmount = 100 }: Props) {
  const currentBalance = balance?.saldoActual ?? openingAmount;
  const ingresos = balance?.ingresos ?? 0;
  const gastos = balance?.egresos ?? 0;
  const retiros = balance?.retiros ?? 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <AppText style={styles.eyebrow}>SALDO DISPONIBLE EN CAJA</AppText>
          <AppText style={styles.balanceText}>S/ {currentBalance.toFixed(2)}</AppText>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <AppText style={styles.livePillText}>Caja abierta</AppText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, styles.statBoxIncome]}>
          <AppText style={styles.statLabel}>Ingresos</AppText>
          <AppText style={[styles.statValue, { color: Colors.success }]}>
            + S/ {ingresos.toFixed(2)}
          </AppText>
        </View>
        <View style={[styles.statBox, styles.statBoxExpense]}>
          <AppText style={styles.statLabel}>Gastos</AppText>
          <AppText style={[styles.statValue, { color: Colors.danger }]}>
            − S/ {gastos.toFixed(2)}
          </AppText>
        </View>
        <View style={[styles.statBox, styles.statBoxWithdraw]}>
          <AppText style={styles.statLabel}>Retiros</AppText>
          <AppText style={[styles.statValue, { color: Colors.warning }]}>
            S/ {retiros.toFixed(2)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 180,
    backgroundColor: Colors.brand,
    ...Radius.asymmetricHero,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: Colors.brandDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 5,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eyebrow: {
    fontSize: Typography.micro.fontSize,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: Colors.onColor,
  },
  balanceText: {
    fontSize: Typography.display.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
    marginTop: 4,
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
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.md,
  },
  statBox: {
    flex: 1,
    padding: 8,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
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
  statBoxWithdraw: {
    backgroundColor: Colors.warningSoft,
  },
  statLabel: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
    marginBottom: 3,
  },
  statValue: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
  },
});
