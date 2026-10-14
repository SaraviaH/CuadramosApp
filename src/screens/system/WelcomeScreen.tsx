import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { AppButton, AppText, Icon, IconBox, IconName } from '../../atoms';
import { ScreenContainer } from '../../molecules';
import { NavigateFn } from '../../types';
import { setSeenWelcome } from '../../storage/repositories/userSessionRepository';

interface Props {
  navigate: NavigateFn;
}

interface FeatureItem {
  icon: IconName;
  title: string;
  desc: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: 'wallet',
    title: 'Control de caja diario',
    desc: 'Registra tu efectivo inicial y arquea tu turno con total claridad.',
  },
  {
    icon: 'trendingUp',
    title: 'Ventas y gastos en segundos',
    desc: 'Registra cobros en efectivo o digitales y conoce tu saldo en vivo.',
  },
  {
    icon: 'check',
    title: '100% seguro y sin internet',
    desc: 'Todos tus datos se guardan en tu equipo y nunca se pierden.',
  },
];

export function WelcomeScreen({ navigate }: Props) {
  const handleStart = async () => {
    await setSeenWelcome(true);
    navigate('INICIO');
  };

  const handleOpenDayDirectly = async () => {
    await setSeenWelcome(true);
    navigate('ABRIR_JORNADA');
  };

  const handleLogin = async () => {
    await setSeenWelcome(true);
    navigate('LOGIN');
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        {/* Encabezado con Identidad Oficial */}
        <View style={styles.header}>
          <View style={styles.logoSlot}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo Cuadramos"
            />
          </View>
          <AppText style={styles.appName}>CUADRAMOS</AppText>
          <AppText style={styles.tagline}>Control de caja e ingresos para tu negocio</AppText>
        </View>

        {/* Tarjeta de resumen de valor */}
        <View style={styles.featuresCard}>
          {FEATURES.map((item, idx) => (
            <View
              key={item.title}
              style={[
                styles.featureRow,
                idx < FEATURES.length - 1 && styles.featureRowBorder,
              ]}
            >
              <IconBox
                name={item.icon}
                color={Colors.brand}
                backgroundColor={Colors.brandSoft}
                size={40}
                iconSize={20}
                shape="card"
              />
              <View style={styles.featureCopy}>
                <AppText style={styles.featureTitle}>{item.title}</AppText>
                <AppText style={styles.featureDesc}>{item.desc}</AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Acciones principales */}
        <View style={styles.actions}>
          <AppButton
            label="Empezar a cuadrar"
            tone="magenta"
            onPress={handleStart}
            showChevron
          />

          <AppButton
            label="Abrir caja del día"
            variant="secondary"
            onPress={handleOpenDayDirectly}
            iconName="wallet"
          />

          <View style={styles.loginRow}>
            <AppText style={styles.loginPrompt}>¿Ya tienes una cuenta?</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
              onPress={handleLogin}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <AppText style={styles.loginLink}>Iniciar sesión</AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: Spacing.sm,
    gap: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  logoSlot: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  logo: {
    width: 54,
    height: 54,
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.brand,
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 290,
  },
  featuresCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  featureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  featureCopy: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '700',
    color: Colors.text,
  },
  featureDesc: {
    fontSize: Typography.micro.fontSize,
    lineHeight: 17,
    color: Colors.muted,
  },
  actions: {
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.xs,
  },
  loginPrompt: {
    fontSize: Typography.micro.fontSize,
    color: Colors.muted,
  },
  loginLink: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.brand,
  },
});
