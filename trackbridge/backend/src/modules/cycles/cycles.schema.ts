import { z } from 'zod';

export const cycleSchema = z.object({
  title: z.string().min(3),
  startDate: z.string(),
  endDate: z.string(),
  internshipStart: z.string(),
  internshipEnd: z.string(),
  logbookDueWeekday: z.number().int().min(0).max(6).optional(),
  timezone: z.string().optional(),
  evaluationOpenAt: z.string().nullable().optional(),
  evaluationCloseAt: z.string().nullable().optional(),
  config: z
    .object({
      dualApproval: z.boolean().optional(),
      maxTeamSize: z.number().optional(),
      maxApplications: z.number().optional(),
      workloadThreshold: z.number().optional(),
      atRiskLateWeeks: z.number().optional(),
      orgWideHostRole: z.boolean().optional(),
      universityName: z.string().optional(),
      weights: z
        .object({
          advisor: z.number(),
          host: z.number(),
          project: z.number(),
        })
        .optional(),
    })
    .optional(),
});
