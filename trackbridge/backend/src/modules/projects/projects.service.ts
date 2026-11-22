import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { notify } from '../communications/notifications.service.js';
import { compareTitle } from '../ai/titleSimilarity.service.js';
import { overallStatus } from './progress.service.js';

export async function myProject(userId: string) {
  const membership = await prisma.projectMember.findFirst({
    where: { userId, acceptedAt: { not: null } },
    include: {
      project: {
        include: {
          members: { include: { user: true } },
          tasks: true,
          milestones: { include: { deliverables: true } },
          similarityHits: true,
          creator: true,
        },
      },
    },
  });
  if (!membership) return null;
  const p = membership.project;
  const prog = overallStatus({ tasks: p.tasks, milestones: p.milestones });
  return { ...p, ...prog };
}

export async function listProjects(actor: { id: string; role: string }) {
  const where =
    actor.role === 'advisor'
      ? {
          OR: [
            { members: { some: { user: { placements: { some: { assignments: { some: { supervisorUserId: actor.id, endedAt: null } } } } } } } },
            { creator: { placements: { some: { assignments: { some: { supervisorUserId: actor.id, endedAt: null } } } } } },
          ],
        }
      : actor.role === 'student'
        ? { members: { some: { userId: actor.id } } }
        : {};
  const items = await prisma.project.findMany({
    where,
    include: { creator: true, members: { include: { user: true } }, tasks: true, milestones: true, similarityHits: true },
    orderBy: { updatedAt: 'desc' },
  });
  return items.map((p) => ({ ...p, ...overallStatus({ tasks: p.tasks, milestones: p.milestones }) }));
}

export async function createProject(studentId: string, data: { title: string; problem: string; objectives: string; tools: string; mode?: 'individual' | 'team' }) {
  const user = await prisma.user.findUnique({ where: { id: studentId } });
  if (!user?.cycleId) throw new HttpError(400, 'CYCLE_CLOSED', 'You are not in an academic period');
  const existing = await prisma.projectMember.findFirst({
    where: { userId: studentId, acceptedAt: { not: null }, project: { cycleId: user.cycleId } },
  });
  if (existing) throw new HttpError(409, 'CONFLICT', 'You already have a technical project this period');
  const project = await prisma.project.create({
    data: {
      cycleId: user.cycleId,
      creatorId: studentId,
      title: data.title,
      problem: data.problem,
      objectives: data.objectives,
      tools: data.tools,
      mode: data.mode ?? 'individual',
      proposalStatus: 'draft',
      members: { create: { userId: studentId, roleInTeam: 'owner', acceptedAt: new Date() } },
    },
  });
  const sim = await compareTitle(data.title, project.id);
  return { project, similarity: sim };
}

export async function submitTitle(studentId: string, projectId: string) {
  const p = await prisma.project.findUnique({ where: { id: projectId }, include: { members: true } });
  if (!p || !p.members.some((m) => m.userId === studentId)) throw new HttpError(403, 'FORBIDDEN', 'Not your project');
  const sim = await compareTitle(p.title, p.id);
  const updated = await prisma.project.update({ where: { id: projectId }, data: { proposalStatus: 'submitted' } });
  return { project: updated, similarity: sim };
}

export async function reviewTitle(actorId: string, projectId: string, action: 'approve' | 'return', comment?: string) {
  if (action === 'return' && !comment) throw new HttpError(400, 'VALIDATION', 'Return requires a comment');
  const p = await prisma.project.update({
    where: { id: projectId },
    data: { proposalStatus: action === 'approve' ? 'approved' : 'returned' },
  });
  await audit(actorId, `project.title.${action}`, 'Project', projectId, { comment });
  const members = await prisma.projectMember.findMany({ where: { projectId }, include: { user: true } });
  for (const m of members) {
    await notify(m.userId, 'title_review', `Project title ${action}d`, comment || p.title);
  }
  return p;
}

export async function invite(projectId: string, studentId: string, actorId: string) {
  const p = await prisma.project.findUnique({ where: { id: projectId }, include: { members: true, cycle: true } });
  if (!p) throw new HttpError(404, 'NOT_FOUND', 'Project not found');
  if (!p.members.some((m) => m.userId === actorId && m.roleInTeam === 'owner')) {
    throw new HttpError(403, 'FORBIDDEN', 'Only the owner can invite');
  }
  const cfg = p.cycle.config as { maxTeamSize?: number };
  if (p.members.length >= (cfg.maxTeamSize ?? 4)) throw new HttpError(400, 'VALIDATION', 'Team is full');
  return prisma.projectMember.create({
    data: { projectId, userId: studentId, roleInTeam: 'member' },
  });
}

export async function acceptInvite(userId: string, projectId: string) {
  return prisma.projectMember.update({
    where: { projectId_userId: { projectId, userId } },
    data: { acceptedAt: new Date() },
  });
}
