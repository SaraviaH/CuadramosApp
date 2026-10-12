import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppText, Icon, IconName } from '../../atoms';
import { BrandHeader, ScreenTitle } from '../../molecules';
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
    toneBg: '#FFF7DB',
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
    toneBg: '#F0F0F2',
    iconColor: '#55555C',
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
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <BrandHeader />
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
          <Pressable
            key={item.title}
            accessibilityRole="button"
            onPress={() => item.route && navigate(item.route)}
            style={({ pressed }) => [
              styles.menuButton,
              idx === MENU_ITEMS.length - 1 && styles.menuButtonLast,
              { opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: item.toneBg }]}>
              <Icon name={item.icon} color={item.iconColor} size={18} />
            </View>
            <AppText style={styles.menuTitle}>{item.title}</AppText>
            <Icon name="chevron" color={Colors.muted} size={16} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  menuList: {
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: Spacing.md,
  },
  menuButton: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDF0',
  },
  menuButtonLast: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.ink,
  },
});
