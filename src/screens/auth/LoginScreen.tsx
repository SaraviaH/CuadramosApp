import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';
import { AppInput, AppText } from '../../atoms';
import { AlertCard, AuthScaffold } from '../../molecules';
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
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMessage('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!password) {
      setErrorMessage('Por favor ingresa tu contraseña.');
      return;
    }

    setBusy(true);
    setErrorMessage('');
    try {
      await login(email.trim(), password);
      navigate('INICIO');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al iniciar sesión.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthScaffold
      title="Iniciar sesión"
      subtitle="Accede de forma opcional para sincronizar tus datos y respaldar tu caja."
      onBack={() => navigate('MAS')}
      primaryLabel="Iniciar sesión"
      onPrimary={handleLogin}
      primaryLoading={busy}
      skipLabel="Continuar sin cuenta"
      onSkip={() => navigate('INICIO')}
      switchPrompt="¿No tienes una cuenta? "
      switchLinkLabel="Regístrate"
      onSwitch={() => navigate('REGISTRO')}
    >
      {errorMessage ? (
        <AlertCard tone="error" icon="alert" title="No se pudo iniciar sesión">
          {errorMessage}
        </AlertCard>
      ) : null}

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

      <Pressable style={styles.forgotButton}>
        <AppText variant="caption" style={styles.forgotText}>¿Olvidaste tu contraseña?</AppText>
      </Pressable>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.brandDark,
  },
});
