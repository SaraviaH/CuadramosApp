import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { DailyBarItem, HighlightedMetric } from '../../services';

interface Props {
  weeklyDays: DailyBarItem[];
  hasWeeklyMovements: boolean;
  weeklyTrendPct: number | null;
  metrics: HighlightedMetric[];
}

export function WeeklyChartCard({
  weeklyDays,
  hasWeeklyMovements,
  weeklyTrendPct,
  metrics,
}: Props) {
  // Construir datos agrupados para react-native-gifted-charts
  const chartData: barDataItem[] = [];
  let maxAmount = 100;

  weeklyDays.forEach((day, idx) => {
    if (day.ingresos > maxAmount) maxAmount = day.ingresos;
    if (day.gastos > maxAmount) maxAmount = day.gastos;

    const isLast = idx === weeklyDays.length - 1;

    // Barra de Ingreso
    chartData.push({
      value: day.ingresos,
      label: day.dayLabel,
      spacing: 4,
      labelWidth: 32,
      frontColor: Colors.green,
      labelTextStyle: styles.axisLabel,
    });

    // Barra de Gasto
    chartData.push({
      value: day.gastos,
      frontColor: Colors.red,
      spacing: isLast ? 4 : 14,
    });
  });

  return (
    <View style={styles.container}>
      {/* Tarjeta de evolución semanal */}
      <View style={styles.chartCard}>
        <View style={styles.header}>
          <AppText variant="subtitle" style={styles.headerTitle}>
            Evolución semanal
          </AppText>
          {weeklyTrendPct !== null && (
            <View
              style={[
                styles.trendBadge,
                {
                  backgroundColor:
                    weeklyTrendPct >= 0 ? Colors.greenLight : Colors.redLight,
                },
              ]}
            >
              <AppText
                variant="caption"
                style={[
                  styles.trendText,
                  { color: weeklyTrendPct >= 0 ? Colors.green : Colors.red },
                ]}
              >
                {weeklyTrendPct >= 0 ? `+${weeklyTrendPct}%` : `${weeklyTrendPct}%`}
              </AppText>
            </View>
          )}
        </View>

        {hasWeeklyMovements ? (
          <View style={styles.chartWrapper}>
            {/* Leyenda explicativa */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.green }]} />
                <AppText style={styles.legendText}>Ingresos</AppText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.red }]} />
                <AppText style={styles.legendText}>Gastos</AppText>
              </View>
            </View>

            {/* Gráfico interactivo Gifted Charts */}
            <View style={styles.chartCanvas}>
              <BarChart
                data={chartData}
                barWidth={11}
                roundedTop
                roundedBottom
                hideRules={false}
                rulesColor="#EFEFF2"
                rulesType="solid"
                yAxisTextStyle={styles.yAxisText}
                xAxisLabelTextStyle={styles.axisLabel}
                noOfSections={3}
                maxValue={Math.ceil(maxAmount * 1.15)}
                isAnimated={false}
                height={120}
              />
            </View>
          </View>
        ) : (
          <View style={styles.emptyChartBox}>
            <View style={styles.emptyIconCircle}>
              <Icon name="chart" color={Colors.muted} size={22} />
            </View>
            <AppText style={styles.emptyChartTitle}>Sin actividad esta semana</AppText>
            <AppText style={styles.emptyChartSubtitle}>
              Los ingresos y gastos de cada día se representarán aquí automáticamente conforme registres tus operaciones.
            </AppText>
          </View>
        )}
      </View>

      {/* Métricas destacadas reales: solo se muestran si hay datos válidos */}
      {metrics && metrics.length > 0 && (
        <View style={styles.insightsSection}>
          <AppText variant="subtitle" style={styles.insightsHeading}>
            Métricas destacadas
          </AppText>

          <View style={styles.insightsList}>
            {metrics.map(metric => (
              <View key={metric.id} style={styles.miniInsight}>
                <View
                  style={[
                    styles.miniInsightIcon,
                    { backgroundColor: metric.iconBg },
                  ]}
                >
                  <Icon name={metric.icon} color={metric.iconColor} size={18} />
                </View>
                <View style={styles.miniInsightCopy}>
                  <AppText variant="label" style={styles.miniInsightTitle}>
                    {metric.title}
                  </AppText>
                  <AppText variant="caption" style={styles.miniInsightSubtitle}>
                    {metric.subtitle}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  chartCard: {
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ink,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chartWrapper: {
    paddingTop: Spacing.xxs,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  chartCanvas: {
    overflow: 'hidden',
    paddingVertical: Spacing.xxs,
  },
  axisLabel: {
    fontSize: 10,
    color: Colors.muted,
    fontWeight: '700',
  },
  yAxisText: {
    fontSize: 9,
    color: Colors.muted,
  },
  emptyChartBox: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyChartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.ink,
  },
  emptyChartSubtitle: {
    fontSize: 11,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
  },
  insightsSection: {
    gap: Spacing.xs,
  },
  insightsHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ink,
    marginBottom: 2,
  },
  insightsList: {
    gap: 8,
  },
  miniInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  miniInsightIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniInsightCopy: {
    flex: 1,
  },
  miniInsightTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 2,
  },
  miniInsightSubtitle: {
    fontSize: 10,
    color: Colors.muted,
  },
});
