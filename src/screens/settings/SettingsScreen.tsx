import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppButton, AppText, Icon, StatusBadge } from '../../atoms';
import { AlertCard } from '../../molecules';
import { useAuth, useJornada, useTextScale } from '../../hooks';
import { BackButton, ScreenContainer, ScreenTitle, SectionHeader, SegmentedControl, SettingsCard } from '../../molecules';
import { AccountStatusCard, CleanDataModal, LogoutModal } from '../../organisms';
import { Ruta } from '../../types';
import { Colors, Radius, Spacing, TEXT_SCALE_OPTIONS, Typography } from '../../theme';
import { syncQueueRepository } from '../../storage';
import { dataCleanupService, OperationalDataSummary, syncService } from '../../services';

interface Props {
  goBack: () => void;
  navigate: (route: Ruta) => void;
}

export function SettingsScreen({ goBack, navigate }: Props) {
  const { user, logout } = useAuth();
  const { clearLocalData } = useJornada();
  const { textScale, setTextScale } = useTextScale();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutFeedback, setLogoutFeedback] = useState(false);
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [cleanFeedback, setCleanFeedback] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanSummary, setCleanSummary] = useState<OperationalDataSummary | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@cuadramos/auto_sync').then(val => {
      if (val !== null) setAutoSyncEnabled(val === 'true');
    });

    if (user.id && user.id !== 'guest_local') {
      syncQueueRepository.getPendingItems(user.id).then(items => {
        setPendingCount(items.length);
      }).catch(() => {});
    }
  }, [user.id]);

  const handleToggleAutoSync = async (val: boolean) => {
    setAutoSyncEnabled(val);
    await AsyncStorage.setItem('@cuadramos/auto_sync', val ? 'true' : 'false').catch(() => {});
  };

  const handleManualSync = async () => {
    if (!user.id || user.id === 'guest_local') return;
    setIsSyncing(true);
    try {
      await syncService.syncPendingChanges(user.id);
      const items = await syncQueueRepository.getPendingItems(user.id);
      setPendingCount(items.length);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    setLogoutFeedback(true);
    setTimeout(() => setLogoutFeedback(false), 3000);
  };

  const handleOpenCleanModal = async () => {
    try {
      const summary = await dataCleanupService.getOperationalDataSummary(user.id);
      setCleanSummary(summary);
    } catch {
      setCleanSummary(null);
    }
    setShowCleanModal(true);
  };

  const handleCleanConfirm = async () => {
    setIsCleaning(true);
    try {
      await clearLocalData();
      setShowCleanModal(false);
      setPendingCount(0);
      setCleanFeedback(true);
      setTimeout(() => setCleanFeedback(false), 4000);
    } catch {
      // El error lo reporta JornadaContext
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenTitle
        left={<BackButton onPress={goBack} />}
        title="Ajustes"
        subtitle="Configuración y cuenta del negocio."
      />

      {logoutFeedback && (
        <AlertCard tone="success" icon="check" title="Sesión cerrada">
          Has salido de tu cuenta. Sigues teniendo acceso libre a todas las funciones de tu caja.
        </AlertCard>
      )}

      {cleanFeedback && (
        <AlertCard tone="success" icon="check" title="Datos locales eliminados">
          Se han eliminado los datos operativos de este dispositivo. La caja y los movimientos están listos para comenzar de nuevo.
        </AlertCard>
      )}

      {/* Cuenta */}
      <View style={styles.section}>
        <SectionHeader icon="user" title="Cuenta" />
        <AccountStatusCard
          user={user}
          onLoginPress={() => navigate('LOGIN')}
          onRegisterPress={() => navigate('REGISTRO')}
        />
        {user.isLoggedIn && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            onPress={() => setShowLogoutModal(true)}
            style={({ pressed }) => [styles.logoutButton, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Icon name="logout" color={Colors.danger} size={16} />
            <AppText style={styles.logoutButtonText}>Cerrar sesión</AppText>
          </Pressable>
        )}
      </View>

      {/* Accesibilidad */}
      <View style={styles.section}>
        <SectionHeader icon="eye" title="Accesibilidad" />
        <SettingsCard
          iconText="Aa"
          iconColor={Colors.brand}
          title="Tamaño del texto"
          description="Ajusta la escala tipográfica de la aplicación."
        >
          <SegmentedControl
            options={TEXT_SCALE_OPTIONS.map(option => option.id)}
            labels={TEXT_SCALE_OPTIONS.map(option => option.label)}
            selected={textScale}
            onSelect={setTextScale}
            tone="magenta"
            size="lg"
          />
        </SettingsCard>
      </View>

      {/* Sincronización y respaldo */}
      <View style={styles.section}>
        <SectionHeader icon="arrowUp" title="Sincronización y respaldo" />
        <SettingsCard
          icon="check"
          title="Sincronización automática"
          description={
            autoSyncEnabled
              ? 'Los registros se respaldan automáticamente cuando hay conexión.'
              : 'Sincronización pausada. Tus datos se mantienen seguros en tu dispositivo.'
          }
          right={
            <Switch
              value={autoSyncEnabled}
              onValueChange={handleToggleAutoSync}
              trackColor={{ false: Colors.border, true: Colors.brand }}
              thumbColor={Colors.white}
              accessibilityLabel="Sincronización automática"
            />
          }
        >
          <View style={styles.syncFooterRow}>
            <View style={styles.syncStatusWrap}>
              <StatusBadge
                label={user.isLoggedIn ? (pendingCount > 0 ? `${pendingCount} pendientes` : 'Sincronizado') : 'Sin cuenta'}
                tone={pendingCount > 0 ? 'warning' : 'brand'}
              />
            </View>
            {user.isLoggedIn && pendingCount > 0 && (
              <AppButton
                label="Sincronizar ahora"
                variant="secondary"
                loading={isSyncing}
                onPress={handleManualSync}
                style={styles.syncButton}
              />
            )}
          </View>
        </SettingsCard>
      </View>

      {/* Almacenamiento local */}
      <View style={styles.section}>
        <SectionHeader icon="tag" title="Almacenamiento" />
        <SettingsCard
          icon="alert"
          iconColor={Colors.danger}
          iconBackgroundColor={Colors.dangerSoft}
          title="Datos operativos locales"
          description="Libera el espacio ocupado por movimientos, jornadas y arqueos en este teléfono. Tu cuenta, accesibilidad y configuraciones se mantendrán intactas."
        >
          <View style={styles.cleanActionWrap}>
            <AppButton
              variant="danger"
              tone="red"
              label="Limpiar datos locales"
              onPress={handleOpenCleanModal}
              style={styles.cleanButton}
            />
          </View>
        </SettingsCard>
      </View>

      {/* Pie de página: versión */}
      <View style={styles.footer}>
        <AppText style={styles.footerText}>Yupay · v1.0.0 Local</AppText>
      </View>

      <LogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

      <CleanDataModal
        visible={showCleanModal}
        onCancel={() => setShowCleanModal(false)}
        onConfirm={handleCleanConfirm}
        isCleaning={isCleaning}
        summary={cleanSummary}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    minHeight: 52,
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dangerSoft,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    borderRadius: Radius.card,
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.danger,
  },
  syncFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.xs,
  },
  syncStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButton: {
    minHeight: 38,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  footerText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.text,
  },
  cleanActionWrap: {
    paddingTop: Spacing.xs,
    marginTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cleanButton: {
    minHeight: 46,
  },
});
