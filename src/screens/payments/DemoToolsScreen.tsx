import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppButton, AppInput, AppText, Icon } from '../../atoms';
import { AlertCard, BrandHeader, ScreenTitle, SegmentedControl } from '../../molecules';
import { PendingEventsPanel } from '../../organisms';
import { useJornada } from '../../hooks';

interface Props {
  goBack: () => void;
}

export function DemoToolsScreen({ goBack }: Props) {
  const {
    createPaymentEvent,
    eventosPendientes,
    confirmPaymentEvent,
    cancelPaymentEvent,
  } = useJornada();

  const [mode, setMode] = useState<'Cobro de cliente' | 'Pago a proveedor'>('Cobro de cliente');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [generated, setGenerated] = useState(false);
  const [busy, setBusy] = useState(false);

  const isCharge = mode === 'Cobro de cliente';

  const handleGenerate = async () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;
    setBusy(true);
    try {
      const tipo = isCharge ? 'PAGO_RECIBIDO' : 'PAGO_REALIZADO';
      await createPaymentEvent(parsed, concept.trim() || (isCharge ? 'Cobro simulado' : 'Pago simulado'), tipo);
      setGenerated(true);
      setAmount('');
      setConcept('');
    } catch {
      // Notified via context
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <BrandHeader back onBack={goBack} />
      <ScreenTitle title="Simulador de pagos" />

      {/* Badge informativo de entorno seguro */}
      <View style={styles.simBadge}>
        <Icon name="info" color="#1765A3" size={16} />
        <AppText variant="caption" style={styles.simBadgeText}>Entorno de prueba · No afecta tu caja real</AppText>
      </View>

      {generated && (
        <AlertCard tone="success" icon="check" title="Operación simulada">
          El registro de prueba fue generado. Resuélvelo en la cola inferior.
        </AlertCard>
      )}

      {/* Formulario del simulador */}
      <View style={styles.paymentCard}>
        <SegmentedControl
          options={['Cobro de cliente', 'Pago a proveedor'] as const}
          selected={mode}
          onSelect={item => {
            setMode(item);
            setGenerated(false);
          }}
          tone={isCharge ? 'green' : 'red'}
        />

        <AppInput
          label="Monto"
          prefix="S/"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <AppInput
          label="Concepto"
          placeholder={isCharge ? 'Ej. Pedido de María' : 'Ej. Factura insumos'}
          value={concept}
          onChangeText={setConcept}
        />

        <AppButton
          tone={isCharge ? 'green' : 'red'}
          loading={busy}
          label="Generar simulación"
          onPress={handleGenerate}
        />
      </View>

      {/* Cola de pagos pendientes */}
      {eventosPendientes.length > 0 && (
        <View style={styles.pendingSection}>
          <AppText variant="subtitle" style={styles.pendingHeading}>
            Pagos pendientes por resolver ({eventosPendientes.length})
          </AppText>
          <PendingEventsPanel
            events={eventosPendientes}
            onConfirm={confirmPaymentEvent}
            onCancel={cancelPaymentEvent}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  simBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.sky,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  simBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1765A3',
  },
  paymentCard: {
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
    gap: Spacing.md,
  },
  pendingSection: {
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  pendingHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.ink,
    marginBottom: 4,
  },
});
