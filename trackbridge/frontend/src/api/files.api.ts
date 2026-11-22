import { download } from './client';
export const filesApi = { get: (id: string) => download(`/files/${id}`) };
