import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppButton, AppText, Card, Icon, StatusBadge } from '../../atoms';
import { useAuth, useJornada, useTextScale } from '../../hooks';
import { AccountStatusCard, ScreenLayout } from '../../organisms';
import { Ruta } from '../../types';
import { Colors, Radius, Spacing, TEXT_SCALE_OPTIONS } from '../../theme';

interface Props {
  goBack: () => void;
  navigate: (route: Ruta) => void;
}

export function SettingsScreen({ goBack, navigate }: Props) {
  const { user } = useAuth();
  const { notification, dismissNotification } = useJornada();
  const { textScale, setTextScale } = useTextScale();

  return (
    <ScreenLayout
      title="Ajustes"
      subtitle="Configuración y cuenta del terminal."
      onBack={goBack}
      notification={notification}
      onDismissNotification={dismissNotification}
    >
      {/* Prioridad: Mi cuenta */}
      <AccountStatusCard
        user={user}
        onLoginPress={() => navigate('LOGIN')}
        onRegisterPress={() => navigate('REGISTRO')}
      />

      {/* Accesibilidad: Tamaño del texto */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.brandSoft }]}>
            <AppText variant="title" color={Colors.brand}>
              Aa
            </AppText>
          </View>
          <View style={styles.headerCopy}>
            <AppText variant="heading" color={Colors.text}>
              Tamaño del texto
            </AppText>
            <AppText variant="body" color={Colors.textMuted}>
              Ajusta la escala tipográfica de la aplicación.
            </AppText>
          </View>
        </View>

        <View style={styles.scaleSelector}>
          {TEXT_SCALE_OPTIONS.map(option => {
            const isSelected = textScale === option.id;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Tamaño ${option.label}`}
                onPress={() => setTextScale(option.id)}
                style={({ pressed }) => [
                  styles.scaleOptionButton,
                  isSelected && styles.scaleOptionButtonSelected,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <AppText
                  style={[
                    styles.scaleOptionText,
                    isSelected && styles.scaleOptionTextSelected,
                  ]}
                >
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Simulador de pagos */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.brandSoft }]}>
            <Icon name="payments" color={Colors.brand} size={20} />
          </View>
          <View style={styles.headerCopy}>
            <AppText variant="heading" color={Colors.text}>
              Simulador de Pagos Digitales
            </AppText>
            <AppText variant="body" color={Colors.textMuted}>
              Prueba recepción de pagos electrónicos (Yape, Plin).
            </AppText>
          </View>
        </View>
        <AppButton
          label="Abrir simulador"
          variant="secondary"
          onPress={() => navigate('SIMULADOR')}
          style={styles.cardButton}
        />
      </Card>

      {/* Información del Sistema */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.neutralSoft }]}>
            <Icon name="info" color={Colors.textMuted} size={20} />
          </View>
          <View style={styles.headerCopy}>
            <View style={styles.versionRow}>
              <AppText variant="heading" color={Colors.text}>
                CuadramosApp
              </AppText>
              <StatusBadge label="v1.0.0 Local" tone="brand" />
            </View>
            <AppText variant="body" color={Colors.textMuted}>
              Control local de caja diaria para pequeños negocios.
            </AppText>
          </View>
        </View>
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
  scaleSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F4',
    borderRadius: Radius.md,
    padding: 4,
    gap: 6,
    marginTop: Spacing.xs,
  },
  scaleOptionButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  scaleOptionButtonSelected: {
    backgroundColor: Colors.brand,
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  scaleOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#55555C',
  },
  scaleOptionTextSelected: {
    color: Colors.white,
    fontWeight: '800',
  },
});

