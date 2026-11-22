import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { notify } from '../communications/notifications.service.js';
import { refreshProgress } from './tasks.service.js';

export async function addMilestone(projectId: string, data: { title: string; description: string; dueAt: string }) {
  const m = await prisma.milestone.create({
    data: { projectId, title: data.title, description: data.description, dueAt: new Date(data.dueAt) },
  });
  await refreshProgress(projectId);
  return m;
}

export async function submitMilestone(id: string) {
  const m = await prisma.milestone.update({ where: { id }, data: { status: 'submitted' } });
  await refreshProgress(m.projectId);
  return m;
}

export async function reviewMilestone(actorId: string, id: string, action: 'accept' | 'return', comment?: string) {
  if (action === 'return' && !comment) throw new HttpError(400, 'VALIDATION', 'Return requires a comment');
  const m = await prisma.milestone.update({
    where: { id },
    data: { status: action === 'accept' ? 'accepted' : 'returned', reviewComment: comment ?? null },
  });
  const project = await prisma.project.findUnique({
    where: { id: m.projectId },
    include: { members: { include: { user: true } } },
  });
  if (project) {
    for (const mem of project.members) {
      await notify(mem.userId, 'milestone_review', `Milestone ${action}ed`, comment || m.title);
    }
  }
  await refreshProgress(m.projectId);
  return m;
}
