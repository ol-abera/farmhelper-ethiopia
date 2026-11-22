import { z } from 'zod';

export const applySchema = z.object({
  positionId: z.string(),
  coverNote: z.string().min(10),
});

export const proposeSchema = z.object({
  proposedOrgName: z.string().min(2),
  proposedOrgAddress: z.string().min(2),
  proposedOrgContact: z.string().min(2),
  proposedRole: z.string().min(2),
  coverNote: z.string().min(10),
});

export const decisionSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
  overrideQuota: z.boolean().optional(),
});
