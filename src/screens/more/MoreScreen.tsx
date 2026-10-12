import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Surfaces, Typography } from '../../theme';
import { AppText, Icon, IconName } from '../../atoms';
import { AlertCard, ListRow, ScreenContainer, ScreenTitle } from '../../molecules';
import { AccountStatusCard, LogoutModal } from '../../organisms';
import { useAuth } from '../../hooks';
import { Ruta } from '../../types';

interface Props {
  navigate: (route: Ruta) => void;
}

interface MenuItem {
  title: string;
  icon: IconName;
  route: Ruta | null;
  toneBg: string;
  iconColor: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Fondo inicial de caja',
    icon: 'wallet',
    route: 'ABRIR_JORNADA',
    toneBg: Colors.greenLight,
    iconColor: Colors.green,
  },
  {
    title: 'Historial de cajas pasadas',
    icon: 'clock',
    route: 'HISTORIAL_CAJAS',
    toneBg: Colors.warningSoft,
    iconColor: Colors.orange,
  },
  {
    title: 'Simulador de pagos digitales',
    icon: 'payments',
    route: 'SIMULADOR',
    toneBg: Colors.brandSoft,
    iconColor: Colors.brand,
  },
  {
    title: 'Ajustes y accesibilidad',
    icon: 'settings',
    route: 'CONFIGURACION',
    toneBg: Colors.neutralSoft,
    iconColor: Colors.mutedStrong,
  },
  {
    title: 'Centro de ayuda y soporte',
    icon: 'help',
    route: null,
    toneBg: Colors.greenLight,
    iconColor: Colors.green,
  },
];

export function MoreScreen({ navigate }: Props) {
  const { user } = useAuth();

  return (
    <ScreenContainer>
      <ScreenTitle title="Más opciones" />

      {/* Prioridad: Estado y perfil de la cuenta */}
      <AccountStatusCard
        user={user}
        onLoginPress={() => navigate('LOGIN')}
        onRegisterPress={() => navigate('REGISTRO')}
      />

      {/* Lista de accesos funcionales simplificada */}
      <View style={styles.menuList}>
        {MENU_ITEMS.map((item, idx) => (
          <ListRow
            key={item.title}
            icon={item.icon}
            iconColor={item.iconColor}
            iconBackgroundColor={item.toneBg}
            title={item.title}
            onPress={() => item.route && navigate(item.route)}
            divider={idx < MENU_ITEMS.length - 1}
          />
        ))}
      </View>

      {/* Botón de cierre de jornada */}
      <ListRow
        icon="logout"
        iconColor={Colors.red}
        iconBackgroundColor={Colors.white}
        title="Cerrar jornada"
        subtitle="Arqueo y sellado de la caja del día"
        titleColor={Colors.danger}
        titleWeight="800"
        onPress={() => navigate('CERRAR_JORNADA')}
        chevronColor={Colors.red}
        style={styles.closeDayButton}
      />

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
  menuList: {
    ...Surfaces.card,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  closeDayButton: {
    minHeight: 68,
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    ...Radius.asymmetricCard,
    marginBottom: Spacing.md,
  },
  logoutButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dangerSoft,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    borderRadius: Radius.md,
    marginTop: 2,
  },
  logoutButtonText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: '700',
    color: Colors.danger,
  },
});
