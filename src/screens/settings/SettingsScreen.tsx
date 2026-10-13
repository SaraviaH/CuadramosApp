import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppButton, AppText, Card, Icon, StatusBadge } from '../../atoms';
import { AlertCard } from '../../molecules';
import { useAuth, useTextScale } from '../../hooks';
import { BackButton, ScreenContainer, ScreenTitle, SegmentedControl } from '../../molecules';
import { AccountStatusCard, LogoutModal } from '../../organisms';
import { Ruta } from '../../types';
import { Colors, Radius, Spacing, TEXT_SCALE_OPTIONS } from '../../theme';

interface Props {
  goBack: () => void;
  navigate: (route: Ruta) => void;
}

export function SettingsScreen({ goBack, navigate }: Props) {
  const { user, logout } = useAuth();
  const { textScale, setTextScale } = useTextScale();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutFeedback, setLogoutFeedback] = useState(false);

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    setLogoutFeedback(true);
    setTimeout(() => setLogoutFeedback(false), 3000);
  };

  return (
    <ScreenContainer>
      <BackButton onPress={goBack} />
      <ScreenTitle
        title="Ajustes"
        subtitle="Configuración y cuenta del terminal."
      />

      {logoutFeedback && (
        <AlertCard tone="success" icon="check" title="Sesión cerrada">
          Has salido de tu cuenta. Sigues teniendo acceso libre a todas las funciones de tu caja.
        </AlertCard>
      )}

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
            <AppText variant="body" color={Colors.muted}>
              Ajusta la escala tipográfica de la aplicación.
            </AppText>
          </View>
        </View>

        <SegmentedControl
          options={TEXT_SCALE_OPTIONS.map(option => option.id)}
          labels={TEXT_SCALE_OPTIONS.map(option => option.label)}
          selected={textScale}
          onSelect={setTextScale}
          tone="magenta"
          size="lg"
        />
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
            <AppText variant="body" color={Colors.muted}>
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
            <Icon name="info" color={Colors.muted} size={20} />
          </View>
          <View style={styles.headerCopy}>
            <View style={styles.versionRow}>
              <AppText variant="heading" color={Colors.text}>
                CuadramosApp
              </AppText>
              <StatusBadge label="v1.0.0 Local" tone="brand" />
            </View>
            <AppText variant="body" color={Colors.muted}>
              Control local de caja diaria para pequeños negocios.
            </AppText>
          </View>
        </View>
      </Card>

      {/* Botón de cerrar sesión si el usuario está autenticado */}
      {user.isLoggedIn && (
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowLogoutModal(true)}
          style={({ pressed }) => [styles.logoutButton, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Icon name="logout" color={Colors.red} size={16} />
          <AppText style={styles.logoutButtonText}>Cerrar sesión</AppText>
        </Pressable>
      )}

      <LogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
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
  logoutButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#F5CFCF',
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#AD3030',
  },
});
