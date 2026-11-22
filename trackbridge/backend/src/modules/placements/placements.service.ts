import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { notify } from '../communications/notifications.service.js';
import { parsePage, paginated } from '../../utils/pagination.js';
import { generateWeeks } from '../logbooks/logbookWeeks.service.js';
import { generateLetter } from './placementLetter.service.js';
import { DEFAULT_CYCLE_CONFIG } from '../../config/constants.js';

async function openCycle() {
  const c = await prisma.cycle.findFirst({ where: { isOpen: true } });
  if (!c) throw new HttpError(400, 'CYCLE_CLOSED', 'No open cycle');
  return c;
}

export async function apply(studentId: string, positionId: string, coverNote: string) {
  const cycle = await openCycle();
  const cfg = { ...DEFAULT_CYCLE_CONFIG, ...(cycle.config as object) };
  const pending = await prisma.application.count({
    where: { studentId, cycleId: cycle.id, status: { in: ['pending', 'recommended'] } },
  });
  if (pending >= cfg.maxApplications) {
    throw new HttpError(409, 'PENDING_APPLICATION', 'You already have a pending application');
  }
  const placed = await prisma.placement.findFirst({
    where: { studentId, cycleId: cycle.id, status: { in: ['placed', 'approved'] } },
  });
  if (placed) throw new HttpError(409, 'ALREADY_PLACED', 'You already have a placement this cycle');
  const pos = await prisma.position.findUnique({ where: { id: positionId } });
  if (!pos || !pos.isOpen) throw new HttpError(404, 'NOT_FOUND', 'Position is not open');
  const app = await prisma.application.create({
    data: { studentId, positionId, cycleId: cycle.id, type: 'apply', coverNote, status: 'pending' },
  });
  return app;
}

export async function propose(studentId: string, body: Record<string, string>) {
  const cycle = await openCycle();
  const cfg = { ...DEFAULT_CYCLE_CONFIG, ...(cycle.config as object) };
  const pending = await prisma.application.count({
    where: { studentId, cycleId: cycle.id, status: { in: ['pending', 'recommended'] } },
  });
  if (pending >= cfg.maxApplications) {
    throw new HttpError(409, 'PENDING_APPLICATION', 'You already have a pending proposal');
  }
  return prisma.application.create({
    data: {
      studentId,
      cycleId: cycle.id,
      type: 'propose',
      coverNote: body.coverNote,
      proposedOrgName: body.proposedOrgName,
      proposedOrgAddress: body.proposedOrgAddress,
      proposedOrgContact: body.proposedOrgContact,
      proposedRole: body.proposedRole,
      status: 'pending',
    },
  });
}

export async function listApplications(query: Record<string, unknown>, actor: { id: string; role: string; organizationId?: string | null }) {
  const { skip, take, page, pageSize } = parsePage(query);
  const where: Record<string, unknown> = {};
  if (actor.role === 'student') where.studentId = actor.id;
  if (query.status) where.status = query.status;
  if (actor.role === 'host_organization' && actor.organizationId) {
    where.position = { organizationId: actor.organizationId };
  }
  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { student: true, position: { include: { organization: true } } },
    }),
    prisma.application.count({ where }),
  ]);
  return paginated(
    items.map((a) => ({
      id: a.id,
      studentId: a.studentId,
      studentName: a.student.fullName,
      studentNumber: a.student.studentId,
      positionId: a.positionId,
      cycleId: a.cycleId,
      type: a.type,
      coverNote: a.coverNote,
      status: a.status,
      reason: a.reason,
      hostRecommendation: a.hostRecommendation,
      proposedOrgName: a.proposedOrgName,
      proposedOrgAddress: a.proposedOrgAddress,
      proposedOrgContact: a.proposedOrgContact,
      proposedRole: a.proposedRole,
      createdAt: a.createdAt.toISOString(),
      positionTitle: a.position?.title,
      organizationName: a.position?.organization.name,
    })),
    total,
    page,
    pageSize,
  );
}

export async function recommend(actorId: string, applicationId: string, recommendation: string) {
  const app = await prisma.application.update({
    where: { id: applicationId },
    data: { hostRecommendation: recommendation, status: 'recommended' },
  });
  await audit(actorId, 'application.recommend', 'Application', applicationId, { recommendation });
  return app;
}

