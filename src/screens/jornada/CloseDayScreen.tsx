import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppButton, AppText, Icon } from '../../atoms';
import { AlertCard, BrandHeader, ScreenTitle, SummaryCard } from '../../molecules';
import { ReconciliationPanel } from '../../organisms';
import { useJornada } from '../../hooks';

interface Props {
  goBack: () => void;
}

export function CloseDayScreen({ goBack }: Props) {
  const { balance, eventosPendientes, closeDay } = useJornada();
  const [busy, setBusy] = useState(false);
  const [closed, setClosed] = useState(false);

  const saldoEsperado = balance?.saldoActual ?? 0;
  const ingresos = balance?.ingresos ?? 0;
  const gastos = balance?.egresos ?? 0;
  const retiros = balance?.retiros ?? 0;
  const pendingCount = eventosPendientes.length;

  const handleClose = async () => {
    if (pendingCount > 0) return;
    setBusy(true);
    try {
      await closeDay();
      setClosed(true);
    } catch {
      // Handled by context notification
    } finally {
      setBusy(false);
    }
  };

  if (closed) {
    return (
      <View style={styles.successContainer}>
        <BrandHeader />
        <View style={styles.successContent}>
          <View style={styles.successIconWrap}>
            <Icon name="check" color={Colors.white} size={36} />
          </View>
          <AppText variant="title" style={styles.successTitle}>Jornada cerrada</AppText>
          <AppText variant="body" style={styles.successSubtitle}>
            El balance del día fue registrado con éxito y archivado en tu historial.
          </AppText>
          <AppButton
            label="Iniciar nueva jornada"
            onPress={goBack}
            style={{ width: '100%', marginTop: Spacing.md }}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BrandHeader back onBack={goBack} />
      <ScreenTitle title="Cierre de jornada" />

      {pendingCount > 0 && (
        <AlertCard
          tone="warning"
          icon="info"
          eyebrow="PAGOS PENDIENTES"
          title="Tienes operaciones sin confirmar"
        >
          Resuelve los pagos pendientes antes de sellar el turno para garantizar la integridad contable.
        </AlertCard>
      )}

      {/* Arqueo de caja */}
      <ReconciliationPanel
        saldoEsperado={saldoEsperado}
        saldoReal={saldoEsperado}
        diferencia={0}
      />

      {/* Resumen breve del día */}
      <View style={styles.closingStats}>
        <View style={{ flex: 1 }}>
          <SummaryCard
            label="Ingresos"
            tone="income"
            value={`S/ ${ingresos.toFixed(2)}`}
          />
        </View>
        <View style={{ flex: 1 }}>
          <SummaryCard
            label="Gastos"
            tone="expense"
            value={`S/ ${gastos.toFixed(2)}`}
          />
        </View>
        <View style={{ flex: 1 }}>
          <SummaryCard
            label="Retiros"
            tone="warning"
            value={`S/ ${retiros.toFixed(2)}`}
          />
        </View>
      </View>

      <AppButton
        tone="magenta"
        label="Confirmar cierre"
        disabled={pendingCount > 0}
        loading={busy}
        onPress={handleClose}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  closingStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  successContainer: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  successIconWrap: {
    width: 76,
    height: 76,
    borderRadius: Radius.xl,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: Colors.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.muted,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: Spacing.md,
  },
});
