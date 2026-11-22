import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(3),
  studentId: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  department: z.string().min(2),
  phone: z.string().optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotSchema = z.object({ email: z.string().email() });
export const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});
export const refreshSchema = z.object({}).optional();
