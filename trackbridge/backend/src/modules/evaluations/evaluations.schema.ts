import { z } from 'zod';
export const evalSchema = z.object({
  studentId: z.string(),
  component: z.enum(['advisor', 'host', 'project']),
  scores: z.record(z.number()),
  comments: z.string().optional(),
  submit: z.boolean().optional(),
});
