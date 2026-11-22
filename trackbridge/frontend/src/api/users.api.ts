import { api } from './client';
export const usersApi = {
  list: (q = '') => api(`/users${q}`),
  profile: (body: unknown) => api('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  approve: (id: string) => api(`/users/${id}/approve`, { method: 'POST', body: '{}' }),
};
