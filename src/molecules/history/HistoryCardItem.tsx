import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Surfaces, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { formatAmount, formatBoxDate } from '../../utils';
import { getDiferenciaEstado } from '../movements/movementVisuals';
import { RegistroHistorialCaja } from '../../types';

interface Props {
  box: RegistroHistorialCaja;
  onPress: () => void;
}

export function HistoryCardItem({ box, onPress }: Props) {
  const diferencia = getDiferenciaEstado(box.diferencia);
  const displayDate = formatBoxDate(box.fechaHoraApertura, box.fecha);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.985 : 1 }] }]}
    >
      <View style={styles.header}>
        <AppText style={styles.date}>{displayDate}</AppText>
        <View style={styles.headerRight}>
          <AppText style={styles.timePill}>{box.horaApertura} – {box.horaCierre}</AppText>
          <Icon name="chevron" color={Colors.text} size={15} />
        </View>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <AppText style={styles.rowLabel}>Saldo inicial</AppText>
          <AppText style={styles.rowVal}>{formatAmount(box.saldoInicial)}</AppText>
        </View>
        <View style={styles.row}>
          <AppText style={styles.rowLabel}>Ingresos</AppText>
          <AppText style={[styles.rowVal, { color: Colors.green }]}>{formatAmount(box.ingresos)}</AppText>
        </View>
        <View style={styles.row}>
          <AppText style={styles.rowLabel}>Gastos</AppText>
          <AppText style={[styles.rowVal, { color: Colors.red }]}>{formatAmount(box.gastos)}</AppText>
        </View>
        <View style={[styles.row, styles.finalRow]}>
          <AppText style={styles.rowLabel}>Saldo esperado</AppText>
          <AppText style={styles.rowVal}>{formatAmount(box.saldoEsperado)}</AppText>
        </View>
        <View style={styles.row}>
          <AppText style={[styles.rowLabel, styles.rowLabelStrong]}>Saldo real</AppText>
          <AppText style={[styles.rowVal, { color: Colors.brand, fontSize: Typography.label.fontSize }]}>
            {formatAmount(box.saldoReal)}
          </AppText>
        </View>
        <View style={styles.row}>
          <AppText style={styles.rowLabel}>Diferencia</AppText>
          <View style={[styles.pill, { backgroundColor: diferencia.background }]}>
            <AppText style={[styles.pillText, { color: diferencia.color }]}>
              {formatAmount(box.diferencia)} · {diferencia.label}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Surfaces.card,
    padding: Spacing.md,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderStyle: 'dashed',
    paddingBottom: 9,
  },
  date: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timePill: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    backgroundColor: Colors.neutralSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    fontWeight: '600',
  },
  rows: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  finalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
    marginTop: 2,
  },
  rowLabel: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
  },
  rowLabelStrong: {
    fontWeight: '700',
  },
  rowVal: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
  },
});
