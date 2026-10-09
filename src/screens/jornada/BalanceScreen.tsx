import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText } from '../../atoms';
import { BrandHeader, ScreenTitle, SummaryCard } from '../../molecules';
import { WeeklyChartCard } from '../../organisms';
import { useJornada } from '../../hooks';

interface Props {
  goBack?: () => void;
}

export function BalanceScreen({ goBack }: Props) {
  const { balance } = useJornada();

  const totalIngresos = balance?.ingresos ?? 4500;
  const totalGastos = (balance?.egresos ?? 2800) + (balance?.retiros ?? 0);
  const balanceNeto = totalIngresos - totalGastos;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <BrandHeader back={Boolean(goBack)} onBack={goBack} />
      <ScreenTitle title="Resumen financiero" />

      {/* Hero del balance mensual */}
      <View style={styles.summaryHero}>
        <AppText variant="caption" style={styles.heroEyebrow}>BALANCE NETO DEL MES</AppText>
        <AppText variant="balance" style={styles.heroAmount}>S/ {balanceNeto.toFixed(0)}</AppText>
        <AppText variant="caption" style={styles.heroDate}>Enero 2026</AppText>
      </View>

      {/* Grid de 2 columnas de ingresos y gastos */}
      <View style={styles.twoColsGrid}>
        <View style={{ flex: 1 }}>
          <SummaryCard
            label="Ingresos totales"
            value={`S/ ${totalIngresos.toFixed(0)}`}
            tone="income"
          />
        </View>
        <View style={{ flex: 1 }}>
          <SummaryCard
            label="Gastos totales"
            value={`S/ ${totalGastos.toFixed(0)}`}
            tone="expense"
          />
        </View>
      </View>

      {/* Gráfico semanal y métricas destacadas */}
      <WeeklyChartCard />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  summaryHero: {
    minHeight: 140,
    backgroundColor: '#35353C',
    ...Radius.asymmetricCard,
    padding: Spacing.lg,
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  heroEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.8,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
    marginVertical: 4,
  },
  heroDate: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  twoColsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
});
