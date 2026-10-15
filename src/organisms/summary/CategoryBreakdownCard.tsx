import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { SegmentedControl } from '../../molecules';
import { CategoryBreakdownItem } from '../../services';
import { formatAmount } from '../../utils';

interface Props {
  periodLabel?: string;
  totalIngresos: number;
  totalGastos: number;
  expenseCategories: CategoryBreakdownItem[];
  incomeCategories: CategoryBreakdownItem[];
}

type TabCategory = 'Gastos' | 'Ingresos';

export function CategoryBreakdownCard({
  periodLabel = 'Mes actual',
  totalIngresos,
  totalGastos,
  expenseCategories,
  incomeCategories,
}: Props) {
  const [selectedTab, setSelectedTab] = useState<TabCategory>('Gastos');

  // Cálculos de barras proporcionales
  const maxAmount = Math.max(totalIngresos, totalGastos, 1);
  const incomeWidthPct = totalIngresos > 0
    ? Math.max(Math.round((totalIngresos / maxAmount) * 100), 4)
    : 0;
  const expenseWidthPct = totalGastos > 0
    ? Math.max(Math.round((totalGastos / maxAmount) * 100), 4)
    : 0;

  // Mensaje interpretativo basado estrictamente en datos reales
  let interpretiveMessage = 'Sin movimientos registrados en este período.';
  let interpretiveIcon = 'info';

  if (totalIngresos > 0 && totalGastos > 0) {
    const expenseRatio = Math.round((totalGastos / totalIngresos) * 100);
    if (expenseRatio <= 100) {
      interpretiveMessage = `Tus gastos equivalen al ${expenseRatio} % de tus ingresos. Mantienes un balance operativo positivo.`;
      interpretiveIcon = 'check';
    } else {
      interpretiveMessage = `Tus gastos superan tus ingresos en un ${expenseRatio - 100} %. Conviene revisar y optimizar los egresos del negocio.`;
      interpretiveIcon = 'alert';
    }
  } else if (totalIngresos > 0 && totalGastos === 0) {
    interpretiveMessage = 'Excelente mes: sin gastos registrados hasta el momento (100 % de margen).';
    interpretiveIcon = 'check';
  } else if (totalIngresos === 0 && totalGastos > 0) {
    interpretiveMessage = `Se han registrado gastos por ${formatAmount(totalGastos)} sin ventas confirmadas aún.`;
    interpretiveIcon = 'alert';
  }

  const activeCategories = selectedTab === 'Gastos' ? expenseCategories : incomeCategories;

  return (
    <View style={styles.card}>
      {/* Encabezado: Resumen del mes */}
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <AppText style={styles.title}>Resumen del mes</AppText>
          <AppText style={styles.subtitle}>Comparativa de ingresos y gastos</AppText>
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>{periodLabel}</AppText>
          </View>
          <View style={styles.badgeMuted}>
            <AppText style={styles.badgeMutedText}>Soles (PEN)</AppText>
          </View>
        </View>
      </View>

      {/* Barras horizontales proporcionales */}
      <View style={styles.comparisonWrap}>
        {/* Barra de Ingresos */}
        <View style={styles.barItem}>
          <View style={styles.barLabelRow}>
            <View style={styles.barTitleGroup}>
              <View style={[styles.dot, { backgroundColor: Colors.brand }]} />
              <AppText style={styles.barName}>Ingresos totales</AppText>
            </View>
            <AppText style={styles.barAmount} numberOfLines={1}>
              {formatAmount(totalIngresos)}
            </AppText>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${incomeWidthPct}%`,
                  backgroundColor: Colors.brand,
                },
              ]}
            />
          </View>
        </View>

        {/* Barra de Gastos */}
        <View style={styles.barItem}>
          <View style={styles.barLabelRow}>
            <View style={styles.barTitleGroup}>
              <View style={[styles.dot, { backgroundColor: Colors.brandDark }]} />
              <AppText style={styles.barName}>Gastos totales</AppText>
            </View>
            <AppText style={styles.barAmount} numberOfLines={1}>
              {formatAmount(totalGastos)}
            </AppText>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width: `${expenseWidthPct}%`,
                  backgroundColor: Colors.brandDark,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Mensaje interpretativo real */}
      <View style={styles.interpretiveCard}>
        <View style={styles.interpretiveIconWrap}>
          <Icon name={interpretiveIcon as any} color={Colors.brand} size={16} />
        </View>
        <AppText style={styles.interpretiveText}>
          {interpretiveMessage}
        </AppText>
      </View>

      {/* Desglose detallado por categoría */}
      <View style={styles.categoriesSection}>
        <AppText style={styles.categoriesSectionTitle}>Detalle por categoría</AppText>
        <View style={styles.segmentedControlWrap}>
          <SegmentedControl
            options={['Gastos', 'Ingresos'] as const}
            labels={['Gastos', 'Ingresos']}
            selected={selectedTab}
            onSelect={setSelectedTab}
            tone="magenta"
            size="md"
          />
        </View>

        {activeCategories.length > 0 ? (
          <View style={styles.categoriesList}>
            {activeCategories.map((cat, idx) => (
              <View key={`${cat.category}-${idx}`} style={styles.categoryRow}>
                <View style={styles.categoryMetaRow}>
                  <View style={styles.categoryNameCol}>
                    <AppText style={styles.categoryName} numberOfLines={1}>
                      {cat.category}
                    </AppText>
                    <AppText style={styles.categoryPct}>
                      {cat.percentage}% del total
                    </AppText>
                  </View>
                  <AppText style={styles.categoryAmount} numberOfLines={1}>
                    {formatAmount(cat.amount)}
                  </AppText>
                </View>
                {/* Barra de progreso de la categoría */}
                <View style={styles.categoryTrack}>
                  <View
                    style={[
                      styles.categoryFill,
                      {
                        width: `${Math.max(cat.percentage, 3)}%`,
                        backgroundColor: selectedTab === 'Gastos' ? Colors.brandDark : Colors.brand,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCategories}>
            <AppText style={styles.emptyCategoriesText}>
              No hay {selectedTab.toLowerCase()} registrados en este período.
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  header: {
    gap: Spacing.xs,
  },
  titleWrap: {
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.caption.fontSize,
    color: Colors.text,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  badge: {
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  badgeMuted: {
    backgroundColor: '#EFEBE9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  badgeMutedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  comparisonWrap: {
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  barItem: {
    gap: 4,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  barName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  barAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  track: {
    height: 14,
    backgroundColor: '#E7E1E1',
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  interpretiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.brandSoft,
    borderWidth: 1,
    borderColor: '#F6C6DA',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  interpretiveIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interpretiveText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 17,
  },
  categoriesSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  categoriesSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  segmentedControlWrap: {
    width: '100%',
    marginBottom: Spacing.xs,
  },
  categoriesList: {
    gap: 10,
    marginTop: 4,
  },
  categoryRow: {
    gap: 4,
  },
  categoryMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryNameCol: {
    flex: 1,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  categoryPct: {
    fontSize: 10,
    color: Colors.text,
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
  },
  categoryTrack: {
    height: 6,
    backgroundColor: '#EAE6E6',
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  emptyCategories: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCategoriesText: {
    fontSize: 12,
    color: Colors.text,
    fontStyle: 'italic',
  },
});
