import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppButton, AppInput, AppText, Icon } from '../../atoms';
import { AuthScaffold, ScreenTitle, AlertCard } from '../../molecules';
import { useAuth } from '../../hooks';
import { Ruta } from '../../types';

interface Props {
  navigate: (route: Ruta) => void;
}

export function RegisterScreen({ navigate }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!password) {
      setErrorMessage('Por favor ingresa una contraseña.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setBusy(true);
    setErrorMessage('');
    try {
      const res = await register(name.trim(), email.trim(), password);
      if (res.requiresEmailConfirmation) {
        setEmailConfirmationRequired(true);
      } else {
        navigate('INICIO');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al registrar la cuenta.');
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
        title="Crear cuenta"
        subtitle="Crea tu cuenta de forma opcional para respaldar tu negocio."
      />

      {emailConfirmationRequired ? (
        <View style={{ marginBottom: Spacing.md }}>
          <AlertCard tone="success" icon="mail" title="¡Confirma tu correo electrónico!">
            Hemos enviado un enlace de confirmación a {email}. Abre tu correo y haz clic en el enlace para activar tu cuenta antes de iniciar sesión.
          </AlertCard>
          <AppButton
            label="Ir a Iniciar Sesión"
            onPress={() => navigate('LOGIN')}
            style={{ marginTop: Spacing.md }}
          />
        </View>
      ) : null}

      {errorMessage ? (
        <View style={{ marginBottom: Spacing.md }}>
          <AlertCard tone="error" icon="alert" title="No se pudo crear la cuenta">
            {errorMessage}
          </AlertCard>
        </View>
      ) : null}

      {/* Formulario */}
      {!emailConfirmationRequired && (
        <View style={styles.formCard}>
          <AppInput
            label="Nombre"
            icon="user"
            placeholder="Ingresa tu nombre"
            value={name}
            onChangeText={setName}
          />

          <AppInput
            label="Correo electrónico"
            icon="mail"
            placeholder="Ingresa tu correo"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

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

          <AppInput
            label="Confirmar contraseña"
            icon="lock"
            placeholder="Confirma tu contraseña"
            secureTextEntry={!showPassword}
            rightIcon="eye"
            onRightIconPress={() => setShowPassword(p => !p)}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <AppButton
            label="Crear cuenta"
            loading={busy}
            onPress={handleRegister}
            style={{ marginTop: Spacing.xs }}
          />

          <Pressable
            accessibilityRole="button"
            onPress={() => navigate('INICIO')}
            style={styles.skipButton}
          >
            <AppText variant="label" style={styles.skipButtonText}>Continuar sin registrarme</AppText>
          </Pressable>

          <View style={styles.authSwitch}>
            <AppText variant="body" style={styles.authSwitchText}>¿Ya tienes una cuenta? </AppText>
            <Pressable onPress={() => navigate('LOGIN')}>
              <AppText variant="label" style={styles.authLink}>Inicia sesión</AppText>
            </Pressable>
          </View>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: '#F5F5F7',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#E8E8EC',
  },
  backText: {
    color: Colors.brandDark,
    fontWeight: '700',
  },
  optionalBadge: {
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  optionalBadgeText: {
    color: Colors.brand,
    fontWeight: '700',
  },
  brandHero: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  brandLogo: {
    width: 64,
    height: 64,
    marginBottom: Spacing.xs,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.brand,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.brandDark,
    letterSpacing: 4,
    marginTop: -2,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    gap: Spacing.md,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  skipButtonText: {
    color: Colors.muted,
    fontWeight: '600',
  },
  authSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  authSwitchText: {
    color: Colors.muted,
  },
  authLink: {
    color: Colors.brand,
    fontWeight: '700',
  },
});
