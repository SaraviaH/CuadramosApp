import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, Spacing } from '../../theme';
import { IconName } from '../../atoms';
import { ListRow, BackButton, ScreenContainer, ScreenTitle, SectionHeader } from '../../molecules';
import { Ruta } from '../../types';

interface Props {
  navigate: (route: Ruta) => void;
  goBack: () => void;
}

interface MenuItem {
  title: string;
  icon: IconName;
  route: Ruta | null;
  toneBg: string;
  iconColor: string;
  subtitle?: string;
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
    title: 'Ajustes y cuenta',
    icon: 'settings',
    route: 'CONFIGURACION',
    toneBg: Colors.neutralSoft,
    iconColor: Colors.text,
  },
  {
    title: 'Centro de ayuda y soporte',
    icon: 'help',
    route: null,
    toneBg: Colors.greenLight,
    iconColor: Colors.green,
    subtitle: 'Próximamente',
  },
];

export function MoreScreen({ navigate, goBack }: Props) {
  return (
    <ScreenContainer>
      <ScreenTitle
        left={<BackButton onPress={goBack} />}
        title="Más opciones"
        subtitle="Las herramientas de tu caja."
      />

      {/* Accesos: cada opción es una tarjeta redondeada independiente */}
      <SectionHeader icon="sparkle" title="Herramientas" />

      <View style={styles.menuList}>
        {MENU_ITEMS.map(item => (
          <ListRow
            key={item.title}
            icon={item.icon}
            iconColor={item.iconColor}
            iconBackgroundColor={item.toneBg}
            title={item.title}
            subtitle={item.subtitle}
            disabled={!item.route}
            onPress={() => item.route && navigate(item.route)}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  menuList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
});
