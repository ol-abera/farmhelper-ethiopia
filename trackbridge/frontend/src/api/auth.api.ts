import { api, setToken } from './client';

export const authApi = {
  login: async (email: string, password: string) => {
    const data = await api<{ accessToken: string; user: unknown }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.accessToken);
    return data;
  },
  register: (body: unknown) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: async () => {
    await api('/auth/logout', { method: 'POST' });
    setToken(null);
  },
  me: () => api('/auth/me'),
  forgot: (email: string) => api('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  reset: (token: string, password: string) =>
    api('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};
