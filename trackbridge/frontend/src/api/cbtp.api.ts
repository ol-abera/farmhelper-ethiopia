import { api } from './client';
export const cbtpApi = {
  sites: () => api('/cbtp/sites'),
  site: (id: string) => api(`/cbtp/sites/${id}`),
  createSite: (body: unknown) => api('/cbtp/sites', { method: 'POST', body: JSON.stringify(body) }),
  addActivity: (id: string, body: unknown) =>
    api(`/cbtp/sites/${id}/activities`, { method: 'POST', body: JSON.stringify(body) }),
  groups: () => api('/cbtp/groups'),
  createGroup: (body: unknown) => api('/cbtp/groups', { method: 'POST', body: JSON.stringify(body) }),
  addMember: (id: string, studentId: string) =>
    api(`/cbtp/groups/${id}/members`, { method: 'POST', body: JSON.stringify({ studentId }) }),
  submissions: (groupId?: string) => api(`/cbtp/submissions${groupId ? `?groupId=${groupId}` : ''}`),
  createSubmission: (body: unknown) => api('/cbtp/submissions', { method: 'POST', body: JSON.stringify(body) }),
  submit: (id: string) => api(`/cbtp/submissions/${id}/submit`, { method: 'POST' }),
  review: (id: string, body: unknown) => api(`/cbtp/submissions/${id}/review`, { method: 'POST', body: JSON.stringify(body) }),
};
