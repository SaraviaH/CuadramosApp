import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { CuentaUsuario, GUEST_USER_ID } from '../../types';
import { authService, RegisterResult } from '../../services/auth/authService';
import { defaultGuestUser } from '../../storage/repositories/userSessionRepository';
import { supabase, isSupabaseConfigured } from '../../services/supabase/supabaseClient';

interface AuthContextValue {
  user: CuentaUsuario;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string, businessName?: string) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  updateProfile: (name: string, avatarUri?: string, businessName?: string) => Promise<void>;
  importGuestData: () => Promise<number>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CuentaUsuario>(defaultGuestUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Cargar usuario inicial (SQLite + Supabase session)
    authService.getCurrentUser().then(loaded => {
      if (isMounted) {
        setUser(loaded);
        setIsLoading(false);
      }
    });

    // 2. Escuchar cambios de sesión de Supabase si está configurado
    let unsubscribe = () => {};
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if (event === 'SIGNED_IN' && session?.user) {
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(defaultGuestUser);
        }
      });
      if (data?.subscription) {
        unsubscribe = () => data.subscription.unsubscribe();
      }
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password = '') => {
    const updated = await authService.login(email, password);
    setUser(updated);
  };

  const register = async (name: string, email: string, password = '', businessName?: string) => {
    const result = await authService.register(name, email, password, businessName);
    if (!result.requiresEmailConfirmation) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    const updated = await authService.logout();
    setUser(updated);
  };

  const updateProfile = async (name: string, avatarUri?: string, businessName?: string) => {
    const updated = await authService.updateProfile(name, avatarUri, businessName);
    setUser(updated);
  };

  const importGuestData = useCallback(async (): Promise<number> => {
    if (!user.isLoggedIn || user.id === GUEST_USER_ID) return 0;
    const { total } = await authService.importGuestDataToUser(user.id);
    return total;
  }, [user]);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, updateProfile, importGuestData }),
    [user, isLoading, importGuestData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
