import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Surfaces, Typography } from '../../theme';
import { AppText } from '../../atoms';
import { getDiferenciaEstado } from '../../molecules';
import { formatAmount } from '../../utils';

interface Props {
  saldoEsperado: number;
  saldoReal: number;
  diferencia: number;
}

export function ReconciliationPanel({ saldoEsperado, saldoReal, diferencia }: Props) {
  const estado = getDiferenciaEstado(diferencia);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <AppText variant="caption" style={styles.label}>SALDO ESPERADO</AppText>
        <AppText variant="subtitle" style={[styles.val, styles.valExpected]}>
          {formatAmount(saldoEsperado)}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText variant="caption" style={styles.label}>SALDO REAL (EN CAJA)</AppText>
        <AppText variant="subtitle" style={styles.val}>{formatAmount(saldoReal)}</AppText>
      </View>

      <View style={[styles.row, styles.separator]}>
        <AppText variant="caption" style={styles.label}>DIFERENCIA</AppText>
        <View style={styles.diffGroup}>
          <AppText variant="subtitle" style={[styles.val, styles.valDiff, { color: estado.color }]}>
            {formatAmount(diferencia)}
          </AppText>
          <View style={[styles.pill, { backgroundColor: estado.background }]}>
            <AppText variant="caption" style={[styles.pillText, { color: estado.color }]}>
              {estado.label}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Surfaces.card,
    padding: Spacing.md,
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
    borderTopColor: Colors.borderLight,
    borderStyle: 'dashed',
    paddingTop: 10,
    marginTop: 2,
  },
  label: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  val: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  valExpected: {
    color: Colors.brand,
    fontSize: Typography.heading.fontSize,
  },
  diffGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valDiff: {
    fontSize: Typography.body.fontSize,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
  },
});
