import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import { AppButton, AppText } from '../../atoms';
import { ScreenContainer } from '../../molecules';
import { NavigateFn } from '../../types';
import { setSeenWelcome } from '../../storage/repositories/userSessionRepository';

interface Props {
  navigate: NavigateFn;
}

export function WelcomeScreen({ navigate }: Props) {
  const handleStart = async () => {
    await setSeenWelcome(true);
    navigate('INICIO');
  };

  const handleLogin = async () => {
    await setSeenWelcome(true);
    navigate('LOGIN');
  };

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <View style={styles.content}>
        {/* Identidad Yupay */}
        <View style={styles.brandSection}>
          <View style={styles.logoSlot}>
            <Image
              source={require('../../assets/images/yupay-icono.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo Yupay"
            />
          </View>
          <AppText style={styles.brandTitle}>Yupay</AppText>
          <AppText style={styles.tagline}>Controla tu caja de forma simple</AppText>
        </View>

        {/* Acciones principales */}
        <View style={styles.actions}>
          <AppButton
            label="Empezar ya"
            tone="magenta"
            onPress={handleStart}
            showChevron
          />

          <AppButton
            label="Iniciar sesión"
            variant="outline"
            onPress={handleLogin}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.xxl,
    paddingHorizontal: Spacing.sm,
  },
  brandSection: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logoSlot: {
    width: 100,
    height: 100,
    borderRadius: Radius.xl,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.brandDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  logo: {
    width: 76,
    height: 70,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.brand,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.body.fontSize,
    fontWeight: '600',
    color: Colors.muted,
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 280,
    lineHeight: 22,
  },
  actions: {
    gap: Spacing.sm,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
});
