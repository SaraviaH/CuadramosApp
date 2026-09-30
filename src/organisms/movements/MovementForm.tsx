import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppButton, AppInput, AppText, Card } from '../../atoms';
import { MovementTypeSelector } from '../../molecules';
import { TipoMovimiento } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';

interface Props {
  onSubmit: (type: TipoMovimiento, amount: number, concept: string) => Promise<void>;
}

const suggestionsByType: Record<TipoMovimiento, string[]> = {
  INGRESO: ['Venta del día', 'Cobro de cliente', 'Aporte de caja'],
  EGRESO: ['Compra de insumos', 'Pago de servicios', 'Gasto de transporte'],
  RETIRO: ['Retiro a cuenta', 'Entrega a dueño', 'Traslado de fondos'],
};

export function MovementForm({ onSubmit }: Props) {
  const [type, setType] = useState<TipoMovimiento>('INGRESO');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [busy, setBusy] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [conceptError, setConceptError] = useState('');

  const submit = async () => {
    let hasError = false;
    const parsed = Number(amount.replace(',', '.'));

    if (!Number.isFinite(parsed) || parsed <= 0) {
      setAmountError('Ingresa un monto mayor a cero.');
      hasError = true;
    } else {
      setAmountError('');
    }

    if (!concept.trim()) {
      setConceptError('Ingresa un concepto o motivo.');
      hasError = true;
    } else {
      setConceptError('');
    }

    if (hasError) return;

    setBusy(true);
    try {
      await onSubmit(type, parsed, concept);
      setAmount('');
      setConcept('');
    } catch {
      // El contexto reporta el mensaje en la notificación superior
    } finally {
      setBusy(false);
    }
  };

  const buttonConfig =
    type === 'INGRESO'
      ? { label: '✓ Registrar ingreso (+)', variant: 'primary' as const }
      : type === 'EGRESO'
      ? { label: '↘ Registrar egreso (-)', variant: 'danger' as const }
      : { label: '⇱ Registrar retiro (-)', variant: 'secondary' as const };

  return (
    <Card style={styles.formCard}>
      {/* Selector de tipo */}
      <View style={styles.fieldGroup}>
        <AppText variant="label" color={Colors.text}>
          TIPO DE MOVIMIENTO
        </AppText>
        <MovementTypeSelector value={type} onChange={setType} />
      </View>

      {/* Input de monto monetario con prefijo S/ */}
      <AppInput
        label="MONTO A REGISTRAR"
        value={amount}
        onChangeText={val => {
          setAmount(val);
          if (amountError) setAmountError('');
        }}
        placeholder="0.00"
        keyboardType="decimal-pad"
        prefix="S/"
        error={amountError}
        hint="Ingresa el importe exacto en Soles"
      />

      {/* Input de concepto */}
      <View style={styles.conceptWrapper}>
        <AppInput
          label="CONCEPTO O DESCRIPCIÓN"
          value={concept}
          onChangeText={val => {
            setConcept(val);
            if (conceptError) setConceptError('');
          }}
          placeholder="Ej. Venta del día, pago de proveedor..."
          autoCapitalize="sentences"
          error={conceptError}
        />

        {/* Chips de conceptos rápidos */}
        <View style={styles.chipsRow}>
          {suggestionsByType[type].map(suggestion => (
            <Pressable
              key={suggestion}
              accessibilityRole="button"
              onPress={() => {
                setConcept(suggestion);
                setConceptError('');
              }}
              style={({ pressed }) => [
                styles.chip,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <AppText variant="captionBold" color={Colors.brand}>
                {`+ ${suggestion}`}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Botón de acción dinámico */}
      <View style={styles.actionContainer}>
        <AppButton
          label={buttonConfig.label}
          variant={buttonConfig.variant}
          onPress={submit}
          loading={busy}
          style={styles.submitButton}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: Spacing.md + 2,
    padding: Spacing.lg,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  conceptWrapper: {
    gap: Spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 2,
  },
  chip: {
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 1,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(213, 0, 93, 0.15)',
  },
  actionContainer: {
    marginTop: Spacing.xs,
  },
  submitButton: {
    minHeight: 52,
  },
});

