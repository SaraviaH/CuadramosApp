import { CuentaUsuario } from '../../types';
import {
  defaultGuestUser,
  loadUserSession,
  saveUserSession,
  clearUserSession,
} from '../../storage/repositories/userSessionRepository';

export const authService = {
  async getCurrentUser(): Promise<CuentaUsuario> {
    return loadUserSession();
  },

  async updateProfile(name: string, avatarUri?: string, businessName?: string): Promise<CuentaUsuario> {
    const current = await loadUserSession();
    const user: CuentaUsuario = {
      ...current,
      name: name.trim(),
      businessName: businessName !== undefined ? businessName.trim() : current.businessName,
      avatarUri: avatarUri !== undefined ? avatarUri : current.avatarUri,
    };
    await saveUserSession(user);
    return user;
  },

  async login(email: string): Promise<CuentaUsuario> {
    const user: CuentaUsuario = {
      isLoggedIn: true,
      name: 'María López',
      businessName: 'Mi bodega',
      email: email.trim() || 'maria@bodega.pe',
    };
    await saveUserSession(user);
    return user;
  },

  async register(name: string, email: string): Promise<CuentaUsuario> {
    const user: CuentaUsuario = {
      isLoggedIn: true,
      name: name.trim() || 'Nuevo Emprendedor',
      businessName: 'Mi negocio',
      email: email.trim() || 'usuario@ejemplo.com',
    };
    await saveUserSession(user);
    return user;
  },

  async logout(): Promise<CuentaUsuario> {
    await clearUserSession();
    return defaultGuestUser;
  },
};
