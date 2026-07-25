import apiClient from './apiClient';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(credentials) {
  if (USE_MOCK) {
    await delay(800);
    if (
      credentials.email === 'admin@fre-design.com' &&
      credentials.password === 'admin123'
    ) {
      const token = `mock-jwt-${Date.now()}`;
      localStorage.setItem('fre_design_token', token);
      localStorage.setItem(
        'fre_design_user',
        JSON.stringify({ name: 'Administrator', email: credentials.email }),
      );
      return { data: { token, user: { name: 'Administrator', email: credentials.email } } };
    }
    throw { message: 'Invalid email or password.', status: 401 };
  }
  const { data } = await apiClient.post('/auth/login', credentials);
  if (data.token) {
    localStorage.setItem('fre_design_token', data.token);
    localStorage.setItem('fre_design_user', JSON.stringify(data.user));
  }
  return data;
}

export function logout() {
  localStorage.removeItem('fre_design_token');
  localStorage.removeItem('fre_design_user');
}

export function getStoredUser() {
  const raw = localStorage.getItem('fre_design_user');
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('fre_design_token'));
}
