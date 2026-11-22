import type { LogbookStatus } from '@trackbridge/shared';
import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { notify } from '../communications/notifications.service.js';
import { generateWeeks } from './logbookWeeks.service.js';

function displayStatus(week: { dueAt: Date; entry: { status: LogbookStatus; late: boolean } | null }): LogbookStatus {
  if (!week.entry) return week.dueAt < new Date() ? 'missing' : 'missing';
  if (week.entry.status === 'submitted' && week.entry.late) return 'late';
  return week.entry.status;
}

export async function listForPlacement(placementId: string) {
  await generateWeeks(placementId);
  const weeks = await prisma.logbookWeek.findMany({
    where: { placementId },
    orderBy: { weekIndex: 'asc' },
    include: { entry: { include: { comments: { include: { author: true }, orderBy: { createdAt: 'asc' } } } } },
  });
  return weeks.map((w) => ({
    id: w.id,
    placementId: w.placementId,
    weekIndex: w.weekIndex,
    periodStart: w.periodStart.toISOString(),
    periodEnd: w.periodEnd.toISOString(),
    dueAt: w.dueAt.toISOString(),
    displayStatus: displayStatus(w),
    entry: w.entry
      ? {
          id: w.entry.id,
          weekId: w.entry.weekId,
          activities: w.entry.activities,
          hours: w.entry.hours,
          skills: w.entry.skills,
          challenges: w.entry.challenges,
          status: w.entry.status,
          submittedAt: w.entry.submittedAt?.toISOString() ?? null,
          late: w.entry.late,
          resubmitCount: w.entry.resubmitCount,
          comments: w.entry.comments.map((c) => ({
            id: c.id,
            authorId: c.authorId,
            authorName: c.author.fullName,
            body: c.body,
            action: c.action === 'return_to_student' ? 'return' : c.action,
            createdAt: c.createdAt.toISOString(),
          })),
        }
      : null,
  }));
}

export async function saveDraft(studentId: string, weekId: string, body: { activities: string; hours: number; skills: string; challenges: string }) {
  const week = await prisma.logbookWeek.findUnique({
    where: { id: weekId },
    include: { placement: true, entry: true },
  });
  if (!week || week.placement.studentId !== studentId) throw new HttpError(403, 'FORBIDDEN', 'Not your logbook week');
  if (week.entry && !['draft', 'returned'].includes(week.entry.status)) {
    throw new HttpError(409, 'CONFLICT', 'This week is not editable');
  }
  if (week.entry) {
    return prisma.logbookEntry.update({
      where: { id: week.entry.id },
      data: { ...body, status: 'draft' },
    });
  }
  return prisma.logbookEntry.create({
    data: { weekId, ...body, status: 'draft' },
  });
}

export async function submit(studentId: string, weekId: string) {
  const week = await prisma.logbookWeek.findUnique({
    where: { id: weekId },
    include: { placement: { include: { assignments: { where: { endedAt: null }, include: { supervisor: true } }, student: true } }, entry: true },
  });
  if (!week || week.placement.studentId !== studentId) throw new HttpError(403, 'FORBIDDEN', 'Not your logbook week');
  if (!week.entry || !['draft', 'returned'].includes(week.entry.status)) {
    throw new HttpError(400, 'VALIDATION', 'Save a draft before submitting');
  }
  const late = new Date() > week.dueAt;
  const entry = await prisma.logbookEntry.update({
    where: { id: week.entry.id },
    data: {
      status: 'submitted',
      submittedAt: new Date(),
      late,
      resubmitCount: week.entry.status === 'returned' ? week.entry.resubmitCount + 1 : week.entry.resubmitCount,
    },
  });
  for (const a of week.placement.assignments) {
    await notify(a.supervisorUserId, 'logbook_submitted', 'Logbook submitted', `${week.placement.student.fullName} submitted week ${week.weekIndex}.`, { weekId }, { to: a.supervisor.email, enabled: true });
  }
  return entry;
}

export async function review(actorId: string, entryId: string, action: 'approve' | 'return' | 'comment', body: string, role: string) {
  const entry = await prisma.logbookEntry.findUnique({
    where: { id: entryId },
    include: { week: { include: { placement: { include: { student: true, cycle: true, assignments: { where: { endedAt: null } } } } } } },
  });
  if (!entry) throw new HttpError(404, 'NOT_FOUND', 'Entry not found');
  const assigned = entry.week.placement.assignments.some((a) => a.supervisorUserId === actorId);
  if (!assigned && !['coordinator', 'administrator'].includes(role)) {
    throw new HttpError(403, 'FORBIDDEN', 'Not assigned to this student');
  }
  if (action === 'return' && !body) throw new HttpError(400, 'VALIDATION', 'Return requires a comment');
  const mapped = action === 'return' ? 'return_to_student' : action;
  await prisma.logbookComment.create({
    data: { entryId, authorId: actorId, body, action: mapped },
  });
  if (action === 'approve') {
    await prisma.logbookEntry.update({ where: { id: entryId }, data: { status: 'approved' } });
    await notify(entry.week.placement.studentId, 'logbook_approved', 'Logbook approved', `Week ${entry.week.weekIndex} was approved.`, {}, { to: entry.week.placement.student.email, enabled: true });
  } else if (action === 'return') {
    await prisma.logbookEntry.update({ where: { id: entryId }, data: { status: 'returned' } });
    await notify(entry.week.placement.studentId, 'logbook_returned', 'Logbook returned', body, {}, { to: entry.week.placement.student.email, enabled: true });
  }
  return prisma.logbookEntry.findUnique({
    where: { id: entryId },
    include: { comments: true },
  });
}

export async function override(actorId: string, entryId: string, status: LogbookStatus, comment: string) {
  const entry = await prisma.logbookEntry.update({ where: { id: entryId }, data: { status } });
  await prisma.logbookComment.create({
    data: { entryId, authorId: actorId, body: comment, action: 'comment' },
  });
  await audit(actorId, 'logbook.override', 'LogbookEntry', entryId, { status, comment });
  return entry;
}

export async function inbox(actorId: string, role: string) {
  if (['coordinator', 'administrator'].includes(role)) {
    return prisma.logbookEntry.findMany({
      where: { status: { in: ['submitted', 'late'] } },
      include: { week: { include: { placement: { include: { student: true } } } } },
      orderBy: { submittedAt: 'asc' },
      take: 50,
    });
  }
  return prisma.logbookEntry.findMany({
    where: {
      status: { in: ['submitted', 'late'] },
      week: { placement: { assignments: { some: { supervisorUserId: actorId, endedAt: null } } } },
    },
    include: { week: { include: { placement: { include: { student: true } } } } },
    orderBy: { submittedAt: 'asc' },
    take: 50,
  });
}
