import { z } from 'zod';
export const matchSchema = z.object({ studentId: z.string().optional(), opportunityId: z.string().optional() });
export const summarizeSchema = z.object({ text: z.string().optional(), sourceType: z.string().optional(), sourceId: z.string().optional() });
export const titleSchema = z.object({ title: z.string().min(3), projectId: z.string().optional() });
export const faqSchema = z.object({ question: z.string().min(2) });
