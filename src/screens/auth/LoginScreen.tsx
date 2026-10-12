import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Typography } from '../../theme';
import { AppInput, AppText } from '../../atoms';
import { AuthScaffold, AlertCard } from '../../molecules';
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

      {errorMessage ? (
        <View style={{ marginBottom: Spacing.md }}>
          <AlertCard tone="error" icon="alert" title="No se pudo iniciar sesión">
            {errorMessage}
          </AlertCard>
        </View>
      ) : null}

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
