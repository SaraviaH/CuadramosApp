import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { HeaderDropdown, ScreenContainer, ScreenTitle, SummaryCard } from '../../molecules';
import { CategoryBreakdownCard } from '../../organisms';
import { useJornada } from '../../hooks';
import { financialSummaryService, FinancialSummaryData } from '../../services';
import { Ruta } from '../../types';
import { formatAmount } from '../../utils';

interface Props {
  navigate: (route: Ruta) => void;
}

export function BalanceScreen({ navigate }: Props) {
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
    <ScreenContainer>
      {/* Encabezado con logotipo moderado */}
      <ScreenTitle
        title="Resumen financiero"
        right={
          <HeaderDropdown
            accessibilityLabel="Más opciones del resumen"
            items={[
              {
                key: 'historial-cajas',
                label: 'Historial de cajas',
                onPress: () => navigate('HISTORIAL_CAJAS'),
              },
            ]}
          />
        }
      />

      {/* Hero del balance mensual con color magenta institucional */}
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

        <AppText
          variant="balance"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={styles.heroAmount}
        >
          {formatAmount(summary?.balanceNetoMes ?? 0)}
        </AppText>

        <AppText variant="caption" style={styles.heroSub}>
          Ingresos confirmados − Gastos confirmados
        </AppText>
      </View>

      {/* Tarjetas de Ingresos y Gastos */}
      <View style={styles.twoColsGrid}>
        <View style={styles.col}>
          <SummaryCard
            label="Ingresos totales"
            value={formatAmount(summary?.totalIngresosMes ?? 0)}
            tone="income"
          />
        </View>
        <View style={styles.col}>
          <SummaryCard
            label="Gastos totales"
            value={formatAmount(summary?.totalGastosMes ?? 0)}
            tone="expense"
          />
        </View>
      </View>

      {/* Aviso informativo cuando no hay actividad en el mes */}
      {summary && !summary.hasMovementsMonth && (
        <View style={styles.emptyNotice}>
          <Icon name="info" color={Colors.text} size={16} />
          <AppText style={styles.emptyNoticeText}>
            No hay movimientos registrados en este período. Los importes se actualizarán al registrar operaciones.
          </AppText>
        </View>
      )}

      {/* Resumen del mes con barras proporcionales y detalle por categoría */}
      {summary && (
        <CategoryBreakdownCard
          periodLabel={summary.periodLabel || defaultPeriod}
          totalIngresos={summary.totalIngresosMes}
          totalGastos={summary.totalGastosMes}
          expenseCategories={summary.expenseCategories || []}
          incomeCategories={summary.incomeCategories || []}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  col: {
    flex: 1,
  },
  summaryHero: {
    minHeight: 124,
    backgroundColor: Colors.brand,
    ...Radius.asymmetricCard,
    padding: Spacing.lg,
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.brandDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
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
    fontSize: Typography.balance.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
    marginVertical: 4,
  },
  heroSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
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
    color: Colors.text,
  },
});
