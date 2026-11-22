import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { notify } from '../communications/notifications.service.js';
import { cbtpProgress } from './cbtpProgress.service.js';

export async function listGroups(actor: { id: string; role: string }) {
  const where =
    actor.role === 'advisor'
      ? { advisorId: actor.id }
      : actor.role === 'student'
        ? { members: { some: { studentId: actor.id } } }
        : {};
  const items = await prisma.cbtpGroup.findMany({
    where,
    include: {
      advisor: true,
      members: { include: { student: true } },
      activity: { include: { site: true } },
      documents: true,
    },
    orderBy: { name: 'asc' },
  });
  return items.map((g) => ({
    ...g,
    progress: cbtpProgress(
      ['needs_assessment', 'action_plan', 'progress_report', 'final_report'],
      g.documents.map((d) => ({ docKind: d.docKind, status: d.status })),
    ),
  }));
}

export async function createGroup(actorId: string, data: { activityId: string; name: string; advisorId?: string }) {
  const g = await prisma.cbtpGroup.create({ data });
  await audit(actorId, 'cbtp.group.create', 'CbtpGroup', g.id);
  if (data.advisorId) {
    const adv = await prisma.user.findUnique({ where: { id: data.advisorId } });
    if (adv) {
      await notify(adv.id, 'assignment', 'CBTP group assigned', `You are advisor for group ${data.name}.`, {}, { to: adv.email, enabled: true });
    }
  }
  return g;
}

export async function addMember(actorId: string, groupId: string, studentId: string, exception = false) {
  const group = await prisma.cbtpGroup.findUnique({
    where: { id: groupId },
    include: { activity: true },
  });
  if (!group) throw new HttpError(404, 'NOT_FOUND', 'Group not found');
  const existing = await prisma.cbtpGroupMember.findFirst({
    where: { studentId, group: { activity: { cycleId: group.activity.cycleId } } },
  });
  if (existing && existing.groupId !== groupId && !exception) {
    throw new HttpError(409, 'CONFLICT', 'Student already has an active CBTP group this period');
  }
  if (existing && existing.groupId !== groupId && exception) {
    await audit(actorId, 'cbtp.member.exception', 'CbtpGroupMember', existing.id, { studentId });
  }
  const row = await prisma.cbtpGroupMember.upsert({
    where: { groupId_studentId: { groupId, studentId } },
    create: { groupId, studentId },
    update: {},
  });
  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (student) {
    await notify(studentId, 'assignment', 'Assigned to CBTP group', `You were assigned to ${group.name}.`, {}, { to: student.email, enabled: true });
  }
  await audit(actorId, 'cbtp.member.add', 'CbtpGroupMember', row.id, { studentId, groupId });
  return row;
}
