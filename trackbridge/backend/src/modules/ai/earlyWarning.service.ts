import { prisma } from '../../db/prisma.js';
import { evaluateEarlyWarnings } from '../dashboard/atRisk.service.js';
import { overallStatus } from '../projects/progress.service.js';
import { AT_RISK_DEFAULTS } from '@trackbridge/shared';

export async function computeWarnings() {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  if (!cycle) return [];
  const cfg = { ...AT_RISK_DEFAULTS, ...(cycle.config as object) };
  const students = await prisma.user.findMany({
    where: { role: 'student', cycleId: cycle.id, approvedAt: { not: null } },
    include: {
      placements: { where: { cycleId: cycle.id }, include: { logbookWeeks: { include: { entry: true } }, attendance: true } },
      ownedProjects: { where: { cycleId: cycle.id }, include: { tasks: true, milestones: true } },
      cbtpMemberships: { include: { group: { include: { documents: true, activity: true } } } },
    },
  });
  const now = new Date();
  const rows = students.map((s) => {
    const weeks = s.placements.flatMap((p) => p.logbookWeeks);
    const lateOrMissing = weeks.filter((w) => {
      if (w.dueAt > now) return false;
      if (!w.entry) return true;
      return w.entry.late || w.entry.status === 'missing' || (w.entry.status !== 'approved' && w.dueAt < now && w.entry.status !== 'submitted');
    }).length;
    const project = s.ownedProjects[0];
    const prog = project
      ? overallStatus({ tasks: project.tasks, milestones: project.milestones, now })
      : { overallStatus: 'not_started' as const, taskPercent: 0, milestonePercent: 0 };
    const overdueMilestones = project
      ? project.milestones.filter((m) => m.status !== 'accepted' && m.dueAt < now).length
      : 0;
    const last = s.lastActivityAt;
    const daysSince = last ? Math.floor((now.getTime() - last.getTime()) / 86400000) : 30;
    const cbtpOverdue = s.cbtpMemberships.some((m) =>
      m.group.documents.some((d) => d.status !== 'approved' && m.group.activity.endDate < now),
    );
    const attendanceGaps = s.placements.reduce((n, p) => n + p.attendance.filter((a) => a.status === 'absent').length, 0);
    return {
      studentId: s.id,
      studentName: s.fullName,
      studentNumber: s.studentId,
      lateOrMissingLogbooks: lateOrMissing,
      projectBehind: prog.overallStatus === 'behind',
      daysSinceActivity: daysSince,
      cbtpOverdue,
      attendanceGaps,
      evaluationClosingSoonWithoutForm: false,
      coordinatorFlag: s.coordinatorFlagAtRisk,
      overdueMilestones,
    };
  });
  return evaluateEarlyWarnings(rows, cfg);
}
