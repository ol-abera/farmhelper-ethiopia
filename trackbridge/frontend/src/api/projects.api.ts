import { api } from './client';
export const projectsApi = {
  list: () => api('/projects'),
  mine: () => api('/projects/mine'),
  create: (body: unknown) => api('/projects', { method: 'POST', body: JSON.stringify(body) }),
  submitTitle: (id: string) => api(`/projects/${id}/title`, { method: 'POST' }),
  similarity: (id: string, title: string) => api(`/projects/${id}/similarity?title=${encodeURIComponent(title)}`),
  reviewTitle: (id: string, body: unknown) => api(`/projects/${id}/review-title`, { method: 'POST', body: JSON.stringify(body) }),
  addTask: (id: string, body: unknown) => api(`/projects/${id}/tasks`, { method: 'POST', body: JSON.stringify(body) }),
  patchTask: (taskId: string, status: string) =>
    api(`/projects/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addMilestone: (id: string, body: unknown) => api(`/projects/${id}/milestones`, { method: 'POST', body: JSON.stringify(body) }),
};
