import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AmountDisplay, AppText, Card } from '../../atoms';
import { useJornada } from '../../hooks';
import { ScreenLayout } from '../../organisms';
import { BalanceSummary } from '../../molecules';
import { Balance } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';

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
            <AppText variant="body" color={Colors.textMuted}>
              Verificación matemática en tiempo real según reglas contables:
            </AppText>

            <View style={styles.formulaList}>
              {formulaRows(balance).map(row => (
                <View key={row.label} style={styles.formulaRow}>
                  <View style={styles.formulaLabelBox}>
                    {row.sign ? (
                      <AppText variant="bodyMedium" color={Colors.textMuted}>
                        {row.sign}
                      </AppText>
                    ) : null}
                    <AppText variant="body" color={Colors.textMuted}>
                      {row.label}
                    </AppText>
                  </View>
                  <AmountDisplay
                    amount={row.amount}
                    color={row.color}
                    size="sm"
                    style={styles.formulaAmount}
                  />
                </View>
              ))}
            </View>

            <View style={styles.resultBox}>
              <AppText variant="captionBold" color={Colors.brand}>
                = SALDO NETO EN CAJA
              </AppText>
              <AmountDisplay
                amount={balance.saldoActual}
                tone="brand"
                size="md"
                style={styles.resultAmount}
              />
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

function formulaRows(balance: Balance) {
  return [
    { label: 'Saldo Inicial', sign: '', amount: balance.saldoInicial, color: Colors.text },
    { label: 'Ingresos', sign: '+', amount: balance.ingresos, color: Colors.success },
    { label: 'Egresos', sign: '−', amount: balance.egresos, color: Colors.danger },
    { label: 'Retiros', sign: '−', amount: balance.retiros, color: Colors.warning },
  ];
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  auditCard: {
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  formulaList: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  formulaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  formulaLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  formulaAmount: {
    fontWeight: '700',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    backgroundColor: Colors.brandSoft,
    padding: Spacing.sm,
    borderRadius: Radius.xs,
    marginTop: Spacing.xs,
  },
  resultAmount: {
    fontWeight: '800',
  },
});

