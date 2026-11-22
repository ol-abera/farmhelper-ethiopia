import { z } from 'zod';
export const projectSchema = z.object({
  title: z.string().min(5),
  problem: z.string().min(10),
  objectives: z.string().min(10),
  tools: z.string().min(2),
  mode: z.enum(['individual', 'team']).optional(),
});
export const taskSchema = z.object({
  title: z.string().min(2),
  assigneeId: z.string().optional(),
  dueAt: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
});
export const milestoneSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  dueAt: z.string(),
});
export const reviewSchema = z.object({
  action: z.enum(['approve', 'return', 'accept']),
  comment: z.string().optional(),
});
