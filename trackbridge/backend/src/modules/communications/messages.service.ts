import { prisma } from '../../db/prisma.js';
import { notify } from './notifications.service.js';

export async function listThreads(userId: string) {
  const parts = await prisma.messageThreadParticipant.findMany({
    where: { userId },
    include: {
      thread: {
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { sender: true } },
        },
      },
    },
  });
  return parts.map((p) => ({
    id: p.thread.id,
    subject: p.thread.subject,
    placementId: p.thread.placementId,
    projectId: p.thread.projectId,
    lastMessage: p.thread.messages[0]
      ? {
          id: p.thread.messages[0].id,
          threadId: p.thread.id,
          senderId: p.thread.messages[0].senderId,
          senderName: p.thread.messages[0].sender.fullName,
          body: p.thread.messages[0].body,
          createdAt: p.thread.messages[0].createdAt.toISOString(),
        }
      : null,
  }));
}

export async function getThread(id: string) {
  return prisma.messageThread.findUnique({
    where: { id },
    include: { messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } }, participants: true },
  });
}

export async function postMessage(userId: string, body: { threadId?: string; placementId?: string; projectId?: string; groupSubject?: string; body: string }) {
  let threadId = body.threadId;
  if (!threadId) {
    const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
    const thread = await prisma.messageThread.create({
      data: {
        cycleId: cycle!.id,
        placementId: body.placementId,
        projectId: body.projectId,
        subject: body.groupSubject || 'Discussion',
        participants: { create: { userId } },
      },
    });
    threadId = thread.id;
    if (body.placementId) {
      const p = await prisma.placement.findUnique({
        where: { id: body.placementId },
        include: { assignments: { where: { endedAt: null } } },
      });
      if (p) {
        const ids = new Set([p.studentId, ...p.assignments.map((a) => a.supervisorUserId), userId]);
        for (const id of ids) {
          await prisma.messageThreadParticipant.upsert({
            where: { threadId_userId: { threadId, userId: id } },
            create: { threadId, userId: id },
            update: {},
          });
        }
      }
    }
  }
  const msg = await prisma.message.create({ data: { threadId, senderId: userId, body: body.body } });
  const parts = await prisma.messageThreadParticipant.findMany({ where: { threadId } });
  for (const p of parts) {
    if (p.userId !== userId) {
      await notify(p.userId, 'message', 'New message', body.body.slice(0, 140), { threadId });
    }
  }
  return msg;
}
