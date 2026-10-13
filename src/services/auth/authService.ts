import { CuentaUsuario, GUEST_USER_ID } from '../../types';
import {
  defaultGuestUser,
  loadUserSession,
  saveUserSession,
  clearUserSession,
  jornadaSqliteRepository,
  movimientoSqliteRepository,
  eventoPagoSqliteRepository,
  migrateGuestBoxHistoryToUser,
} from '../../storage';
import { supabase, isSupabaseConfigured } from '../supabase/supabaseClient';

export interface RegisterResult {
  user: CuentaUsuario;
  requiresEmailConfirmation: boolean;
}

export const authService = {
  /**
   * Obtiene el usuario actual. Verifica sesión en Supabase y sincroniza con SQLite.
   */
  async getCurrentUser(): Promise<CuentaUsuario> {
    const local = await loadUserSession();

    if (!isSupabaseConfigured()) {
      return local;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        if (local.isLoggedIn && local.id !== GUEST_USER_ID) {
          // Sesión expirada o cerrada en el servidor
          await clearUserSession();
          return defaultGuestUser;
        }
        return local;
      }

      const authUser = data.session.user;
      // Consultar perfil en Supabase
      const { data: profile } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const user: CuentaUsuario = {
        id: authUser.id,
        isLoggedIn: true,
        name: profile?.name || authUser.user_metadata?.name || 'Comerciante',
        businessName: profile?.business_name || authUser.user_metadata?.business_name || 'Mi negocio',
        email: authUser.email || local.email,
        avatarUri: profile?.avatar_uri || local.avatarUri || '',
      };

      await saveUserSession(user);
      return user;
    } catch {
      // Si no hay red, confiar en la sesión local de SQLite
      return local;
    }
  },

  /**
   * Inicia sesión con correo electrónico y contraseña en Supabase Auth
   */
  async login(email: string, password = ''): Promise<CuentaUsuario> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error('Ingresa tu correo electrónico.');

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase no está configurado. Verifica la conexión y credenciales.');
    }

    if (!password) throw new Error('Ingresa tu contraseña.');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Correo o contraseña incorrectos.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Debes confirmar tu correo electrónico antes de ingresar. Revisa tu bandeja de entrada.');
      }
      throw new Error(error.message || 'Error al iniciar sesión.');
    }

    if (!data.user) {
      throw new Error('No se pudo recuperar la información del usuario.');
    }

    // Obtener o crear perfil en Supabase
    let profileName = data.user.user_metadata?.name || 'Comerciante';
    let profileBusiness = data.user.user_metadata?.business_name || 'Mi negocio';
    let profileAvatar = '';

    const { data: profile } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      profileName = profile.name || profileName;
      profileBusiness = profile.business_name || profileBusiness;
      profileAvatar = profile.avatar_uri || '';
    } else {
      // Crear perfil inicial
      await supabase.from('perfiles').upsert({
        id: data.user.id,
        name: profileName,
        business_name: profileBusiness,
        email: cleanEmail,
      });
    }

    const user: CuentaUsuario = {
      id: data.user.id,
      isLoggedIn: true,
      name: profileName,
      businessName: profileBusiness,
      email: cleanEmail,
      avatarUri: profileAvatar,
    };

    await saveUserSession(user);
    return user;
  },

  /**
   * Registra una nueva cuenta con correo y contraseña en Supabase Auth
   */
  async register(
    name: string,
    email: string,
    password = '',
    businessName = 'Mi negocio',
  ): Promise<RegisterResult> {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) throw new Error('Ingresa tu nombre.');
    if (!cleanEmail) throw new Error('Ingresa tu correo electrónico.');
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }

    if (!isSupabaseConfigured()) {
      throw new Error('Supabase no está configurado. Verifica la conexión y credenciales.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
          business_name: businessName.trim() || 'Mi negocio',
        },
      },
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('Este correo ya se encuentra registrado. Intenta iniciar sesión.');
      }
      throw new Error(error.message || 'Error al registrar la cuenta.');
    }

    if (!data.user) {
      throw new Error('No se pudo crear la cuenta.');
    }

    // Si Supabase no devolvió sesión, requiere confirmación por correo
    if (!data.session) {
      return {
        user: defaultGuestUser,
        requiresEmailConfirmation: true,
      };
    }

    // Si la confirmación está desactivada en Supabase o es automática
    await supabase.from('perfiles').upsert({
      id: data.user.id,
      name: cleanName,
      business_name: businessName.trim() || 'Mi negocio',
      email: cleanEmail,
    });

    const user: CuentaUsuario = {
      id: data.user.id,
      isLoggedIn: true,
      name: cleanName,
      businessName: businessName.trim() || 'Mi negocio',
      email: cleanEmail,
    };

    await saveUserSession(user);
    return { user, requiresEmailConfirmation: false };
  },

  /**
   * Cierra la sesión en Supabase y retorna a modo invitado
   */
  async logout(): Promise<CuentaUsuario> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut().catch(() => {});
    }
    await clearUserSession();
    return defaultGuestUser;
  },

  /**
   * Actualiza el perfil en local y en Supabase
   */
  async updateProfile(name: string, avatarUri?: string, businessName?: string): Promise<CuentaUsuario> {
    const current = await loadUserSession();
    const cleanName = name.trim();
    const cleanBusiness = businessName !== undefined ? businessName.trim() : current.businessName;
    const cleanAvatar = avatarUri !== undefined ? avatarUri : current.avatarUri;

    const user: CuentaUsuario = {
      ...current,
      name: cleanName || current.name,
      businessName: cleanBusiness,
      avatarUri: cleanAvatar,
    };

    await saveUserSession(user);

    if (user.isLoggedIn && user.id !== GUEST_USER_ID && isSupabaseConfigured()) {
      try {
        await supabase
          .from('perfiles')
          .update({
            name: user.name,
            business_name: user.businessName,
            avatar_uri: user.avatarUri || null,
          })
          .eq('id', user.id);
      } catch {
        // Silently continue if offline
      }
    }

    return user;
  },

  /**
   * Importa registros generados en modo invitado hacia la cuenta del usuario autenticado
   */
  async importGuestDataToUser(targetUserId: string): Promise<{ total: number }> {
    if (!targetUserId || targetUserId === GUEST_USER_ID) {
      throw new Error('El usuario destino no es válido.');
    }

    const [jornadasCount, movsCount, eventosCount, cajasCount] = await Promise.all([
      jornadaSqliteRepository.migrateGuestJornadasToUser(targetUserId),
      movimientoSqliteRepository.migrateGuestMovimientosToUser(targetUserId),
      eventoPagoSqliteRepository.migrateGuestEventosToUser(targetUserId),
      migrateGuestBoxHistoryToUser(targetUserId),
    ]);

    const total = jornadasCount + movsCount + eventosCount + cajasCount;
    return { total };
  },
};
