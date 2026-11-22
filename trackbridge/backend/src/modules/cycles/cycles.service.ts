import { prisma } from '../../db/prisma.js';
import { DEFAULT_CYCLE_CONFIG } from '../../config/constants.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { assertWeights } from '../evaluations/scoring.service.js';

export function cycleDto(c: {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  internshipStart: Date;
  internshipEnd: Date;
  logbookDueWeekday: number;
  timezone: string;
  evaluationOpenAt: Date | null;
  evaluationCloseAt: Date | null;
  evaluationsLocked: boolean;
  scoresPublished: boolean;
  isOpen: boolean;
  isArchived: boolean;
  config: unknown;
}) {
  return {
    ...c,
    startDate: c.startDate.toISOString(),
    endDate: c.endDate.toISOString(),
    internshipStart: c.internshipStart.toISOString(),
    internshipEnd: c.internshipEnd.toISOString(),
    evaluationOpenAt: c.evaluationOpenAt?.toISOString() ?? null,
    evaluationCloseAt: c.evaluationCloseAt?.toISOString() ?? null,
    config: { ...DEFAULT_CYCLE_CONFIG, ...(c.config as object) },
  };
}

export async function listCycles() {
  const items = await prisma.cycle.findMany({ orderBy: { startDate: 'desc' } });
  return { items: items.map(cycleDto) };
}

export async function currentCycle() {
  const c = await prisma.cycle.findFirst({ where: { isOpen: true } });
  return c ? cycleDto(c) : null;
}

export async function createCycle(actorId: string, body: Record<string, unknown>) {
  const config = { ...DEFAULT_CYCLE_CONFIG, ...(body.config as object) };
  if (config.weights) assertWeights(config.weights);
  await prisma.cycle.updateMany({ where: { isOpen: true }, data: { isOpen: false } });
  const c = await prisma.cycle.create({
    data: {
      title: String(body.title),
      startDate: new Date(String(body.startDate)),
      endDate: new Date(String(body.endDate)),
      internshipStart: new Date(String(body.internshipStart)),
      internshipEnd: new Date(String(body.internshipEnd)),
      logbookDueWeekday: Number(body.logbookDueWeekday ?? 0),
      timezone: String(body.timezone ?? 'Africa/Addis_Ababa'),
      evaluationOpenAt: body.evaluationOpenAt ? new Date(String(body.evaluationOpenAt)) : null,
      evaluationCloseAt: body.evaluationCloseAt ? new Date(String(body.evaluationCloseAt)) : null,
      config,
    },
  });
  await audit(actorId, 'cycle.create', 'Cycle', c.id);
  return cycleDto(c);
}

export async function updateCycle(actorId: string, id: string, body: Record<string, unknown>) {
  const existing = await prisma.cycle.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, 'NOT_FOUND', 'Cycle not found');
  const config = { ...(existing.config as object), ...((body.config as object) || {}) };
  const c = await prisma.cycle.update({
    where: { id },
    data: {
      title: body.title ? String(body.title) : undefined,
      evaluationOpenAt: body.evaluationOpenAt ? new Date(String(body.evaluationOpenAt)) : undefined,
      evaluationCloseAt: body.evaluationCloseAt ? new Date(String(body.evaluationCloseAt)) : undefined,
      config,
    },
  });
  await audit(actorId, 'cycle.update', 'Cycle', id);
  return cycleDto(c);
}

export async function archiveCycle(actorId: string, id: string) {
  const c = await prisma.cycle.update({
    where: { id },
    data: { isArchived: true, isOpen: false },
  });
  await audit(actorId, 'cycle.archive', 'Cycle', id);
  return cycleDto(c);
}
