import React, { useState } from 'react';
import { AppInput } from '../../atoms';
import { AuthScaffold } from '../../molecules';
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

  const handleRegister = async () => {
    setBusy(true);
    try {
      await register(name.trim() || 'María López', email.trim() || 'maria@bodega.pe');
      navigate('INICIO');
    } catch {
      // Handled
    } finally {
      setBusy(false);
    }
  };

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
