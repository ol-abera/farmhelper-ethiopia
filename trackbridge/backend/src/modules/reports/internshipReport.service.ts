import { prisma } from '../../db/prisma.js';

export async function internshipActivityData() {
  const placements = await prisma.placement.findMany({
    where: { status: 'placed' },
    include: { student: true, organization: true, attendance: true, logbookWeeks: { include: { entry: true } } },
  });
  return placements.map((p) => ({
    student: p.student.fullName,
    organization: p.organization.name,
    attendancePresent: p.attendance.filter((a) => a.status === 'present').length,
    attendanceAbsent: p.attendance.filter((a) => a.status === 'absent').length,
    logbooksSubmitted: p.logbookWeeks.filter((w) => w.entry?.status === 'submitted' || w.entry?.status === 'approved').length,
    logbooksApproved: p.logbookWeeks.filter((w) => w.entry?.status === 'approved').length,
  }));
}
