import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { notify } from '../communications/notifications.service.js';
import { DEFAULT_CYCLE_CONFIG } from '../../config/constants.js';

export async function workload(cycleId?: string) {
  const cycle = cycleId
    ? await prisma.cycle.findUnique({ where: { id: cycleId } })
    : await prisma.cycle.findFirst({ where: { isOpen: true } });
  const supervisors = await prisma.user.findMany({
    where: { role: { in: ['advisor', 'internship_supervisor'] }, isActive: true },
  });
  const counts = await prisma.supervisorAssignment.groupBy({
    by: ['supervisorUserId'],
    where: { endedAt: null, placement: { cycleId: cycle?.id, status: 'placed' } },
    _count: true,
  });
  const map = new Map(counts.map((c) => [c.supervisorUserId, c._count]));
  return supervisors.map((s) => ({
    id: s.id,
    fullName: s.fullName,
    email: s.email,
    role: s.role,
    organizationId: s.organizationId,
    count: map.get(s.id) ?? 0,
  }));
}

export async function unassigned() {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  if (!cycle) return { items: [] };
  const placed = await prisma.placement.findMany({
    where: { cycleId: cycle.id, status: 'placed' },
    include: { student: true, assignments: { where: { endedAt: null } }, organization: true },
  });
  const items = placed
    .filter((p) => {
      const hasAdv = p.assignments.some((a) => a.type === 'advisor');
      const hasHost = p.assignments.some((a) => a.type === 'internship');
      return !hasAdv || !hasHost;
    })
    .map((p) => ({
      placementId: p.id,
      studentName: p.student.fullName,
      organizationName: p.organization.name,
      missingAdvisor: !p.assignments.some((a) => a.type === 'advisor'),
      missingInternshipSupervisor: !p.assignments.some((a) => a.type === 'internship'),
    }));
  return { items };
}

export async function assign(actorId: string, placementId: string, supervisorUserId: string, type: 'advisor' | 'internship', force?: boolean) {
  const placement = await prisma.placement.findUnique({
    where: { id: placementId },
    include: { student: true, organization: true, cycle: true },
  });
  if (!placement) throw new HttpError(404, 'NOT_FOUND', 'Placement not found');
  const locked = await prisma.evaluation.findFirst({
    where: { studentId: placement.studentId, cycleId: placement.cycleId, status: 'submitted' },
  });
  if (placement.cycle.evaluationsLocked && locked) {
    throw new HttpError(409, 'EVALUATION_LOCKED', 'Cannot reassign after evaluations are locked');
  }
  const supervisor = await prisma.user.findUnique({ where: { id: supervisorUserId } });
  if (!supervisor) throw new HttpError(404, 'NOT_FOUND', 'Supervisor not found');
  if (type === 'internship' && supervisor.organizationId && supervisor.organizationId !== placement.organizationId) {
    throw new HttpError(400, 'VALIDATION', 'Internship supervisor must belong to the host organisation');
  }
  const cfg = { ...DEFAULT_CYCLE_CONFIG, ...(placement.cycle.config as object) };
  const current = await prisma.supervisorAssignment.count({
    where: { supervisorUserId, endedAt: null },
  });
  const warning = current >= cfg.workloadThreshold ? `Workload ${current} exceeds threshold ${cfg.workloadThreshold}` : null;
  if (warning && !force) {
    return { warning, assigned: false as const, current };
  }
  const prev = await prisma.supervisorAssignment.findFirst({
    where: { placementId, type, endedAt: null },
  });
  if (prev) {
    await prisma.supervisorAssignment.update({ where: { id: prev.id }, data: { endedAt: new Date() } });
    if (prev.supervisorUserId !== supervisorUserId) {
      await notify(prev.supervisorUserId, 'supervisor_unassigned', 'Student reassigned', `${placement.student.fullName} is no longer assigned to you.`);
    }
  }
  const row = await prisma.supervisorAssignment.create({
    data: { placementId, supervisorUserId, type, assignedBy: actorId },
  });
  await notify(
    supervisorUserId,
    'supervisor_assigned',
    'New student assigned',
    `You have been assigned as ${type} supervisor for ${placement.student.fullName}.`,
    { placementId },
    { to: supervisor.email, enabled: true },
  );
  await notify(
    placement.studentId,
    'supervisor_assigned',
    'Supervisor assigned',
    `${supervisor.fullName} is now your ${type === 'advisor' ? 'academic advisor' : 'internship supervisor'}.`,
    { placementId },
    { to: placement.student.email, enabled: true },
  );
  await audit(actorId, 'supervisor.assign', 'SupervisorAssignment', row.id, { type, supervisorUserId, previous: prev?.supervisorUserId });
  return { assigned: true as const, warning, assignment: row };
}
