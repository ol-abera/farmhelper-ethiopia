import { prisma } from '../../db/prisma.js';
import { overallStatus } from './progress.service.js';

export async function addTask(projectId: string, data: { title: string; assigneeId?: string; dueAt?: string }) {
  const task = await prisma.projectTask.create({
    data: {
      projectId,
      title: data.title,
      assigneeId: data.assigneeId,
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
    },
  });
  await refreshProgress(projectId);
  return task;
}

export async function setTask(id: string, status: 'todo' | 'in_progress' | 'done') {
  const task = await prisma.projectTask.update({ where: { id }, data: { status } });
  await refreshProgress(task.projectId);
  return task;
}

export async function refreshProgress(projectId: string) {
  const p = await prisma.project.findUnique({
    where: { id: projectId },
    include: { tasks: true, milestones: true },
  });
  if (!p) return;
  const prog = overallStatus({ tasks: p.tasks, milestones: p.milestones });
  await prisma.project.update({ where: { id: projectId }, data: { overallStatus: prog.overallStatus } });
}
