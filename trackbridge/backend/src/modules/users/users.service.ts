import type { Role } from '@trackbridge/shared';
import { prisma } from '../../db/prisma.js';
import { hashPassword } from '../../utils/crypto.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { notify } from '../communications/notifications.service.js';
import { toUserDto } from '../auth/auth.service.js';
import { env } from '../../config/env.js';
import { parsePage, paginated } from '../../utils/pagination.js';

export async function listUsers(query: Record<string, unknown>) {
  const { skip, take, page, pageSize } = parsePage(query);
  const role = query.role as Role | undefined;
  const q = String(query.q || '').trim();
  const pending = query.pending === 'true';
  const where = {
    ...(role ? { role } : {}),
    ...(pending ? { role: 'student' as const, approvedAt: null } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
            { studentId: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, skip, take, orderBy: { fullName: 'asc' } }),
    prisma.user.count({ where }),
  ]);
  return paginated(items.map(toUserDto), total, page, pageSize);
}

export async function createUser(actorId: string, body: {
  fullName: string;
  email: string;
  role: Role;
  password?: string;
  studentId?: string;
  department?: string;
  phone?: string;
  organizationId?: string;
  cycleId?: string;
  skills?: string;
  interests?: string;
}) {
  if (body.role === 'administrator') {
    const actor = await prisma.user.findUnique({ where: { id: actorId } });
    if (actor?.role !== 'administrator') {
      throw new HttpError(403, 'FORBIDDEN', 'Only an administrator can create administrator accounts');
    }
  }
  const email = body.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new HttpError(409, 'CONFLICT', 'Email already in use');
  const password = body.password || env.SEED_PASSWORD;
  const user = await prisma.user.create({
    data: {
      fullName: body.fullName,
      email,
      role: body.role,
      passwordHash: await hashPassword(password),
      studentId: body.studentId,
      department: body.department,
      phone: body.phone,
      organizationId: body.organizationId,
      cycleId: body.cycleId,
      skills: body.skills,
      interests: body.interests,
      approvedAt: new Date(),
    },
  });
  await audit(actorId, 'user.create', 'User', user.id, { role: body.role });
  await notify(
    user.id,
    'account',
    'Account created',
    `An account was created for you as ${body.role}. Sign in with ${email}.`,
    {},
    { to: email, enabled: true },
  );
  return toUserDto(user);
}

export async function setActive(actorId: string, userId: string, isActive: boolean) {
  const user = await prisma.user.update({ where: { id: userId }, data: { isActive } });
  await audit(actorId, isActive ? 'user.activate' : 'user.deactivate', 'User', userId);
  return toUserDto(user);
}

export async function approveStudent(actorId: string, userId: string, cycleId?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== 'student') throw new HttpError(404, 'NOT_FOUND', 'Student not found');
  const cycle = cycleId
    ? await prisma.cycle.findUnique({ where: { id: cycleId } })
    : await prisma.cycle.findFirst({ where: { isOpen: true } });
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { approvedAt: new Date(), cycleId: cycle?.id ?? user.cycleId },
  });
  await audit(actorId, 'user.approve', 'User', userId);
  await notify(
    userId,
    'account_approved',
    'Registration approved',
    'Your TrackBridge account has been approved. You can now sign in.',
    {},
    { to: user.email, enabled: true },
  );
  return toUserDto(updated);
}

export async function updateProfile(userId: string, body: {
  fullName?: string;
  phone?: string;
  department?: string;
  skills?: string;
  interests?: string;
  emailRemindersEnabled?: boolean;
  password?: string;
}) {
  const data: Record<string, unknown> = { ...body };
  if (body.password) {
    data.passwordHash = await hashPassword(body.password);
    delete data.password;
  }
  const user = await prisma.user.update({ where: { id: userId }, data });
  return toUserDto(user);
}

export async function flagAtRisk(actorId: string, userId: string, flagged: boolean) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { coordinatorFlagAtRisk: flagged },
  });
  await audit(actorId, flagged ? 'user.flag_risk' : 'user.unflag_risk', 'User', userId);
  return toUserDto(user);
}

export async function assignCycle(actorId: string, userId: string, cycleId: string) {
  const placement = await prisma.placement.findFirst({
    where: { studentId: userId, status: { in: ['placed', 'approved'] } },
  });
  if (placement) throw new HttpError(409, 'CONFLICT', 'Cannot move a placed student to another cycle');
  const user = await prisma.user.update({ where: { id: userId }, data: { cycleId } });
  await audit(actorId, 'user.assign_cycle', 'User', userId, { cycleId });
  return toUserDto(user);
}

export async function listAudit(query: Record<string, unknown>) {
  const { skip, take, page, pageSize } = parsePage(query);
  const [items, total] = await Promise.all([
    prisma.auditEvent.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { fullName: true, email: true, role: true } } },
    }),
    prisma.auditEvent.count(),
  ]);
  return paginated(items, total, page, pageSize);
}
