import AsyncStorage from '@react-native-async-storage/async-storage';
import { CuentaUsuario, GUEST_USER_ID } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';

const ACTIVE_USER_ID_KEY = '@cuadramos/active_user_id-v2';
const USER_SESSION_KEY_LEGACY = '@cuadramos/user_session-v1';
const WELCOME_SEEN_KEY = '@cuadramos/welcome_seen-v1';

export const hasSeenWelcome = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(WELCOME_SEEN_KEY);
    return val === 'true';
  } catch {
    return false;
  }
};

export const setSeenWelcome = async (seen = true): Promise<void> => {
  try {
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, seen ? 'true' : 'false');
  } catch {}
};

let cachedActiveUserId: string = GUEST_USER_ID;

export const defaultGuestUser: CuentaUsuario = {
  id: GUEST_USER_ID,
  isLoggedIn: false,
  name: '',
  businessName: 'Mi negocio',
  email: '',
  avatarUri: '',
};

interface UsuarioSesionRow {
  id: string;
  is_logged_in: number;
  name: string;
  business_name: string;
  email: string | null;
  avatar_uri: string | null;
  updated_at?: string | null;
}

export const getCachedActiveUserId = (): string => cachedActiveUserId;

export const setActiveUserId = async (userId: string): Promise<void> => {
  cachedActiveUserId = userId || GUEST_USER_ID;
  await AsyncStorage.setItem(ACTIVE_USER_ID_KEY, cachedActiveUserId).catch(() => {});
};

export const loadActiveUserId = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem(ACTIVE_USER_ID_KEY);
    if (saved) {
      cachedActiveUserId = saved;
      return saved;
    }
  } catch {
    // fallback
  }
  cachedActiveUserId = GUEST_USER_ID;
  return GUEST_USER_ID;
};

export const loadUserSession = async (tx?: IDatabase): Promise<CuentaUsuario> => {
  try {
    const activeId = await loadActiveUserId();
    const db = tx ?? (await getDatabase());

    if (activeId === GUEST_USER_ID) {
      const res = await db.execute<UsuarioSesionRow>(
        `SELECT id, is_logged_in, name, business_name, email, avatar_uri, updated_at
         FROM usuario_sesion
         WHERE id = ?;`,
        [GUEST_USER_ID],
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: GUEST_USER_ID,
          isLoggedIn: false,
          name: row.name || '',
          businessName: row.business_name || defaultGuestUser.businessName,
          email: row.email || '',
          avatarUri: row.avatar_uri || '',
          updatedAt: row.updated_at || undefined,
        };
      }
      return defaultGuestUser;
    }

    // 1. Buscar la sesión del usuario activo (si es usuario autenticado)
    const res = await db.execute<UsuarioSesionRow>(
      `SELECT id, is_logged_in, name, business_name, email, avatar_uri, updated_at
       FROM usuario_sesion
       WHERE id = ?;`,
      [activeId],
    );

    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        id: row.id,
        isLoggedIn: Boolean(row.is_logged_in),
        name: row.name || '',
        businessName: row.business_name || defaultGuestUser.businessName,
        email: row.email || '',
        avatarUri: row.avatar_uri || '',
        updatedAt: row.updated_at || undefined,
      };
    }

    // 2. Fallback de migración: Si hay un registro legacy con id = 'current_user'
    const legacyRes = await db.execute<UsuarioSesionRow>(
      `SELECT id, is_logged_in, name, business_name, email, avatar_uri
       FROM usuario_sesion
       WHERE id = 'current_user';`,
    );

    if (legacyRes.rows.length > 0) {
      const row = legacyRes.rows[0];
      const migratedUser: CuentaUsuario = {
        id: GUEST_USER_ID,
        isLoggedIn: Boolean(row.is_logged_in),
        name: row.name || '',
        businessName: row.business_name || defaultGuestUser.businessName,
        email: row.email || '',
        avatarUri: row.avatar_uri || '',
      };
      await saveUserSession(migratedUser, tx).catch(() => {});
      return migratedUser;
    }

    // 3. Fallback retrocompatible con AsyncStorage legacy
    const raw = await AsyncStorage.getItem(USER_SESSION_KEY_LEGACY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CuentaUsuario>;
      const user: CuentaUsuario = {
        id: parsed.id || GUEST_USER_ID,
        isLoggedIn: Boolean(parsed.isLoggedIn),
        name: parsed.name || '',
        businessName: parsed.businessName || defaultGuestUser.businessName,
        email: parsed.email || '',
        avatarUri: parsed.avatarUri || '',
      };
      await saveUserSession(user, tx).catch(() => {});
      return user;
    }

    return defaultGuestUser;
  } catch {
    return defaultGuestUser;
  }
};

export const saveUserSession = async (user: CuentaUsuario, tx?: IDatabase): Promise<void> => {
  const db = tx ?? (await getDatabase());
  const userId = user.id || (user.isLoggedIn ? (user.email ? 'usr_' + user.email : 'usr_' + Date.now()) : GUEST_USER_ID);
  const now = new Date().toISOString();

  await db.execute(
    `INSERT OR REPLACE INTO usuario_sesion (id, is_logged_in, name, business_name, email, avatar_uri, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      userId,
      user.isLoggedIn ? 1 : 0,
      user.name,
      user.businessName,
      user.email || null,
      user.avatarUri || null,
      now,
    ],
  );

  await setActiveUserId(userId);
  await AsyncStorage.setItem(`@cuadramos/user_session-v2:${userId}`, JSON.stringify(user)).catch(() => {});
  await AsyncStorage.setItem(USER_SESSION_KEY_LEGACY, JSON.stringify(user)).catch(() => {});
};

export const clearUserSession = async (tx?: IDatabase): Promise<void> => {
  const currentId = cachedActiveUserId;
  const db = tx ?? (await getDatabase());

  if (currentId && currentId !== GUEST_USER_ID) {
    // Si era un usuario autenticado, marcamos su sesión como cerrada sin borrar su información
    await db.execute(
      `UPDATE usuario_sesion SET is_logged_in = 0 WHERE id = ?;`,
      [currentId],
    );
  } else {
    await db.execute(`DELETE FROM usuario_sesion WHERE id = ?;`, [GUEST_USER_ID]);
  }

  await setActiveUserId(GUEST_USER_ID);
  await AsyncStorage.removeItem(USER_SESSION_KEY_LEGACY).catch(() => {});
};

export const getUserById = async (id: string, tx?: IDatabase): Promise<CuentaUsuario | null> => {
  const db = tx ?? (await getDatabase());
  const res = await db.execute<UsuarioSesionRow>(
    `SELECT id, is_logged_in, name, business_name, email, avatar_uri, updated_at
     FROM usuario_sesion
     WHERE id = ?;`,
    [id],
  );

  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    isLoggedIn: Boolean(row.is_logged_in),
    name: row.name || '',
    businessName: row.business_name || defaultGuestUser.businessName,
    email: row.email || '',
    avatarUri: row.avatar_uri || '',
    updatedAt: row.updated_at || undefined,
  };
};
