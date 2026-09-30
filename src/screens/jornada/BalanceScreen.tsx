import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '../../atoms';
import { useJornada } from '../../hooks';
import { ScreenLayout } from '../../organisms';
import { BalanceSummary } from '../../molecules';
import { Colors, Spacing } from '../../theme';
import { formatCurrency } from '../../utils';

interface Props {
  goBack: () => void;
}

export function BalanceScreen({ goBack }: Props) {
  const { balance, notification, dismissNotification } = useJornada();

  return (
    <ScreenLayout
      title="Balance de caja"
      subtitle="El saldo disponible se actualiza con cada movimiento confirmado."
      onBack={goBack}
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      {balance ? (
        <View style={styles.container}>
          <BalanceSummary balance={balance} />

          <Card style={styles.auditCard}>
            <AppText variant="heading" color={Colors.text}>
              Fórmula de cuadre de caja
            </AppText>
            <AppText variant="caption" color={Colors.textMuted}>
              Verificación matemática en tiempo real según reglas contables:
            </AppText>

            <View style={styles.formulaRow}>
              <FormulaItem label="Saldo Inicial" amount={balance.saldoInicial} sign="" color={Colors.text} />
              <AppText variant="bodyMedium" color={Colors.textMuted}>+</AppText>
              <FormulaItem label="Ingresos" amount={balance.ingresos} sign="" color={Colors.success} />
              <AppText variant="bodyMedium" color={Colors.textMuted}>-</AppText>
              <FormulaItem label="Egresos" amount={balance.egresos} sign="" color={Colors.danger} />
              <AppText variant="bodyMedium" color={Colors.textMuted}>-</AppText>
              <FormulaItem label="Retiros" amount={balance.retiros} sign="" color={Colors.warning} />
            </View>

            <View style={styles.resultBox}>
              <AppText variant="captionBold" color={Colors.brand}>
                = SALDO NETO EN CAJA: {formatCurrency(balance.saldoActual)}
              </AppText>
            </View>
          </Card>
        </View>
      ) : (
        <Card>
          <AppText color={Colors.textMuted}>No hay una jornada activa.</AppText>
        </Card>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  auditCard: {
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    flexWrap: 'wrap',
    gap: Spacing.xxs,
  },
  resultBox: {
    backgroundColor: Colors.brandSoft,
    padding: Spacing.sm,
    borderRadius: Spacing.xs,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
});

function FormulaItem({
  label,
  amount,
  color,
}: {
  label: string;
  amount: number;
  sign: string;
  color: string;
}) {
  return (
    <View style={formulaStyles.item}>
      <AppText variant="caption" color={Colors.textMuted}>
        {label}
      </AppText>
      <AppText variant="label" color={color}>
        {formatCurrency(amount)}
      </AppText>
    </View>
  );
}

const formulaStyles = StyleSheet.create({
  item: {
    alignItems: 'center',
    gap: 2,
  },
});

