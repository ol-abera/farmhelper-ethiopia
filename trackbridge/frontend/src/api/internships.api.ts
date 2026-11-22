import { api, download } from './client';
export const internshipsApi = {
  opportunities: () => api('/opportunities'),
  organizations: () => api('/organizations'),
  createOrg: (body: unknown) => api('/organizations', { method: 'POST', body: JSON.stringify(body) }),
  createOpportunity: (orgId: string, body: unknown) =>
    api(`/organizations/${orgId}/positions`, { method: 'POST', body: JSON.stringify(body) }),
  apply: (body: unknown) => api('/applications', { method: 'POST', body: JSON.stringify(body) }),
  propose: (body: unknown) => api('/applications/propose', { method: 'POST', body: JSON.stringify(body) }),
  applications: () => api('/applications'),
  decide: (id: string, body: unknown) => api(`/applications/${id}/decision`, { method: 'POST', body: JSON.stringify(body) }),
  placements: () => api('/placements'),
  placement: (id: string) => api(`/placements/${id}`),
  letter: (id: string) => download(`/placements/${id}/letter`),
  logbooks: (id: string) => api(`/placements/${id}/logbooks`),
  saveLogbook: (weekId: string, body: unknown) => api(`/logbooks/${weekId}`, { method: 'POST', body: JSON.stringify(body) }),
  submitLogbook: (weekId: string) => api(`/logbooks/${weekId}/submit`, { method: 'POST' }),
  reviewLogbook: (entryId: string, body: unknown) =>
    api(`/logbooks/entries/${entryId}/review`, { method: 'POST', body: JSON.stringify(body) }),
  attendance: (id: string) => api(`/placements/${id}/attendance`),
  recordAttendance: (id: string, body: unknown) =>
    api(`/placements/${id}/attendance`, { method: 'POST', body: JSON.stringify(body) }),
  assignSupervisor: (id: string, body: unknown) =>
    api(`/placements/${id}/supervisors`, { method: 'POST', body: JSON.stringify(body) }),
  workload: () => api('/supervisors/workload'),
  unassigned: () => api('/supervisors/unassigned'),
};
