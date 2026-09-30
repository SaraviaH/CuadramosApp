import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppButton, AppInput, AppText, Card } from '../../atoms';
import { useJornada } from '../../hooks';
import { ScreenLayout } from '../../organisms';
import { Colors, Radius, Spacing } from '../../theme';

const quickInitialAmounts = [0, 50, 100, 200];

export function OpenDayScreen() {
  const { openDay, notification, dismissNotification } = useJornada();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    const value = amount.trim() === '' ? 0 : Number(amount.replace(',', '.'));
    if (!Number.isFinite(value) || value < 0) {
      setError('Ingresa un saldo inicial válido (cero o mayor).');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await openDay(value);
    } catch {
      // El contexto reporta el mensaje en la notificación superior
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenLayout
      title="Apertura de jornada"
      subtitle="Inicia el control de tu turno con el efectivo disponible en caja."
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <AppText variant="heading" color={Colors.brand}>
              💵
            </AppText>
          </View>
          <View style={styles.headerCopy}>
            <AppText variant="heading" color={Colors.text}>
              Efectivo inicial en caja
            </AppText>
            <AppText variant="caption" color={Colors.textMuted}>
              Este monto será la base para calcular tu saldo disponible y el arqueo final.
            </AppText>
          </View>
        </View>

        {/* Input de monto */}
        <AppInput
          label="MONTO BASE INICIAL"
          value={amount}
          onChangeText={val => {
            setAmount(val);
            if (error) setError('');
          }}
          placeholder="0.00"
          keyboardType="decimal-pad"
          prefix="S/"
          error={error}
          hint="Si comienzas sin sencillo, puedes ingresar 0.00"
        />

        {/* Chips de monto sugerido */}
        <View style={styles.presetsRow}>
          <AppText variant="captionBold" color={Colors.textMuted} style={styles.presetsLabel}>
            Montos comunes:
          </AppText>
          <View style={styles.chipsContainer}>
            {quickInitialAmounts.map(val => (
              <Pressable
                key={val}
                accessibilityRole="button"
                onPress={() => {
                  setAmount(val.toString());
                  if (error) setError('');
                }}
                style={({ pressed }) => [
                  styles.presetChip,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <AppText variant="captionBold" color={Colors.brand}>
                  {`S/ ${val}`}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.submitWrapper}>
          <AppButton
            label="✓ Abrir jornada de caja"
            variant="primary"
            onPress={submit}
            loading={busy}
            style={styles.submitButton}
          />
        </View>
      </Card>

      {/* Tarjeta informativa de mejores prácticas */}
      <Card variant="accent" style={styles.tipCard}>
        <AppText variant="captionBold" color="#8A5D00">
          💡 CONSEJO DE ARQUEO
        </AppText>
        <AppText variant="caption" color="#614100">
          Cuenta las monedas y billetes antes de abrir el local. Una vez abierta la jornada podrás registrar todas tus ventas, gastos y retiros en tiempo real.
        </AppText>
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  presetsRow: {
    gap: Spacing.xs,
  },
  presetsLabel: {
    letterSpacing: 0.2,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  presetChip: {
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(213, 0, 93, 0.2)',
  },
  submitWrapper: {
    marginTop: Spacing.xs,
  },
  submitButton: {
    minHeight: 52,
  },
  tipCard: {
    gap: Spacing.xxs + 2,
    padding: Spacing.md,
  },
});

