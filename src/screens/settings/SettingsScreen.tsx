import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppText, Card, StatusBadge } from '../../atoms';
import { useJornada } from '../../hooks';
import { ScreenLayout } from '../../organisms';
import { Ruta } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';

interface Props {
  goBack: () => void;
  navigate: (route: Ruta) => void;
}

export function SettingsScreen({ goBack, navigate }: Props) {
  const { notification, dismissNotification } = useJornada();

  return (
    <ScreenLayout
      title="Ajustes del sistema"
      subtitle="Configuración y herramientas del terminal de caja."
      onBack={goBack}
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      {/* Simulador de pagos */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <AppText variant="title" color={Colors.brand}>
              💳
            </AppText>
          </View>
          <View style={styles.headerCopy}>
            <AppText variant="heading" color={Colors.text}>
              Simulador de Pagos Digitales
            </AppText>
            <AppText variant="body" color={Colors.textMuted}>
              Prueba la recepción y emisión de pagos electrónicos (Yape, Plin, tarjeta) y observa cómo impactan el cierre.
            </AppText>
          </View>
        </View>
        <AppButton
          label="Abrir simulador de eventos de pago"
          variant="secondary"
          onPress={() => navigate('DEMO')}
          style={styles.cardButton}
        />
      </Card>

      {/* Información del Sistema */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.neutralSoft }]}>
            <AppText variant="title" color={Colors.textMuted}>
              ℹ
            </AppText>
          </View>
          <View style={styles.headerCopy}>
            <View style={styles.versionRow}>
              <AppText variant="heading" color={Colors.text}>
                CuadramosApp
              </AppText>
              <StatusBadge label="v0.0.1 MVP" tone="brand" />
            </View>
            <AppText variant="body" color={Colors.textMuted}>
              Control local de caja diaria para pequeños negocios y comercios independientes. Almacenamiento 100% offline y seguro.
            </AppText>
          </View>
        </View>

        <View style={styles.featuresList}>
          <FeatureItem text="Control estricto de apertura y cierre de turno" />
          <FeatureItem text="Bloqueo preventivo ante pagos pendientes" />
          <FeatureItem text="Cálculo automático de saldos en Soles (PEN)" />
          <FeatureItem text="Persistencia local mediante AsyncStorage" />
        </View>
      </Card>
    </ScreenLayout>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <AppText variant="bodyMedium" color={Colors.success}>
        ✓
      </AppText>
      <AppText variant="body" color={Colors.textMuted} style={styles.featureText}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: Spacing.xxs,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cardButton: {
    marginTop: Spacing.xs,
  },
  featuresList: {
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  featureText: {
    flex: 1,
  },
});

