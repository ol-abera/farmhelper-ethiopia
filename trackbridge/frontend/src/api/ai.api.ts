import { api } from './client';
export const aiApi = {
  match: (qs = '') => api(`/ai/match${qs}`),
  recommend: () => api('/ai/recommend'),
  warnings: () => api('/ai/warnings'),
  summarize: (text: string) => api('/ai/summarize', { method: 'POST', body: JSON.stringify({ text }) }),
  titleSimilarity: (title: string, projectId?: string) =>
    api('/ai/title-similarity', { method: 'POST', body: JSON.stringify({ title, projectId }) }),
  faq: (question: string) => api('/ai/faq', { method: 'POST', body: JSON.stringify({ question }) }),
};
