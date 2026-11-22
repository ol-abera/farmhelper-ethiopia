import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';

export async function listTasks(placementId: string) {
  return prisma.internshipTask.findMany({ where: { placementId }, orderBy: { createdAt: 'desc' } });
}

export async function createTask(actorId: string, placementId: string, data: { title: string; dueAt?: string; assigneeId?: string }) {
  const p = await prisma.placement.findUnique({ where: { id: placementId } });
  if (!p) throw new HttpError(404, 'NOT_FOUND', 'Placement not found');
  return prisma.internshipTask.create({
    data: {
      placementId,
      title: data.title,
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
      assigneeId: data.assigneeId || p.studentId,
      createdById: actorId,
    },
  });
}

export async function setTaskStatus(id: string, status: 'todo' | 'in_progress' | 'done') {
  return prisma.internshipTask.update({ where: { id }, data: { status } });
}
