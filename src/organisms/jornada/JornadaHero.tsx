import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../atoms';
import { useCompactLayout } from '../../hooks';
import { Balance, Jornada } from '../../types';
import { Colors, Radius, Shadows, Spacing } from '../../theme';
import { formatCurrency, formatTime } from '../../utils';

interface Props {
  jornada: Jornada;
  balance: Balance;
}

export function JornadaHero({ jornada, balance }: Props) {
  const isCompact = useCompactLayout();
  const salidas = balance.egresos + balance.retiros;

  const metrics = [
    { key: 'inicial', label: 'Inicial', amount: balance.saldoInicial, color: Colors.white },
    { key: 'ingresos', label: '+ Ingresos', amount: balance.ingresos, color: '#7EE787' },
    { key: 'salidas', label: '- Salidas', amount: salidas, color: '#FFA39E' },
  ];

  return (
    <View style={styles.hero}>
      {/* Barra superior del Hero */}
      <View style={styles.topRow}>
        <View style={styles.statusPill}>
          <View style={styles.pulseDot} />
          <AppText variant="captionBold" color={Colors.white} style={styles.statusLabel}>
            JORNADA ABIERTA
          </AppText>
        </View>
        <AppText variant="caption" color={Colors.brandSoft}>
          Inició a las {formatTime(jornada.fechaHoraApertura)}
        </AppText>
      </View>

      {/* Saldo Principal */}
      <View style={styles.balanceSection}>
        <AppText variant="captionBold" color={Colors.accentSoft} style={styles.balanceSubtitle}>
          SALDO DISPONIBLE EN CAJA
        </AppText>
        <AppText variant="display" color={Colors.white} style={styles.amountDisplay}>
          {formatCurrency(balance.saldoActual)}
        </AppText>
      </View>

      {/* Cápsulas de desglose rápido */}
      <View style={[styles.metricsContainer, isCompact && styles.metricsStacked]}>
        {metrics.map(metric => (
          <View
            key={metric.key}
            style={[styles.metricCapsule, isCompact && styles.metricCapsuleRow]}
          >
            <AppText variant="caption" color="rgba(255,255,255,0.75)">
              {metric.label}
            </AppText>
            <AppText variant="label" color={metric.color} numberOfLines={1}>
              {formatCurrency(metric.amount)}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Colors.brandDark,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.hero,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.pill,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3DD68C',
  },
  statusLabel: {
    letterSpacing: 0.5,
  },
  balanceSection: {
    gap: Spacing.xxs,
    paddingVertical: Spacing.xs,
  },
  balanceSubtitle: {
    letterSpacing: 0.8,
  },
  amountDisplay: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -1,
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingTop: Spacing.xs,
    marginHorizontal: -Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  metricsStacked: {
    flexDirection: 'column',
    marginHorizontal: 0,
  },
  metricCapsule: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs + 2,
    gap: 2,
  },
  metricCapsuleRow: {
    flexBasis: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

