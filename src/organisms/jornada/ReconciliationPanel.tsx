import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from '../../atoms';

interface Props {
  saldoEsperado: number;
  saldoReal: number;
  diferencia: number;
}

export function ReconciliationPanel({ saldoEsperado, saldoReal, diferencia }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <AppText variant="caption" style={styles.label}>SALDO ESPERADO</AppText>
        <AppText variant="subtitle" style={[styles.val, styles.valExpected]}>
          S/ {saldoEsperado.toFixed(2)}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText variant="caption" style={styles.label}>SALDO REAL (EN CAJA)</AppText>
        <AppText variant="subtitle" style={styles.val}>S/ {saldoReal.toFixed(2)}</AppText>
      </View>

      <View style={[styles.row, styles.separator]}>
        <AppText variant="caption" style={styles.label}>DIFERENCIA</AppText>
        <View style={styles.diffGroup}>
          <AppText variant="subtitle" style={[styles.val, styles.valDiff]}>
            S/ {diferencia.toFixed(2)}
          </AppText>
          <View style={styles.pill}>
            <AppText variant="caption" style={styles.pillText}>Cuadrado</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.line,
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 10,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: '#ECE7EB',
    borderStyle: 'dashed',
    paddingTop: 10,
    marginTop: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.muted,
    letterSpacing: 0.5,
  },
  val: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ink,
  },
  valExpected: {
    color: Colors.brand,
    fontSize: 18,
  },
  diffGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valDiff: {
    color: Colors.green,
    fontSize: 15,
  },
  pill: {
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D704D',
  },
});
