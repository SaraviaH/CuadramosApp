import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Surfaces, Typography } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { CuentaUsuario } from '../../types';
import { EditProfileModal } from './EditProfileModal';
import { useAuth } from '../../hooks';
import { getInitials } from '../../utils';

interface Props {
  user: CuentaUsuario;
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

import { GUEST_USER_ID } from '../../types';
import { jornadaSqliteRepository } from '../../storage';
import { useEffect } from 'react';

export function AccountStatusCard({ user, onLoginPress, onRegisterPress }: Props) {
  const { updateProfile, importGuestData } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [hasGuestData, setHasGuestData] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importFeedback, setImportFeedback] = useState(false);

  useEffect(() => {
    if (user.isLoggedIn) {
      jornadaSqliteRepository.getAllJornadas(GUEST_USER_ID).then(list => {
        setHasGuestData(list.length > 0);
      }).catch(() => {});
    } else {
      setHasGuestData(false);
    }
  }, [user.isLoggedIn]);

  const handleImportConfirm = async () => {
    setImporting(true);
    try {
      const count = await importGuestData();
      if (count > 0) {
        setImportFeedback(true);
        setHasGuestData(false);
        setTimeout(() => setImportFeedback(false), 4000);
      }
    } catch {
      // Handled
    } finally {
      setImporting(false);
    }
  };

  const displayName = user.name?.trim() || 'Comerciante';

