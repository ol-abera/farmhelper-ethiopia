import { z } from 'zod';

export const orgSchema = z.object({
  name: z.string().min(2),
  sector: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(3),
  description: z.string().optional(),
});

export const positionSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  requiredSkills: z.string().optional(),
  quota: z.number().int().min(1).default(1),
  notes: z.string().optional(),
  isOpen: z.boolean().optional(),
  openFrom: z.string().optional(),
  openTo: z.string().optional(),
});
