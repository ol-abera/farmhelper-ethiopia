import { prisma } from '../../db/prisma.js';
import { computeWarnings } from '../ai/earlyWarning.service.js';
import { listForPlacement } from '../logbooks/logbooks.service.js';
import { myProject } from '../projects/projects.service.js';
import { listGroups } from '../cbtp/groups.service.js';
import { workload, unassigned } from '../supervisors/supervisors.service.js';

export async function studentDash(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const placement = await prisma.placement.findFirst({
    where: { studentId: userId, status: 'placed' },
    include: { organization: true, position: true, assignments: { where: { endedAt: null }, include: { supervisor: true } } },
  });
  const groups = await listGroups({ id: userId, role: 'student' });
  const project = await myProject(userId);
  const logbookSummary: Record<string, number> = {};
  if (placement) {
    const weeks = await listForPlacement(placement.id);
    for (const w of weeks) logbookSummary[w.displayStatus] = (logbookSummary[w.displayStatus] || 0) + 1;
  }
  const unread = await prisma.notification.count({ where: { userId, readAt: null } });
  const warnings = (await computeWarnings()).filter((w) => w.studentId === userId);
  const scores = user?.cycleId
    ? await prisma.finalScore.findUnique({ where: { studentId_cycleId: { studentId: userId, cycleId: user.cycleId } } })
    : null;
  return { placement, groups, project, logbookSummary, unreadMessages: unread, warnings, scores };
}

export async function advisorDash(userId: string) {
  const groups = await listGroups({ id: userId, role: 'advisor' });
  const pendingCbtp = await prisma.cbtpDocument.count({
    where: { status: 'submitted', group: { advisorId: userId } },
  });
  const pendingLog = await prisma.logbookEntry.count({
    where: { status: 'submitted', week: { placement: { assignments: { some: { supervisorUserId: userId, endedAt: null } } } } },
  });
  const warnings = await computeWarnings();
  return { groups, pendingCbtp, pendingLog, pendingEvaluations: 0, warnings };
}

export async function supervisorDash(userId: string) {
  const placements = await prisma.placement.findMany({
    where: { assignments: { some: { supervisorUserId: userId, endedAt: null } } },
    include: { student: true, organization: true },
  });
  const pendingLog = await prisma.logbookEntry.count({
    where: { status: 'submitted', week: { placement: { assignments: { some: { supervisorUserId: userId, endedAt: null } } } } },
  });
  return { assignedCount: placements.length, placements, pendingLogbooks: pendingLog };
}

export async function coordinatorDash() {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  const studentsInCycle = cycle ? await prisma.user.count({ where: { role: 'student', cycleId: cycle.id, approvedAt: { not: null } } }) : 0;
  const placed = cycle ? await prisma.placement.count({ where: { cycleId: cycle.id, status: 'placed' } }) : 0;
  const unassignedList = await unassigned();
  const warnings = await computeWarnings();
  const loads = await workload();
  const pendingReg = await prisma.user.count({ where: { role: 'student', approvedAt: null } });
  return {
    studentsInCycle,
    placed,
    unplaced: Math.max(0, studentsInCycle - placed),
    unassignedSupervisors: unassignedList.items.length,
    pendingRegistrations: pendingReg,
    atRisk: warnings,
    workload: loads,
    warnings,
  };
}

export async function hostDash(userId: string) {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  const orgId = u?.organizationId;
  if (!orgId) return { opportunities: [], placements: [] };
  const opportunities = await prisma.position.findMany({ where: { organizationId: orgId } });
  const placements = await prisma.placement.findMany({
    where: { organizationId: orgId, status: 'placed' },
    include: { student: true },
  });
  return { opportunities, placements, assignedCount: placements.length };
}

export async function adminDash() {
  const byRole = await prisma.user.groupBy({ by: ['role'], _count: true });
  const pending = await prisma.user.count({ where: { role: 'student', approvedAt: null } });
  const faqs = await prisma.faqEntry.count({ where: { approved: true } });
  return { byRole, pendingRegistrations: pending, publishedFaqs: faqs };
}

export async function forUser(user: { id: string; role: string }) {
  switch (user.role) {
    case 'student':
      return { role: user.role, ...(await studentDash(user.id)) };
    case 'advisor':
      return { role: user.role, ...(await advisorDash(user.id)) };
    case 'internship_supervisor':
      return { role: user.role, ...(await supervisorDash(user.id)) };
    case 'coordinator':
      return { role: user.role, ...(await coordinatorDash()) };
    case 'host_organization':
      return { role: user.role, ...(await hostDash(user.id)) };
    case 'administrator':
      return { role: user.role, ...(await adminDash()) };
    default:
      return { role: user.role };
  }
}
