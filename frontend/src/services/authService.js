import supabase from './supabaseClient';
import apiClient from './apiClient';

/**
 * Admin login — tries the Express/MongoDB backend first (JWT auth).
 * Falls back to Supabase auth if the backend is unavailable.
 * Falls back to demo credentials when neither is configured.
 */
export async function login(credentials) {
  // --- 1. Try the Express backend (username = email field value) ---
  try {
    const { data } = await apiClient.post('/auth/login', {
      username: credentials.email,   // Admin UI sends email field; backend uses username
      password: credentials.password,
    });

    const user = { name: data.username || 'Administrator', email: credentials.email };
    localStorage.setItem('fere_design_token', data.token);
    localStorage.setItem('fere_design_user', JSON.stringify(user));
    return { data: { token: data.token, user } };
  } catch (backendErr) {
    // Backend unavailable or wrong credentials — fall through to Supabase
    if (backendErr.status === 401) {
      // Definite wrong credentials — don't try Supabase, surface the error
      throw { message: 'Invalid username or password.', status: 401 };
    }
  }

  // --- 2. Supabase fallback (when backend is offline) ---
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) throw { message: error.message, status: 401 };

    const user = {
      name: data.user?.user_metadata?.full_name || 'Administrator',
      email: data.user?.email,
    };
    localStorage.setItem('fere_design_token', data.session?.access_token);
    localStorage.setItem('fere_design_user', JSON.stringify(user));
    return { data: { token: data.session?.access_token, user } };
  }

  // --- 3. Demo credentials (no backend, no Supabase) ---
  if (
    credentials.email === 'admin@fere-design.com' &&
    credentials.password === 'admin123'
  ) {
    const user = { name: 'Administrator', email: credentials.email };
    localStorage.setItem('fere_design_token', 'demo-token');
    localStorage.setItem('fere_design_user', JSON.stringify(user));
    return { data: { token: 'demo-token', user } };
  }

  throw { message: 'Invalid credentials.', status: 401 };
}

export async function logout() {
  if (supabase) await supabase.auth.signOut();
  localStorage.removeItem('fere_design_user');
  localStorage.removeItem('fere_design_token');
}

export function getStoredUser() {
  const raw = localStorage.getItem('fere_design_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('fere_design_token'));
}

// Keep stored user in sync with Supabase session (only when Supabase is configured)
export function initAuthListener() {
  if (!supabase) return;
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      localStorage.setItem('fere_design_token', session.access_token);
      const user = {
        name: session.user?.user_metadata?.full_name || 'Administrator',
        email: session.user?.email,
      };
      localStorage.setItem('fere_design_user', JSON.stringify(user));
    }
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem('fere_design_token');
      localStorage.removeItem('fere_design_user');
    }
  });
}
