import { api } from './client';
export const commsApi = {
  notifications: () => api('/notifications'),
  read: (id: string) => api(`/notifications/${id}/read`, { method: 'POST' }),
  threads: () => api('/messages'),
  thread: (id: string) => api(`/messages/${id}`),
  send: (body: unknown) => api('/messages', { method: 'POST', body: JSON.stringify(body) }),
};
