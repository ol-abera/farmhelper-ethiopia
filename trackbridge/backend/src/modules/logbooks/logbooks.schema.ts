import { z } from 'zod';
export const entrySchema = z.object({
  activities: z.string().min(10),
  hours: z.number().min(0).max(80),
  skills: z.string().min(2),
  challenges: z.string().min(2),
});
export const reviewSchema = z.object({
  action: z.enum(['approve', 'return', 'comment']),
  body: z.string().min(2),
});
