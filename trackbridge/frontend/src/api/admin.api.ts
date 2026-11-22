import { api } from './client';
export const adminApi = {
  users: (q = '') => api(`/admin/users${q}`),
  createUser: (body: unknown) => api('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
  setRole: (id: string, role: string) => api(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  faq: () => api('/admin/faq'),
  createFaq: (body: unknown) => api('/admin/faq', { method: 'POST', body: JSON.stringify(body) }),
  publishFaq: (id: string) => api(`/admin/faq/${id}/publish`, { method: 'POST', body: JSON.stringify({ approved: true }) }),
  audit: () => api('/admin/audit'),
  config: () => api('/admin/config'),
};
