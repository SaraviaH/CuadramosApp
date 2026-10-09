import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CuentaUsuario } from '../../types';
import { authService } from '../../services/auth/authService';
import { defaultGuestUser } from '../../storage/repositories/userSessionRepository';

interface AuthContextValue {
  user: CuentaUsuario;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CuentaUsuario>(defaultGuestUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    authService.getCurrentUser().then(loaded => {
      if (isMounted) {
        setUser(loaded);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const login = async (email: string) => {
    const updated = await authService.login(email);
    setUser(updated);
  };

  const register = async (name: string, email: string) => {
    const updated = await authService.register(name, email);
    setUser(updated);
  };

  const logout = async () => {
    const updated = await authService.logout();
    setUser(updated);
  };

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading],
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
