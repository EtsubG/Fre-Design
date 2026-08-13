import apiClient from './apiClient';

/**
 * Admin login via Express/MongoDB backend (JWT auth).
 */
export async function login(credentials) {
  try {
    const { data } = await apiClient.post('/auth/login', {
      username: credentials.email, // login form uses "email" field for the username
      password: credentials.password,
    });

    const user = { name: data.username || 'Administrator', email: credentials.email };
    localStorage.setItem('fere_design_token', data.token);
    localStorage.setItem('fere_design_user', JSON.stringify(user));
    return { data: { token: data.token, user } };
  } catch (err) {
    // err.status 401 = wrong credentials, 0 = network/server down
    if (err.status === 401) {
      throw { message: 'Invalid username or password.', status: 401 };
    }
    if (!err.status || err.status === 0) {
      throw { message: 'Cannot reach the server. Make sure the backend is running.', status: 0 };
    }
    throw { message: err.message || 'Login failed. Please try again.', status: err.status };
  }
}

export async function logout() {
  localStorage.removeItem('fere_design_token');
  localStorage.removeItem('fere_design_user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('fere_design_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('fere_design_token'));
}

// No-op — kept so callers in App.jsx don't break
export function initAuthListener() {}
