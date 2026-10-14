import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart, barDataItem, PieChart, pieDataItem } from 'react-native-gifted-charts';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppText, Icon, IconBox } from '../../atoms';
import { SegmentedControl } from '../../molecules';
import {
  CategoryBreakdownItem,
  DailyBarItem,
  HighlightedMetric,
} from '../../services';
import { formatAmount } from '../../utils';

interface Props {
  expenseCategories: CategoryBreakdownItem[];
  incomeCategories: CategoryBreakdownItem[];
  weeklyDays: DailyBarItem[];
  hasWeeklyMovements: boolean;
  weeklyTrendPct: number | null;
  metrics: HighlightedMetric[];
}

type ChartMode = 'Gastos' | 'Ingresos' | 'Evolución';

export function CategoryBreakdownCard({
  expenseCategories,
  incomeCategories,
  weeklyDays,
  hasWeeklyMovements,
  weeklyTrendPct,
  metrics,
}: Props) {
  const [mode, setMode] = useState<ChartMode>('Gastos');

  // Preparar datos para PieChart de gastos
  const pieExpenses: pieDataItem[] = expenseCategories.map(item => ({
    value: item.amount,
    color: item.color,
    text: item.percentage >= 10 ? `${item.percentage}%` : '',
    textColor: Colors.white,
    textSize: 10,
    fontWeight: 'bold',
  }));

  // Preparar datos para PieChart de ingresos
  const pieIncomes: pieDataItem[] = incomeCategories.map(item => ({
    value: item.amount,
    color: item.color,
    text: item.percentage >= 10 ? `${item.percentage}%` : '',
    textColor: Colors.white,
    textSize: 10,
    fontWeight: 'bold',
  }));

  // Preparar datos agrupados de evolución semanal para BarChart
  const barData: barDataItem[] = [];
  let maxBar = 100;

  weeklyDays.forEach((day, idx) => {
    if (day.ingresos > maxBar) maxBar = day.ingresos;
    if (day.gastos > maxBar) maxBar = day.gastos;
    const isLast = idx === weeklyDays.length - 1;

    barData.push({
      value: day.ingresos,
      label: day.dayLabel,
      spacing: 4,
      labelWidth: 32,
      frontColor: Colors.green,
      labelTextStyle: styles.axisLabel,
    });

    barData.push({
      value: day.gastos,
      frontColor: Colors.red,
      spacing: isLast ? 4 : 14,
    });
  });

  return (
    <View style={styles.card}>
      {/* Selector de visualización bajo demanda */}
      <View style={styles.header}>
        <AppText style={styles.title}>Distribución y análisis</AppText>
        <SegmentedControl
          options={['Gastos', 'Ingresos', 'Evolución'] as const}
          selected={mode}
          onSelect={setMode}
          tone="magenta"
        />
      </View>

      {/* Vista 1: Gastos por categoría */}
      {mode === 'Gastos' && (
        <View style={styles.section}>
          {expenseCategories.length > 0 ? (
            <>
              <View style={styles.chartRow}>
                <View style={styles.donutWrap}>
                  <PieChart
                    data={pieExpenses}
                    donut
                    radius={55}
                    innerRadius={34}
                    innerCircleColor={Colors.surface}
                    centerLabelComponent={() => (
                      <AppText style={styles.donutCenterLabel}>Gastos</AppText>
                    )}
                  />
                </View>
                <View style={styles.legendCol}>
                  {expenseCategories.slice(0, 4).map(item => (
                    <View key={item.category} style={styles.legendRow}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <AppText numberOfLines={1} style={styles.legendCategory}>
                        {item.category}
                      </AppText>
                      <AppText style={styles.legendPct}>{item.percentage}%</AppText>
                    </View>
                  ))}
                </View>
              </View>

              {/* Lista detallada con montos formateados */}
              <View style={styles.breakdownList}>
                {expenseCategories.map(item => (
                  <View key={item.category} style={styles.breakdownRow}>
                    <View style={styles.categoryLeft}>
                      <View style={[styles.barDot, { backgroundColor: item.color }]} />
                      <AppText style={styles.categoryName}>{item.category}</AppText>
                    </View>
                    <View style={styles.categoryRight}>
                      <AppText style={styles.categoryAmount}>{formatAmount(item.amount)}</AppText>
                      <AppText style={styles.categoryPctBadge}>{item.percentage}%</AppText>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyBox}>
              <IconBox
                name="tag"
                color={Colors.muted}
                backgroundColor={Colors.neutralSoft}
                size={40}
                iconSize={20}
                shape="card"
              />
              <AppText style={styles.emptyTitle}>Sin gastos en el periodo</AppText>
              <AppText style={styles.emptyDesc}>
                Conforme registres tus compras y gastos, se graficarán aquí por categoría.
              </AppText>
            </View>
          )}
        </View>
      )}

      {/* Vista 2: Ingresos por categoría */}
      {mode === 'Ingresos' && (
        <View style={styles.section}>
          {incomeCategories.length > 0 ? (
            <>
              <View style={styles.chartRow}>
                <View style={styles.donutWrap}>
                  <PieChart
                    data={pieIncomes}
                    donut
                    radius={55}
                    innerRadius={34}
                    innerCircleColor={Colors.surface}
                    centerLabelComponent={() => (
                      <AppText style={styles.donutCenterLabel}>Ventas</AppText>
                    )}
                  />
                </View>
                <View style={styles.legendCol}>
                  {incomeCategories.slice(0, 4).map(item => (
                    <View key={item.category} style={styles.legendRow}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <AppText numberOfLines={1} style={styles.legendCategory}>
                        {item.category}
                      </AppText>
                      <AppText style={styles.legendPct}>{item.percentage}%</AppText>
                    </View>
                  ))}
                </View>
              </View>

              {/* Lista detallada con montos formateados */}
              <View style={styles.breakdownList}>
                {incomeCategories.map(item => (
                  <View key={item.category} style={styles.breakdownRow}>
                    <View style={styles.categoryLeft}>
                      <View style={[styles.barDot, { backgroundColor: item.color }]} />
                      <AppText style={styles.categoryName}>{item.category}</AppText>
                    </View>
                    <View style={styles.categoryRight}>
                      <AppText style={styles.categoryAmount}>{formatAmount(item.amount)}</AppText>
                      <AppText style={styles.categoryPctBadge}>{item.percentage}%</AppText>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyBox}>
              <IconBox
                name="store"
                color={Colors.muted}
                backgroundColor={Colors.neutralSoft}
                size={40}
                iconSize={20}
                shape="card"
              />
              <AppText style={styles.emptyTitle}>Sin ventas en el periodo</AppText>
              <AppText style={styles.emptyDesc}>
                Tus fuentes de ingresos se organizarán aquí automáticamente.
              </AppText>
            </View>
          )}
        </View>
      )}

      {/* Vista 3: Evolución semanal */}
      {mode === 'Evolución' && (
        <View style={styles.section}>
          {hasWeeklyMovements ? (
            <View style={styles.evolutionWrap}>
              <View style={styles.evolutionLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.green }]} />
                  <AppText style={styles.evolutionLegendText}>Ingresos</AppText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.red }]} />
                  <AppText style={styles.evolutionLegendText}>Gastos</AppText>
                </View>
                {weeklyTrendPct !== null && (
                  <View
                    style={[
                      styles.trendBadge,
                      { backgroundColor: weeklyTrendPct >= 0 ? Colors.greenLight : Colors.redLight },
                    ]}
                  >
                    <AppText
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

              <BarChart
                data={barData}
                barWidth={11}
                roundedTop
                roundedBottom
                hideRules={false}
                rulesColor="#EFEFF2"
                rulesType="solid"
                yAxisTextStyle={styles.axisLabel}
                xAxisLabelTextStyle={styles.axisLabel}
                noOfSections={3}
                maxValue={Math.ceil(maxBar * 1.15)}
                isAnimated={false}
                height={120}
              />
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <IconBox
                name="chart"
                color={Colors.muted}
                backgroundColor={Colors.neutralSoft}
                size={40}
                iconSize={20}
                shape="card"
              />
              <AppText style={styles.emptyTitle}>Sin actividad esta semana</AppText>
              <AppText style={styles.emptyDesc}>
                La barra de cada día reflejará tus operaciones conforme registres movimientos.
              </AppText>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
    marginBottom: Spacing.md,
  },
  header: {
    gap: Spacing.xs,
  },
  title: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  section: {
    gap: Spacing.sm,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: Spacing.xs,
  },
  donutWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.muted,
  },
  legendCol: {
    flex: 1,
    paddingLeft: Spacing.md,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendCategory: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
    flex: 1,
  },
  legendPct: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.muted,
  },
  breakdownList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  barDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  categoryName: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryAmount: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  categoryPctBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.muted,
    backgroundColor: Colors.neutralSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  emptyBox: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyDesc: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
    textAlign: 'center',
    maxWidth: 270,
    lineHeight: 16,
  },
  evolutionWrap: {
    gap: Spacing.xs,
  },
  evolutionLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evolutionLegendText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
  },
  trendBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '800',
  },
  axisLabel: {
    fontSize: 9,
    color: Colors.muted,
    fontWeight: '600',
  },
});
