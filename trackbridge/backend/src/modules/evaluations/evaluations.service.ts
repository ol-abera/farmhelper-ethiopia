import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { formTotal, weightedFinal } from './scoring.service.js';
import { DEFAULT_CYCLE_CONFIG } from '../../config/constants.js';

export async function inbox(actorId: string, role: string) {
  if (['coordinator', 'administrator'].includes(role)) {
    return prisma.evaluation.findMany({ include: { student: true, evaluator: true }, orderBy: { submittedAt: 'desc' } });
  }
  return prisma.evaluation.findMany({
    where: { evaluatorId: actorId },
    include: { student: true },
  });
}

export async function upsert(actorId: string, body: { studentId: string; component: 'advisor' | 'host' | 'project'; scores: Record<string, number>; comments?: string; submit?: boolean }) {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  if (!cycle) throw new HttpError(400, 'CYCLE_CLOSED', 'No open period');
  if (cycle.evaluationsLocked) throw new HttpError(409, 'EVALUATION_LOCKED', 'Evaluations are locked');
  const rubric = await prisma.rubric.findUnique({
    where: { cycleId_component: { cycleId: cycle.id, component: body.component } },
  });
  const criteria = (rubric?.criteria as { name: string; maxPoints: number }[]) ?? [];
  const total = formTotal(body.scores, criteria);
  const ev = await prisma.evaluation.upsert({
    where: {
      studentId_cycleId_component_evaluatorId: {
        studentId: body.studentId,
        cycleId: cycle.id,
        component: body.component,
        evaluatorId: actorId,
      },
    },
    create: {
      studentId: body.studentId,
      cycleId: cycle.id,
      component: body.component,
      evaluatorId: actorId,
      scores: body.scores,
      comments: body.comments,
      total,
      status: body.submit ? 'submitted' : 'draft',
      submittedAt: body.submit ? new Date() : null,
    },
    update: {
      scores: body.scores,
      comments: body.comments,
      total,
      status: body.submit ? 'submitted' : 'draft',
      submittedAt: body.submit ? new Date() : undefined,
    },
  });
  await recomputeFinal(body.studentId, cycle.id);
  return ev;
}

export async function recomputeFinal(studentId: string, cycleId: string) {
  const cycle = await prisma.cycle.findUnique({ where: { id: cycleId } });
  if (!cycle) return;
  const cfg = { ...DEFAULT_CYCLE_CONFIG, ...(cycle.config as object) } as typeof DEFAULT_CYCLE_CONFIG;
  const weights = {
    advisor: cfg.weights.advisor ?? (cfg.weights as { university?: number }).university ?? 50,
    host: cfg.weights.host ?? 30,
    project: cfg.weights.project ?? 20,
  };
  const evs = await prisma.evaluation.findMany({
    where: { studentId, cycleId, status: 'submitted' },
  });
  const advisor = evs.find((e) => e.component === 'advisor')?.total ?? null;
  const host = evs.find((e) => e.component === 'host')?.total ?? null;
  const project = evs.find((e) => e.component === 'project')?.total ?? null;
  const { weightedFinal: wf, incomplete } = weightedFinal({ advisor, host, project }, weights);
  await prisma.finalScore.upsert({
    where: { studentId_cycleId: { studentId, cycleId } },
    create: {
      studentId,
      cycleId,
      advisorTotal: advisor,
      hostTotal: host,
      projectTotal: project,
      weightedFinal: incomplete ? null : wf,
    },
    update: {
      advisorTotal: advisor,
      hostTotal: host,
      projectTotal: project,
      weightedFinal: incomplete ? null : wf,
    },
  });
}

export async function lock(actorId: string, cycleId: string) {
  const c = await prisma.cycle.update({ where: { id: cycleId }, data: { evaluationsLocked: true } });
  await audit(actorId, 'evaluations.lock', 'Cycle', cycleId);
  return c;
}

export async function publish(actorId: string, cycleId: string) {
  await prisma.finalScore.updateMany({ where: { cycleId }, data: { publishedAt: new Date() } });
  const c = await prisma.cycle.update({ where: { id: cycleId }, data: { scoresPublished: true } });
  await audit(actorId, 'evaluations.publish', 'Cycle', cycleId);
  return c;
}
