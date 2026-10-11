import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';

const BARS = [
  { day: 'L', heightPct: 42, color: Colors.brand },
  { day: 'M', heightPct: 64, color: Colors.brand },
  { day: 'M', heightPct: 50, color: Colors.brand },
  { day: 'J', heightPct: 78, color: Colors.brand },
  { day: 'V', heightPct: 94, color: Colors.green },
  { day: 'S', heightPct: 68, color: Colors.brand },
  { day: 'D', heightPct: 84, color: Colors.brand },
];

export function WeeklyChartCard() {
  return (
    <View style={styles.container}>
      <View style={styles.chartCard}>
        <View style={styles.header}>
          <AppText variant="subtitle" style={styles.headerTitle}>Evolución semanal</AppText>
          <View style={styles.trendBadge}>
            <AppText variant="caption" style={styles.trendText}>+15%</AppText>
          </View>
        </View>

        <View style={styles.chartArea}>
          {BARS.map((bar, idx) => (
            <View key={idx} style={styles.barCol}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${bar.heightPct}%`,
                    backgroundColor: bar.color,
                  },
                ]}
              />
              <AppText variant="caption" style={styles.barDay}>{bar.day}</AppText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.insightsSection}>
        <AppText variant="subtitle" style={styles.insightsHeading}>Métricas destacadas</AppText>

        <View style={styles.insightsList}>
          <View style={styles.miniInsight}>
            <View style={[styles.miniInsightIcon, { backgroundColor: Colors.brandSoft }]}>
              <Icon name="package" color={Colors.brand} size={18} />
            </View>
            <View style={styles.miniInsightCopy}>
              <AppText variant="label" style={styles.miniInsightTitle}>Principal gasto: Mercadería</AppText>
              <AppText variant="caption" style={styles.miniInsightSubtitle}>Representó el 42% de los gastos del mes</AppText>
            </View>
          </View>

          <View style={styles.miniInsight}>
            <View style={[styles.miniInsightIcon, { backgroundColor: Colors.warningSoft }]}>
              <Icon name="sparkle" color={Colors.orange} size={18} />
            </View>
            <View style={styles.miniInsightCopy}>
              <AppText variant="label" style={styles.miniInsightTitle}>Mayor venta: Viernes</AppText>
              <AppText variant="caption" style={styles.miniInsightSubtitle}>Día con más ingresos registrados en la semana</AppText>
            </View>
          </View>
        </View>
      </View>
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
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  trendBadge: {
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  trendText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.green,
  },
  chartArea: {
    height: 130,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  barCol: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  bar: {
    width: 14,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  barDay: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
    fontWeight: '600',
  },
  insightsSection: {
    gap: Spacing.xs,
  },
  insightsHeading: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '800',
    color: Colors.text,
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
    borderColor: Colors.border,
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
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  miniInsightSubtitle: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
  },
});
