import { z } from 'zod';
export const messageSchema = z.object({
  threadId: z.string().optional(),
  placementId: z.string().optional(),
  projectId: z.string().optional(),
  groupSubject: z.string().optional(),
  body: z.string().min(1),
});
export const announceSchema = z.object({
  audience: z.string(),
  title: z.string().min(2),
  body: z.string().min(2),
});
