import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, Card } from '../../atoms';
import { useJornada } from '../../hooks';
import { DemoPaymentForm, PendingEventsPanel, ScreenLayout } from '../../organisms';
import { Colors, Radius, Sizes, Spacing } from '../../theme';

interface Props {
  goBack: () => void;
}

export function DemoToolsScreen({ goBack }: Props) {
  const {
    createPaymentEvent,
    eventosPendientes,
    confirmPaymentEvent,
    cancelPaymentEvent,
    notification,
    dismissNotification,
  } = useJornada();

  const [simMode, setSimMode] = useState<'RECIBIDO' | 'REALIZADO'>('RECIBIDO');

  return (
    <ScreenLayout
      title="Simulador de pagos"
      subtitle="Prueba cómo interactúan los cobros y pagos digitales con el arqueo diario."
      onBack={goBack}
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      {/* Tarjeta didáctica explicativa */}
      <Card variant="accent" style={styles.guideCard}>
        <AppText variant="label" color="#8A5D00">
          💡 REGLA DE PAGOS DIGITALES
        </AppText>
        <AppText variant="body" color="#614100">
          Los pagos ingresan en estado <AppText variant="captionBold" color="#614100">PENDIENTE</AppText> y NO alteran el saldo de caja hasta que los confirmas. Recuerda que no podrás cerrar la jornada con pagos sin resolver.
        </AppText>
      </Card>

      {/* Selector de modo de simulación */}
      <View style={styles.selectorContainer}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: simMode === 'RECIBIDO' }}
          onPress={() => setSimMode('RECIBIDO')}
          style={[
            styles.modeButton,
            simMode === 'RECIBIDO' ? styles.modeActiveReceived : undefined,
          ]}
        >
          <AppText
            variant="label"
            color={simMode === 'RECIBIDO' ? Colors.white : Colors.textMuted}
          >
            Cobro de cliente
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: simMode === 'REALIZADO' }}
          onPress={() => setSimMode('REALIZADO')}
          style={[
            styles.modeButton,
            simMode === 'REALIZADO' ? styles.modeActiveSpent : undefined,
          ]}
        >
          <AppText
            variant="label"
            color={simMode === 'REALIZADO' ? Colors.white : Colors.textMuted}
          >
            Pago a proveedor
          </AppText>
        </Pressable>
      </View>

      {/* Formulario activo */}
      {simMode === 'RECIBIDO' ? (
        <DemoPaymentForm
          type="PAGO_RECIBIDO"
          onCreate={(amount, concept) => createPaymentEvent(amount, concept, 'PAGO_RECIBIDO')}
        />
      ) : (
        <DemoPaymentForm
          type="PAGO_REALIZADO"
          onCreate={(amount, concept) => createPaymentEvent(amount, concept, 'PAGO_REALIZADO')}
        />
      )}

      {/* Listado de eventos pendientes */}
      <View style={styles.pendingHeader}>
        <View style={styles.pendingTitleRow}>
          <AppText variant="heading" color={Colors.text}>
            Cola de pagos pendientes
          </AppText>
          {eventosPendientes.length > 0 ? (
            <View style={styles.counterBadge}>
              <AppText variant="captionBold" color={Colors.white}>
                {eventosPendientes.length.toString()}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText variant="body" color={Colors.textMuted}>
          Confirma para aplicar al saldo o descarta para anular el cobro.
        </AppText>
      </View>

      <PendingEventsPanel
        events={eventosPendientes}
        onConfirm={confirmPaymentEvent}
        onCancel={cancelPaymentEvent}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  guideCard: {
    gap: Spacing.xxs,
    padding: Spacing.md,
  },
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutralSoft,
    padding: Spacing.xxs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeButton: {
    flex: 1,
    minHeight: Sizes.touchTarget,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  modeActiveReceived: {
    backgroundColor: Colors.success,
  },
  modeActiveSpent: {
    backgroundColor: Colors.danger,
  },
  pendingHeader: {
    gap: 2,
    marginTop: Spacing.sm,
  },
  pendingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  counterBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 1,
    borderRadius: Radius.pill,
  },
});