export async function decide(
  actorId: string,
  applicationId: string,
  decision: 'approve' | 'reject',
  reason?: string,
  overrideQuota?: boolean,
) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { student: true, position: true, cycle: true },
  });
  if (!app) throw new HttpError(404, 'NOT_FOUND', 'Application not found');
  if (decision === 'reject') {
    if (!reason) throw new HttpError(400, 'VALIDATION', 'Rejection requires a reason');
    const updated = await prisma.application.update({
      where: { id: app.id },
      data: { status: 'rejected', reason, reviewerId: actorId },
    });
    await notify(app.studentId, 'placement_decision', 'Application rejected', reason, {}, { to: app.student.email, enabled: true });
    await audit(actorId, 'application.reject', 'Application', app.id, { reason });
    return { application: updated, placement: null };
  }

  const existing = await prisma.placement.findFirst({
    where: { studentId: app.studentId, cycleId: app.cycleId, status: { in: ['placed', 'approved'] } },
  });
  if (existing) throw new HttpError(409, 'ALREADY_PLACED', 'Student already placed this cycle');

  let organizationId = app.position?.organizationId;
  let positionId = app.positionId;
  if (app.type === 'propose') {
    const org = await prisma.organization.create({
      data: {
        name: app.proposedOrgName ?? 'Proposed organisation',
        sector: 'Proposed',
        address: app.proposedOrgAddress ?? '—',
        city: 'Jimma',
        contactName: app.proposedOrgContact ?? '—',
        contactEmail: app.student.email,
        contactPhone: app.student.phone ?? '—',
        description: 'Created from a student-proposed placement',
      },
    });
    const pos = await prisma.position.create({
      data: {
        organizationId: org.id,
        title: app.proposedRole ?? 'Intern',
        description: app.coverNote,
        quota: 1,
        isOpen: false,
      },
    });
    organizationId = org.id;
    positionId = pos.id;
  }
  if (!organizationId) throw new HttpError(400, 'VALIDATION', 'No organisation for this application');

  if (positionId) {
    const pos = await prisma.position.findUnique({ where: { id: positionId } });
    const filled = await prisma.placement.count({
      where: { positionId, status: { in: ['placed', 'approved'] } },
    });
    if (pos && filled >= pos.quota && !overrideQuota) {
      throw new HttpError(409, 'QUOTA_EXCEEDED', 'Position quota is full; coordinator may override');
    }
    if (pos && filled >= pos.quota && overrideQuota) {
      await audit(actorId, 'placement.quota_override', 'Position', positionId);
    }
  }

  const placement = await prisma.placement.create({
    data: {
      studentId: app.studentId,
      cycleId: app.cycleId,
      organizationId,
      positionId,
      startDate: app.cycle.internshipStart,
      endDate: app.cycle.internshipEnd,
      status: 'placed',
    },
  });
  await prisma.application.update({
    where: { id: app.id },
    data: { status: 'approved', reviewerId: actorId, reason: reason ?? null },
  });
  await generateWeeks(placement.id);
  const letter = await generateLetter(actorId, placement.id);
  await notify(
    app.studentId,
    'placement_decision',
    'Placement approved',
    `You have been placed. Download your placement letter from TrackBridge.`,
    { placementId: placement.id },
    { to: app.student.email, enabled: true },
  );
  await audit(actorId, 'application.approve', 'Placement', placement.id);
  return { application: app, placement: { ...placement, letterDocumentId: letter.id } };
}

export async function listPlacements(query: Record<string, unknown>, actor: { id: string; role: string }) {
  const { skip, take, page, pageSize } = parsePage(query);
  const where: Record<string, unknown> = {};
  if (actor.role === 'student') where.studentId = actor.id;
  if (query.status) where.status = query.status;
  if (query.organizationId) where.organizationId = query.organizationId;
  if (actor.role === 'advisor' || actor.role === 'internship_supervisor') {
    where.assignments = { some: { supervisorUserId: actor.id, endedAt: null } };
  }
  if (actor.role === 'host_organization') {
    const u = await prisma.user.findUnique({ where: { id: actor.id } });
    if (u?.organizationId) where.organizationId = u.organizationId;
  }
  const q = String(query.q || '').trim();
  if (q) {
    where.OR = [
      { student: { fullName: { contains: q, mode: 'insensitive' } } },
      { student: { studentId: { contains: q, mode: 'insensitive' } } },
    ];
  }
  const [items, total] = await Promise.all([
    prisma.placement.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        student: true,
        organization: true,
        position: true,
        assignments: { where: { endedAt: null }, include: { supervisor: true } },
      },
    }),
    prisma.placement.count({ where }),
  });
  return paginated(
    items.map((p) => ({
      id: p.id,
      studentId: p.studentId,
      studentName: p.student.fullName,
      studentNumber: p.student.studentId,
      cycleId: p.cycleId,
      organizationId: p.organizationId,
      organizationName: p.organization.name,
      positionId: p.positionId,
      positionTitle: p.position?.title ?? null,
      startDate: p.startDate.toISOString(),
      endDate: p.endDate.toISOString(),
      status: p.status,
      letterDocumentId: p.letterDocumentId,
      universitySupervisor: p.assignments
        .filter((a) => a.type === 'advisor')
        .map((a) => ({ id: a.supervisor.id, fullName: a.supervisor.fullName, email: a.supervisor.email, type: 'advisor' as const }))[0],
      hostSupervisor: p.assignments
        .filter((a) => a.type === 'internship')
        .map((a) => ({
          id: a.supervisor.id,
          fullName: a.supervisor.fullName,
          email: a.supervisor.email,
          type: 'internship' as const,
        }))[0],
    })),
    total,
    page,
    pageSize,
  );
}

export async function getPlacement(id: string) {
  const p = await prisma.placement.findUnique({
    where: { id },
    include: {
      student: true,
      organization: true,
      position: true,
      cycle: true,
      assignments: { where: { endedAt: null }, include: { supervisor: true } },
    },
  });
  if (!p) throw new HttpError(404, 'NOT_FOUND', 'Placement not found');
  return p;
}

export async function completeOrCancel(actorId: string, id: string, status: 'completed' | 'cancelled', reason: string) {
  const p = await prisma.placement.update({
    where: { id },
    data: { status, cancelReason: reason },
  });
  await audit(actorId, `placement.${status}`, 'Placement', id, { reason });
  return p;
}
