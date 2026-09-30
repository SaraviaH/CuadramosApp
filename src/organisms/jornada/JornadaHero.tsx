import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../atoms';
import { Balance, Jornada } from '../../types';
import { Colors, Radius, Shadows, Spacing } from '../../theme';
import { formatCurrency, formatTime } from '../../utils';

interface Props {
  jornada: Jornada;
  balance: Balance;
}

export function JornadaHero({ jornada, balance }: Props) {
  const salidas = balance.egresos + balance.retiros;

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
      <View style={styles.metricsContainer}>
        <View style={styles.metricCapsule}>
          <AppText variant="caption" color="rgba(255,255,255,0.75)">
            Inicial
          </AppText>
          <AppText variant="label" color={Colors.white} numberOfLines={1}>
            {formatCurrency(balance.saldoInicial)}
          </AppText>
        </View>

        <View style={styles.metricCapsule}>
          <AppText variant="caption" color="rgba(255,255,255,0.75)">
            + Ingresos
          </AppText>
          <AppText variant="label" color="#7EE787" numberOfLines={1}>
            {formatCurrency(balance.ingresos)}
          </AppText>
        </View>

        <View style={styles.metricCapsule}>
          <AppText variant="caption" color="rgba(255,255,255,0.75)">
            - Salidas
          </AppText>
          <AppText variant="label" color="#FFA39E" numberOfLines={1}>
            {formatCurrency(salidas)}
          </AppText>
        </View>
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  metricCapsule: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs + 2,
    gap: 2,
  },
});

