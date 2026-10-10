import AsyncStorage from '@react-native-async-storage/async-storage';
import { CuentaUsuario } from '../../types';
import { getDatabase, IDatabase } from '../database/databaseAdapter';

const USER_SESSION_KEY = '@cuadramos/user_session-v1';
const CURRENT_USER_ID = 'current_user';

export const defaultGuestUser: CuentaUsuario = {
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
}

export const loadUserSession = async (tx?: IDatabase): Promise<CuentaUsuario> => {
  try {
    const db = tx ?? (await getDatabase());
    const res = await db.execute<UsuarioSesionRow>(
      `SELECT id, is_logged_in, name, business_name, email, avatar_uri
       FROM usuario_sesion
       WHERE id = ?;`,
      [CURRENT_USER_ID],
    );

    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        isLoggedIn: Boolean(row.is_logged_in),
        name: row.name || '',
        businessName: row.business_name || defaultGuestUser.businessName,
        email: row.email || '',
        avatarUri: row.avatar_uri || '',
      };
    }

    // Fallback retrocompatible con AsyncStorage si no está en SQLite
    const raw = await AsyncStorage.getItem(USER_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CuentaUsuario>;
      const user: CuentaUsuario = {
        isLoggedIn: Boolean(parsed.isLoggedIn),
        name: parsed.name || '',
        businessName: parsed.businessName || defaultGuestUser.businessName,
        email: parsed.email || '',
        avatarUri: parsed.avatarUri || '',
      };
      // Auto-guardar en SQLite para las próximas consultas
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
  await db.execute(
    `INSERT OR REPLACE INTO usuario_sesion (id, is_logged_in, name, business_name, email, avatar_uri)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [
      CURRENT_USER_ID,
      user.isLoggedIn ? 1 : 0,
      user.name,
      user.businessName,
      user.email || null,
      user.avatarUri || null,
    ],
  );
  await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(user)).catch(() => {});
};

export const clearUserSession = async (tx?: IDatabase): Promise<void> => {
  const db = tx ?? (await getDatabase());
  await db.execute(`DELETE FROM usuario_sesion WHERE id = ?;`, [CURRENT_USER_ID]);
  await AsyncStorage.removeItem(USER_SESSION_KEY).catch(() => {});
};
