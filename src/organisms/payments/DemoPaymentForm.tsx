import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppInput, AppText, Card, StatusBadge } from '../../atoms';
import { TipoEventoPago } from '../../types';
import { Colors, Spacing } from '../../theme';

interface Props {
  type: TipoEventoPago;
  onCreate: (amount: number, concept: string) => Promise<void>;
}

export function DemoPaymentForm({ type, onCreate }: Props) {
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const isReceived = type === 'PAGO_RECIBIDO';

  const submit = async () => {
    const parsed = Number(amount.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0 || !concept.trim()) {
      setError('Ingresa un monto válido y un concepto para el pago.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await onCreate(parsed, concept);
      setAmount('');
      setConcept('');
    } catch {
      // El contexto reporta el mensaje en la notificación superior
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card style={styles.formCard}>
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <StatusBadge
            label={isReceived ? 'PAGO ENTRANTE' : 'PAGO SALIENTE'}
            tone={isReceived ? 'success' : 'warning'}
            showDot
          />
        </View>
        <AppText variant="heading" color={Colors.text}>
          {isReceived ? 'Simular cobro digital (QR / Tarjeta)' : 'Simular pago a proveedor'}
        </AppText>
        <AppText variant="caption" color={Colors.textMuted}>
          Crea un evento pendiente; el saldo de caja no variará hasta que lo confirmes.
        </AppText>
      </View>

      <AppInput
        label="Monto del pago"
        value={amount}
        onChangeText={val => {
          setAmount(val);
          if (error) setError('');
        }}
        placeholder="0.00"
        keyboardType="decimal-pad"
        prefix="S/"
        error={error && (!Number(amount) || Number(amount) <= 0) ? error : undefined}
      />

      <AppInput
        label="Concepto"
        value={concept}
        onChangeText={val => {
          setConcept(val);
          if (error) setError('');
        }}
        placeholder={isReceived ? 'Ej. Cobro Yape cliente' : 'Ej. Pago mercadería'}
        error={error && !concept.trim() ? 'El concepto es obligatorio' : undefined}
      />

      <View style={styles.buttonWrapper}>
        <AppButton
          label={isReceived ? '+ Generar cobro pendiente' : '- Generar pago pendiente'}
          variant={isReceived ? 'primary' : 'secondary'}
          onPress={submit}
          loading={busy}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  header: {
    gap: Spacing.xxs,
  },
  badgeRow: {
    marginBottom: 2,
  },
  buttonWrapper: {
    marginTop: Spacing.xs,
  },
});

