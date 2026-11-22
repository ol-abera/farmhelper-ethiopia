import { z } from 'zod';
import { ROLES } from '@trackbridge/shared';
export const roleSchema = z.object({ role: z.enum(ROLES) });
export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  tags: z.string().optional(),
  audience: z.string().optional(),
});
