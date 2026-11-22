import { z } from 'zod';

export const siteSchema = z.object({
  name: z.string().min(2),
  woreda: z.string().min(2),
  kebele: z.string().optional(),
  community: z.string().min(2),
  address: z.string().min(2),
  contactName: z.string().min(2),
  contactPhone: z.string().min(3),
  description: z.string().optional(),
});

export const activitySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['planned', 'active', 'completed', 'cancelled']).optional(),
});

export const groupSchema = z.object({
  activityId: z.string(),
  name: z.string().min(2),
  advisorId: z.string().optional(),
});

export const submissionSchema = z.object({
  groupId: z.string(),
  title: z.string().min(3),
  body: z.string().min(20),
  docKind: z.string().min(2),
});

export const reviewSchema = z.object({
  action: z.enum(['approve', 'return', 'comment']),
  body: z.string().min(2),
});
