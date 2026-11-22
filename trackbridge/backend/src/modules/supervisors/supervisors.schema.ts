import { z } from 'zod';
export const assignSchema = z.object({
  supervisorUserId: z.string(),
  type: z.enum(['advisor', 'internship']),
  force: z.boolean().optional(),
});