  return (
    <>
      <View style={user.isLoggedIn ? styles.profileCard : styles.guestCard}>
        {!user.isLoggedIn && <View style={styles.topAccentBar} />}

        <View style={styles.mainRow}>
          {/* Avatar con foto o iniciales */}
          <View style={[styles.avatarWrap, user.isLoggedIn && styles.avatarWrapLoggedIn]}>
            {user.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.avatarImage} />
            ) : user.name?.trim() ? (
              <AppText style={[styles.avatarText, user.isLoggedIn && styles.avatarTextLoggedIn]}>
                {getInitials(user.name)}
              </AppText>
            ) : (
              <Icon name="user" color={user.isLoggedIn ? Colors.brand : Colors.brandDark} size={22} />
            )}
          </View>

          {/* Datos del comerciante */}
          <View style={styles.infoCol}>
            <View style={styles.badgeRow}>
              <View style={[styles.statusBadge, user.isLoggedIn ? styles.statusBadgeLoggedIn : styles.statusBadgeGuest]}>
                <AppText style={[styles.statusBadgeText, user.isLoggedIn && styles.statusBadgeTextLoggedIn]}>
                  {user.isLoggedIn ? 'SESIÓN ACTIVA' : 'MODO LIBRE · LOCAL'}
                </AppText>
              </View>
            </View>

            <AppText style={[styles.userName, user.isLoggedIn && styles.userNameLoggedIn]} numberOfLines={1}>
              {displayName}
            </AppText>

            <AppText style={[styles.businessText, user.isLoggedIn && styles.businessTextLoggedIn]} numberOfLines={1}>
              {user.businessName || 'Mi negocio'}
              {user.email ? ` · ${user.email}` : ''}
            </AppText>
          </View>
        </View>

        {/* Acciones principales */}
        {user.isLoggedIn ? (
          <View style={styles.actionsRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setModalVisible(true)}
              style={({ pressed }) => [
                styles.editButtonLoggedIn,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Icon name="user" color={Colors.white} size={14} />
              <AppText style={styles.editButtonTextLoggedIn}>
                Editar perfil
              </AppText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.guestContentWrap}>
            {/* Botón para editar perfil local */}
            <Pressable
              accessibilityRole="button"
              onPress={() => setModalVisible(true)}
              style={({ pressed }) => [
                styles.editProfileButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Icon name="user" color={Colors.brandDark} size={15} />
              <AppText style={styles.editProfileButtonText}>
                Editar datos del negocio
              </AppText>
            </Pressable>

            {/* Bloque de Respaldo y Acceso Opcional a la Nube */}
            <View style={styles.cloudAccessSection}>
              <View style={styles.cloudCopy}>
                <AppText style={styles.cloudTitle}>Respaldo en la nube (opcional)</AppText>
                <AppText style={styles.cloudSubtitle}>
                  Crea una cuenta para sincronizar tus ventas o ingresa con tu cuenta existente.
                </AppText>
              </View>

              <View style={styles.authButtonsRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={onLoginPress}
                  style={({ pressed }) => [styles.loginButton, { opacity: pressed ? 0.85 : 1 }]}
                >
                  <AppText style={styles.loginButtonText}>Ingresar</AppText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={onRegisterPress}
                  style={({ pressed }) => [styles.registerButton, { opacity: pressed ? 0.85 : 1 }]}
                >
                  <AppText style={styles.registerButtonText}>Crear cuenta</AppText>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>

      {importFeedback ? (
        <View style={styles.importFeedbackWrap}>
          <View style={styles.importSuccessCard}>
            <Icon name="check" color={Colors.green} size={18} />
            <AppText style={styles.importSuccessText}>
              ¡Tus registros anteriores han sido vinculados con éxito a tu cuenta!
            </AppText>
          </View>
        </View>
      ) : null}

      {hasGuestData && user.isLoggedIn && !importFeedback ? (
        <View style={styles.importPromptCard}>
          <View style={styles.importPromptHeader}>
            <Icon name="wallet" color={Colors.brand} size={18} />
            <AppText style={styles.importPromptTitle}>Datos locales detectados</AppText>
          </View>
          <AppText style={styles.importPromptBody}>
            Tienes registros de caja creados en este teléfono antes de iniciar sesión. ¿Deseas vincularlos a tu cuenta?
          </AppText>
          <Pressable
            accessibilityRole="button"
            onPress={handleImportConfirm}
            disabled={importing}
            style={({ pressed }) => [styles.importConfirmButton, { opacity: pressed || importing ? 0.8 : 1 }]}
          >
            <AppText style={styles.importConfirmButtonText}>
              {importing ? 'Vinculando...' : 'Vincular datos a mi cuenta'}
            </AppText>
          </Pressable>
        </View>
      ) : null}

      <EditProfileModal
        visible={modalVisible}
        user={user}
        onClose={() => setModalVisible(false)}
        onSave={updateProfile}
      />
    </>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: Typography.body.fontSize,
    fontWeight: '800',
    color: Colors.white,
  },
  activeBadge: {
    backgroundColor: Colors.onColorSurface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  activeBadgeText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  businessText: {
    fontSize: Typography.micro.fontSize,
    color: Colors.onColor,
    marginTop: 3,
  },
  guestCard: {
    ...Surfaces.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.brand,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brandSoft,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F7D5E4',
  },
  avatarWrapLoggedIn: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brandDark,
  },
  avatarTextLoggedIn: {
    color: Colors.brand,
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  statusBadgeGuest: {
    backgroundColor: Colors.brandSoft,
    borderWidth: 1,
    borderColor: '#F7D5E4',
  },
  statusBadgeLoggedIn: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.brandDark,
    letterSpacing: 0.5,
  },
  statusBadgeTextLoggedIn: {
    color: Colors.white,
  },
  guestTitle: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  guestDescription: {
    fontSize: Typography.micro.fontSize,
    lineHeight: 16,
    color: Colors.text,
  },
  businessTextLoggedIn: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  editButtonLoggedIn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
  },
  editButtonTextLoggedIn: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  guestContentWrap: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  editProfileButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3EFEF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
  },
  editProfileButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  cloudAccessSection: {
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  cloudCopy: {
    gap: 2,
  },
  cloudTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  cloudSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.text,
  },
  authButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  loginButton: {
    flex: 1,
    minHeight: 46,
    backgroundColor: Colors.brand,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  loginButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
  },
  registerButton: {
    flex: 1,
    minHeight: 46,
    backgroundColor: Colors.brandSoft,
    borderWidth: 1.5,
    borderColor: Colors.brand,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  registerButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.brand,
  },
  importSuccessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.greenLight,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#B7E4C7',
  },
  importSuccessText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.green,
    flex: 1,
  },
  userNameLoggedIn: {
    color: Colors.white,
  },
  importFeedbackWrap: {
    marginBottom: Spacing.md,
  },
  importPromptCard: {
    backgroundColor: Colors.brandSoft,
    borderWidth: 1,
    borderColor: Colors.brandBorder,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  importPromptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  importPromptTitle: {
    fontSize: Typography.label.fontSize,
    fontWeight: '800',
    color: Colors.brandDark,
  },
  importPromptBody: {
    fontSize: Typography.micro.fontSize,
    lineHeight: 17,
    color: Colors.text,
  },
  importConfirmButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand,
    borderRadius: Radius.sm,
    marginTop: Spacing.xxs,
  },
  importConfirmButtonText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.white,
  },
});
