import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { notify } from '../communications/notifications.service.js';

export async function listSubmissions(actor: { id: string; role: string }, groupId?: string) {
  const where: Record<string, unknown> = {};
  if (groupId) where.groupId = groupId;
  if (actor.role === 'student') where.authorId = actor.id;
  if (actor.role === 'advisor') where.group = { advisorId: actor.id };
  return prisma.cbtpDocument.findMany({
    where,
    include: { author: true, reviewer: true, group: { include: { activity: { include: { site: true } }, advisor: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createSubmission(studentId: string, data: { groupId: string; title: string; body: string; docKind: string }) {
  const member = await prisma.cbtpGroupMember.findFirst({ where: { groupId: data.groupId, studentId } });
  if (!member) throw new HttpError(403, 'FORBIDDEN', 'You are not in this CBTP group');
  const doc = await prisma.cbtpDocument.create({
    data: { ...data, authorId: studentId, status: 'draft' },
  });
  return doc;
}

export async function submitDoc(studentId: string, id: string) {
  const doc = await prisma.cbtpDocument.findUnique({ where: { id }, include: { group: { include: { advisor: true } } } });
  if (!doc || doc.authorId !== studentId) throw new HttpError(403, 'FORBIDDEN', 'Not your submission');
  if (!['draft', 'returned'].includes(doc.status)) throw new HttpError(409, 'CONFLICT', 'Cannot submit this status');
  const updated = await prisma.cbtpDocument.update({
    where: { id },
    data: { status: 'submitted', submittedAt: new Date() },
  });
  if (doc.group.advisor) {
    await notify(doc.group.advisor.id, 'cbtp_submitted', 'CBTP report submitted', `${doc.title} is ready for review.`, { id }, { to: doc.group.advisor.email, enabled: true });
  }
  return updated;
}

export async function reviewDoc(actorId: string, id: string, action: 'approve' | 'return' | 'comment', body: string, role: string) {
  const doc = await prisma.cbtpDocument.findUnique({
    where: { id },
    include: { group: true, author: true },
  });
  if (!doc) throw new HttpError(404, 'NOT_FOUND', 'Submission not found');
  if (role === 'advisor' && doc.group.advisorId !== actorId) {
    throw new HttpError(403, 'FORBIDDEN', 'Not the group advisor');
  }
  if (action === 'return' && !body) throw new HttpError(400, 'VALIDATION', 'Return requires a comment');
  const status = action === 'approve' ? 'approved' : action === 'return' ? 'returned' : doc.status;
  const updated = await prisma.cbtpDocument.update({
    where: { id },
    data: { status, reviewComment: body, reviewerId: actorId, reviewedAt: new Date() },
  });
  await audit(actorId, `cbtp.submission.${action}`, 'CbtpDocument', id, { comment: body });
  await notify(doc.authorId, `cbtp_${action}`, `CBTP report ${action}d`, body, { id }, { to: doc.author.email, enabled: true });
  return updated;
}
