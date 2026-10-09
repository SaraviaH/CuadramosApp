import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { RegistroHistorialCaja } from '../../types';

interface Props {
  box: RegistroHistorialCaja;
  onPress: () => void;
}

export function HistoryCardItem({ box, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.985 : 1 }] }]}
    >
      <View style={styles.header}>
        <AppText style={styles.date}>{box.fecha}</AppText>
        <View style={styles.headerRight}>
          <AppText style={styles.timePill}>{box.horaApertura} – {box.horaCierre}</AppText>
          <Icon name="chevron" color={Colors.muted} size={15} />
        </View>
      </View>

      <View style={styles.rows}>
        <View style={styles.row}>
          <AppText style={styles.rowLabel}>Saldo inicial</AppText>
          <AppText style={styles.rowVal}>S/ {box.saldoInicial.toFixed(2)}</AppText>
        </View>
        <View style={styles.row}>
          <AppText style={styles.rowLabel}>Ingresos</AppText>
          <AppText style={[styles.rowVal, { color: Colors.green }]}>+ S/ {box.ingresos.toFixed(2)}</AppText>
        </View>
        <View style={styles.row}>
          <AppText style={styles.rowLabel}>Gastos</AppText>
          <AppText style={[styles.rowVal, { color: Colors.red }]}>− S/ {box.gastos.toFixed(2)}</AppText>
        </View>
        {box.retiros > 0 ? (
          <View style={styles.row}>
            <AppText style={styles.rowLabel}>Retiros</AppText>
            <AppText style={[styles.rowVal, { color: Colors.orange }]}>S/ {box.retiros.toFixed(2)}</AppText>
          </View>
        ) : null}
        <View style={[styles.row, styles.finalRow]}>
          <AppText style={[styles.rowLabel, { fontWeight: '700' }]}>Saldo final</AppText>
          <AppText style={[styles.rowVal, { color: Colors.brand, fontSize: 14 }]}>
            S/ {box.saldoReal.toFixed(2)}
          </AppText>
        </View>
        <View style={styles.row}>
          <AppText style={styles.rowLabel}>Diferencia</AppText>
          <View style={styles.pill}>
            <AppText style={styles.pillText}>S/ {box.diferencia.toFixed(2)} · Cuadrado</AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.line,
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    borderStyle: 'dashed',
    paddingBottom: 9,
  },
  date: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.ink,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timePill: {
    fontSize: 10,
    color: Colors.muted,
    backgroundColor: '#F4F4F6',
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
    borderTopColor: '#F2EDF0',
    paddingTop: 8,
    marginTop: 2,
  },
  rowLabel: {
    fontSize: 12,
    color: Colors.muted,
  },
  rowVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ink,
  },
  pill: {
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D704D',
  },
});
