import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let envUrl = '';
let envKey = '';

try {
  const env = require('@env');
  envUrl = env?.SUPABASE_URL || '';
  envKey = env?.SUPABASE_PUBLISHABLE_KEY || '';
} catch {
  // @env no disponible en jest o node puro
}

const normalizeUrl = (raw: string): string => {
  let clean = (raw || '').trim();
  clean = clean.replace(/\/rest\/v1\/?$/, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
};

const FALLBACK_URL = 'https://gxqwqcmcvmrrluufrlou.supabase.co';
const FALLBACK_KEY = 'sb_publishable_h5ZtBX1yjLfXRK7lMjnywA_P1Mp6Spy';

export const SUPABASE_CONFIG = {
  url: normalizeUrl(envUrl || (typeof process !== 'undefined' && process.env?.SUPABASE_URL) || FALLBACK_URL),
  publishableKey: (envKey || (typeof process !== 'undefined' && process.env?.SUPABASE_PUBLISHABLE_KEY) || FALLBACK_KEY).trim(),
};

let clientInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_CONFIG.url &&
    SUPABASE_CONFIG.url.startsWith('https://') &&
    SUPABASE_CONFIG.publishableKey &&
    !SUPABASE_CONFIG.url.includes('placeholder')
  );
};

export const getSupabaseClient = (): SupabaseClient => {
  if (clientInstance) return clientInstance;

  const url = isSupabaseConfigured() ? SUPABASE_CONFIG.url : 'https://placeholder-cuadramos.supabase.co';
  const key = isSupabaseConfigured() ? SUPABASE_CONFIG.publishableKey : 'sb_publishable_placeholder';

  clientInstance = createClient(url, key, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return clientInstance;
};

export const supabase = getSupabaseClient();
