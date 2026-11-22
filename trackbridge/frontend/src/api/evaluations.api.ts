import { api } from './client';
export const evaluationsApi = {
  list: () => api('/evaluations'),
  rubrics: () => api('/evaluations/rubrics'),
  save: (body: unknown) => api('/evaluations', { method: 'POST', body: JSON.stringify(body) }),
};
