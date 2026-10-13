import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Spacing } from '../../theme';
import { AppButton, AppInput } from '../../atoms';
import { AlertCard, AuthScaffold, BackButton, ScreenContainer, ScreenTitle } from '../../molecules';
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

  if (emailConfirmationRequired) {
    return (
      <ScreenContainer>
        <BackButton onPress={() => navigate('MAS')} label="Volver a Más" />
        <ScreenTitle
          title="Crear cuenta"
          subtitle="Crea tu cuenta de forma opcional para respaldar tu negocio."
        />

        <AlertCard tone="success" icon="mail" title="¡Confirma tu correo electrónico!">
          {`Hemos enviado un enlace de confirmación a ${email}. Abre tu correo y haz clic en el enlace para activar tu cuenta antes de iniciar sesión.`}
        </AlertCard>

        <AppButton
          label="Ir a Iniciar Sesión"
          onPress={() => navigate('LOGIN')}
          style={styles.loginButton}
        />
      </ScreenContainer>
    );
  }

  return (
    <AuthScaffold
      title="Crear cuenta"
      subtitle="Crea tu cuenta de forma opcional para respaldar tu negocio."
      onBack={() => navigate('MAS')}
      primaryLabel="Crear cuenta"
      onPrimary={handleRegister}
      primaryLoading={busy}
      skipLabel="Continuar sin registrarme"
      onSkip={() => navigate('INICIO')}
      switchPrompt="¿Ya tienes una cuenta? "
      switchLinkLabel="Inicia sesión"
      onSwitch={() => navigate('LOGIN')}
    >
      {errorMessage ? (
        <AlertCard tone="error" icon="alert" title="No se pudo crear la cuenta">
          {errorMessage}
        </AlertCard>
      ) : null}

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
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    marginTop: Spacing.md,
  },
});
