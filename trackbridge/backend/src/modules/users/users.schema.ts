import { z } from 'zod';
import { ROLES } from '@trackbridge/shared';

export const createUserSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  role: z.enum(ROLES),
  password: z.string().min(8).optional(),
  studentId: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  organizationId: z.string().optional(),
  cycleId: z.string().optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
});

export const profileSchema = z.object({
  fullName: z.string().min(3).optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  emailRemindersEnabled: z.boolean().optional(),
  password: z.string().min(8).optional(),
});
