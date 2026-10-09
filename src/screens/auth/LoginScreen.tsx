import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppButton, AppInput, AppText, Icon } from '../../atoms';
import { ScreenTitle } from '../../molecules';
import { useAuth } from '../../hooks';
import { Ruta } from '../../types';

interface Props {
  navigate: (route: Ruta) => void;
}

export function LoginScreen({ navigate }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setBusy(true);
    try {
      await login(email);
      navigate('INICIO');
    } catch {
      // Handled
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Barra superior con volver y badge */}
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigate('MAS')}
          style={styles.backButton}
        >
          <Icon name="arrow" color={Colors.brandDark} size={15} />
          <AppText variant="caption" style={styles.backText}>Volver a Más</AppText>
        </Pressable>
        <View style={styles.optionalBadge}>
          <AppText variant="caption" style={styles.optionalBadgeText}>Acceso opcional</AppText>
        </View>
      </View>

      {/* Hero del logo */}
      <View style={styles.brandHero}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Logo Compartamos Banco"
        />
        <AppText variant="title" style={styles.brandTitle}>COMPARTAMOS</AppText>
        <AppText variant="subtitle" style={styles.brandSubtitle}>BANCO</AppText>
      </View>

      <ScreenTitle
        alignCenter
        title="Iniciar sesión"
        subtitle="Accede de forma opcional para sincronizar tus datos y respaldar tu caja."
      />

      {/* Formulario */}
      <View style={styles.formCard}>
        <AppInput
          label="Correo electrónico"
          icon="mail"
          placeholder="Ingresa tu correo"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View>
          <AppInput
            label="Contraseña"
            icon="lock"
            placeholder="Ingresa tu contraseña"
            secureTextEntry={!showPassword}
            rightIcon="eye"
            onRightIconPress={() => setShowPassword(p => !p)}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.forgotButton}>
            <AppText variant="caption" style={styles.forgotText}>¿Olvidaste tu contraseña?</AppText>
          </Pressable>
        </View>

        <AppButton
          label="Iniciar sesión"
          loading={busy}
          onPress={handleLogin}
          style={{ marginTop: Spacing.xs }}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => navigate('INICIO')}
          style={styles.skipButton}
        >
          <AppText variant="label" style={styles.skipButtonText}>Continuar sin iniciar sesión</AppText>
        </Pressable>

        <View style={styles.authSwitch}>
          <AppText variant="body" style={styles.authSwitchText}>¿No tienes una cuenta? </AppText>
          <Pressable onPress={() => navigate('REGISTRO')}>
            <AppText variant="label" style={styles.authLink}>Regístrate</AppText>
          </Pressable>
        </View>

        <AppText variant="caption" style={styles.demoHint}>Demo · Acceso opcional de prueba</AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.brandSoft,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  backText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  optionalBadge: {
    backgroundColor: '#ECECEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  optionalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.muted,
  },
  brandHero: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  brandLogo: {
    width: 56,
    height: 56,
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: '800',
    color: Colors.brand,
  },
  brandSubtitle: {
    fontSize: 8.5,
    letterSpacing: 2.2,
    fontWeight: '600',
    color: Colors.muted,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.line,
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.brandDark,
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  skipButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.muted,
    textDecorationLine: 'underline',
  },
  authSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authSwitchText: {
    fontSize: 12,
    color: Colors.muted,
  },
  authLink: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.brand,
  },
  demoHint: {
    fontSize: 10,
    color: Colors.muted,
    textAlign: 'center',
  },
});
