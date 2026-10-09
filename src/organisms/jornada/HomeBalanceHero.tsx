import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../../theme';
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
          <AppText style={[styles.statValue, { color: '#0D704D' }]}>
            + S/ {ingresos.toFixed(2)}
          </AppText>
        </View>
        <View style={[styles.statBox, styles.statBoxExpense]}>
          <AppText style={styles.statLabel}>Gastos</AppText>
          <AppText style={[styles.statValue, { color: '#AD3535' }]}>
            − S/ {gastos.toFixed(2)}
          </AppText>
        </View>
        <View style={[styles.statBox, styles.statBoxWithdraw]}>
          <AppText style={styles.statLabel}>Retiros</AppText>
          <AppText style={[styles.statValue, { color: '#7C5D00' }]}>
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
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  balanceText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
    marginTop: 4,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#71E2AF',
  },
  livePillText: {
    fontSize: 10,
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
    shadowColor: '#28151E',
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
    backgroundColor: Colors.lemon,
  },
  statLabel: {
    fontSize: 9,
    color: Colors.muted,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '800',
  },
});
