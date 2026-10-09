import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon } from '../../atoms';
import { CuentaUsuario } from '../../types';

interface Props {
  user: CuentaUsuario;
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'ML';
}

export function AccountStatusCard({ user, onLoginPress, onRegisterPress }: Props) {
  if (user.isLoggedIn) {
    return (
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <AppText style={styles.avatarText}>{getInitials(user.name)}</AppText>
        </View>
        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <AppText style={styles.userName}>{user.name}</AppText>
            <View style={styles.activeBadge}>
              <AppText style={styles.activeBadgeText}>ACTIVO</AppText>
            </View>
          </View>
          <AppText style={styles.businessText}>
            {user.businessName} {user.email ? `· ${user.email}` : ''}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.guestCard}>
      <View style={styles.topAccentBar} />
      <View style={styles.topRow}>
        <View style={styles.guestIcon}>
          <Icon name="user" color={Colors.brand} size={22} />
        </View>
        <View style={styles.guestInfo}>
          <View style={styles.guestBadge}>
            <AppText style={styles.guestBadgeText}>Modo libre · Sin cuenta</AppText>
          </View>
          <AppText style={styles.guestTitle}>Mi cuenta (Opcional)</AppText>
          <AppText style={styles.guestDescription}>
            Puedes usar todas las funciones de tu caja sin registrarte. Si deseas respaldar o sincronizar tus datos, inicia sesión o crea tu cuenta.
          </AppText>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onLoginPress}
          style={({ pressed }) => [styles.loginButton, { opacity: pressed ? 0.9 : 1 }]}
        >
          <Icon name="user" color={Colors.white} size={15} />
          <AppText style={styles.loginButtonText}>Iniciar sesión</AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onRegisterPress}
          style={({ pressed }) => [styles.registerButton, { opacity: pressed ? 0.9 : 1 }]}
        >
          <AppText style={styles.registerButtonText}>Crear cuenta</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.brand,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.brandDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.brand,
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
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  businessText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 3,
  },
  guestCard: {
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.line,
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  guestIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestInfo: {
    flex: 1,
    gap: 3,
  },
  guestBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    marginBottom: 2,
  },
  guestBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.green,
  },
  guestTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.ink,
  },
  guestDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.muted,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.sm,
  },
  loginButton: {
    flex: 1,
    minHeight: 44,
    backgroundColor: Colors.brand,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  loginButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  registerButton: {
    flex: 1,
    minHeight: 44,
    backgroundColor: Colors.brandSoft,
    borderWidth: 1,
    borderColor: '#F7D5E4',
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
});
