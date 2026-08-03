import supabase from './supabaseClient';

export async function login(credentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw { message: error.message, status: 401 };
  }

  const user = {
    name: data.user?.user_metadata?.full_name || 'Administrator',
    email: data.user?.email,
  };

  return { data: { token: data.session?.access_token, user } };
}

export async function logout() {
  await supabase.auth.signOut();
  localStorage.removeItem('fere_design_user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('fere_design_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('fere_design_token'));
}

// Keep stored user in sync with Supabase session
export function initAuthListener() {
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
