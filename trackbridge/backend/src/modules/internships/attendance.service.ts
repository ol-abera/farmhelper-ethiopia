import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { notify } from '../communications/notifications.service.js';

export async function listAttendance(placementId: string) {
  return prisma.attendance.findMany({ where: { placementId }, orderBy: { date: 'desc' } });
}

export async function recordAttendance(
  actorId: string,
  role: string,
  placementId: string,
  data: { date: string; status: 'present' | 'absent' | 'late' | 'excused'; hours?: number; notes?: string },
) {
  const placement = await prisma.placement.findUnique({
    where: { id: placementId },
    include: { student: true, assignments: { where: { endedAt: null } } },
  });
  if (!placement) throw new HttpError(404, 'NOT_FOUND', 'Placement not found');
  if (role === 'student' && placement.studentId !== actorId) throw new HttpError(403, 'FORBIDDEN', 'Not your placement');
  const day = new Date(data.date);
  day.setHours(0, 0, 0, 0);
  const row = await prisma.attendance.upsert({
    where: { placementId_date: { placementId, date: day } },
    create: {
      placementId,
      date: day,
      status: data.status,
      hours: data.hours ?? 8,
      notes: data.notes,
      recordedBy: actorId,
    },
    update: { status: data.status, hours: data.hours ?? 8, notes: data.notes, recordedBy: actorId },
  });
  for (const a of placement.assignments.filter((x) => x.type === 'internship')) {
    await notify(a.supervisorUserId, 'attendance', 'Attendance recorded', `${placement.student.fullName}: ${data.status} on ${data.date}`);
  }
  return row;
}

export async function confirmAttendance(actorId: string, id: string, notes?: string) {
  const row = await prisma.attendance.update({
    where: { id },
    data: { notes: notes ? `Confirmed: ${notes}` : 'Confirmed by supervisor' },
  });
  await audit(actorId, 'attendance.confirm', 'Attendance', id);
  return row;
}
