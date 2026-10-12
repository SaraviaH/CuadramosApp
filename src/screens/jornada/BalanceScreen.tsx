import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { ScreenContainer, ScreenTitle, SummaryCard } from '../../molecules';
import { WeeklyChartCard } from '../../organisms';
import { useJornada } from '../../hooks';
import { financialSummaryService, FinancialSummaryData } from '../../services';
import { formatAmount } from '../../utils';

export function BalanceScreen() {
  const { balance, movimientos } = useJornada();
  const [summary, setSummary] = useState<FinancialSummaryData | null>(null);

  const loadSummaryData = useCallback(async () => {
    const data = await financialSummaryService.getSummary();
    setSummary(data);
  }, []);

  useEffect(() => {
    loadSummaryData();
  }, [loadSummaryData, balance, movimientos]);

  const defaultPeriod = `${new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(new Date())}`;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Encabezado con logotipo moderado */}
      <BrandHeader back={Boolean(goBack)} onBack={goBack} variant="moderate" />
      <ScreenTitle title="Resumen financiero" />

      {/* Hero del balance mensual con datos reales */}
      <View style={styles.summaryHero}>
        <View style={styles.heroTopRow}>
          <AppText variant="caption" style={styles.heroEyebrow}>
            BALANCE NETO DEL MES
          </AppText>
          <View style={styles.periodBadge}>
            <AppText style={styles.periodBadgeText}>
              {summary?.periodLabel || defaultPeriod}
            </AppText>
          </View>
        </View>

        <AppText variant="balance" style={styles.heroAmount}>
          S/ {(summary?.balanceNetoMes ?? 0).toFixed(2)}
        </AppText>

        <AppText variant="caption" style={styles.heroSub}>
          Ingresos confirmados − Gastos confirmados
        </AppText>
      </View>

      {/* Tarjetas de Ingresos y Gastos */}
      <View style={styles.twoColsGrid}>
        <View style={{ flex: 1 }}>
          <SummaryCard
            label="Ingresos totales"
            value={`S/ ${(summary?.totalIngresosMes ?? 0).toFixed(2)}`}
            tone="income"
          />
        </View>
        <View style={{ flex: 1 }}>
          <SummaryCard
            label="Gastos totales"
            value={`S/ ${(summary?.totalGastosMes ?? 0).toFixed(2)}`}
            tone="expense"
          />
        </View>
        {(summary?.totalRetirosMes ?? 0) > 0 && (
          <View style={{ flex: 1 }}>
            <SummaryCard
              label="Retiros"
              value={`S/ ${summary!.totalRetirosMes.toFixed(2)}`}
              tone="warning"
            />
          </View>
        )}
      </View>

      {/* Aviso informativo cuando no hay actividad en el mes */}
      {summary && !summary.hasMovementsMonth && (
        <View style={styles.emptyNotice}>
          <Icon name="info" color={Colors.muted} size={16} />
          <AppText style={styles.emptyNoticeText}>
            No hay movimientos registrados en este período. Los importes se actualizarán al registrar operaciones.
          </AppText>
        </View>
      )}

      {/* Gráfico semanal y métricas dinámicas respaldadas por SQLite */}
      {summary && (
        <WeeklyChartCard
          weeklyDays={summary.weeklyDays}
          hasWeeklyMovements={summary.hasWeeklyMovements}
          weeklyTrendPct={summary.weeklyTrendPct}
          metrics={summary.metrics}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  summaryHero: {
    minHeight: 130,
    backgroundColor: '#2E2E35',
    ...Radius.asymmetricCard,
    padding: Spacing.lg,
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  heroEyebrow: {
    fontSize: 10,
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.onColorMuted,
    letterSpacing: 0.8,
  },
  periodBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  periodBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'capitalize',
  },
  heroAmount: {
    fontSize: 32,
    fontSize: Typography.balance.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
    marginVertical: 4,
  },
  heroSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  heroDate: {
    fontSize: Typography.micro.fontSize,
    color: Colors.onColorFaint,
  },
  twoColsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  emptyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8F8FA',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#ECECEF',
    marginBottom: Spacing.md,
  },
  emptyNoticeText: {
    flex: 1,
    fontSize: 11,
    color: Colors.muted,
  },
});
