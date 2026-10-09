import AsyncStorage from '@react-native-async-storage/async-storage';
import { CuentaUsuario } from '../../types';

const USER_SESSION_KEY = '@cuadramos/user_session-v1';

export const defaultGuestUser: CuentaUsuario = {
  isLoggedIn: false,
  name: 'Emprendedor',
  businessName: 'Mi negocio',
  email: '',
};

export const loadUserSession = async (): Promise<CuentaUsuario> => {
  const raw = await AsyncStorage.getItem(USER_SESSION_KEY);
  if (!raw) return defaultGuestUser;
  try {
    const parsed = JSON.parse(raw) as Partial<CuentaUsuario>;
    return {
      isLoggedIn: Boolean(parsed.isLoggedIn),
      name: parsed.name || defaultGuestUser.name,
      businessName: parsed.businessName || defaultGuestUser.businessName,
      email: parsed.email || '',
    };
  } catch {
    return defaultGuestUser;
  }
};

export const saveUserSession = async (user: CuentaUsuario): Promise<void> => {
  await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
};

export const clearUserSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(USER_SESSION_KEY);
};
