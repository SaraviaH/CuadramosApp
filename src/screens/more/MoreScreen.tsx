import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing, Surfaces } from '../../theme';
import { IconName } from '../../atoms';
import { ListRow, ScreenContainer, ScreenTitle } from '../../molecules';
import { AccountStatusCard } from '../../organisms';
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  menuList: {
    ...Surfaces.card,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
});
