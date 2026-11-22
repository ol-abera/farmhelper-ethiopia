import { api, download } from './client';
export const reportsApi = {
  cbtp: () => api('/reports/cbtp'),
  internship: () => api('/reports/internship'),
  projects: () => api('/reports/projects'),
  delayed: () => api('/reports/delayed'),
  pdf: (kind: string) => download(`/reports/${kind}/pdf`),
  archive: (q: string) => api(`/archive?q=${encodeURIComponent(q)}`),
};
