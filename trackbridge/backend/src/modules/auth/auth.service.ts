import { prisma } from '../../db/prisma.js';
import { env } from '../../config/env.js';
import { REFRESH_COOKIE } from '../../config/constants.js';
import { hashPassword, verifyPassword, randomToken, sha256 } from '../../utils/crypto.js';
import { signAccess, signRefresh, verifyRefresh } from './jwt.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { sendMail } from '../../mail/send.js';
import type { Role } from '@trackbridge/shared';
import type { Response } from 'express';

export function toUserDto(u: {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  studentId: string | null;
  phone: string | null;
  department: string | null;
  skills?: string | null;
  interests?: string | null;
  isActive: boolean;
  approvedAt: Date | null;
  organizationId: string | null;
  cycleId: string | null;
  emailRemindersEnabled: boolean;
  coordinatorFlagAtRisk: boolean;
}) {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    studentId: u.studentId,
    phone: u.phone,
    department: u.department,
    skills: u.skills ?? null,
    interests: u.interests ?? null,
    isActive: u.isActive,
    approved: Boolean(u.approvedAt),
    organizationId: u.organizationId,
    cycleId: u.cycleId,
    emailRemindersEnabled: u.emailRemindersEnabled,
    coordinatorFlagAtRisk: u.coordinatorFlagAtRisk,
  };
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: Boolean(env.COOKIE_SECURE),
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 3600 * 1000,
  });
}

async function issueTokens(
  res: Response,
  user: { id: string; role: Role; email: string; fullName: string },
) {
  const jti = randomToken(16);
  const refresh = signRefresh({ sub: user.id, jti });
  const access = signAccess({
    sub: user.id,
    role: user.role,
    email: user.email,
    fullName: user.fullName,
  });
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      hashedToken: sha256(refresh),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    },
  });
  setRefreshCookie(res, refresh);
  return access;
}

export async function register(input: {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
  department: string;
  phone?: string;
  skills?: string;
  interests?: string;
}) {
  const email = input.email.toLowerCase();
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { studentId: input.studentId }] },
  });
  if (existing) throw new HttpError(409, 'CONFLICT', 'Email or student ID already registered');
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      studentId: input.studentId,
      email,
      passwordHash: await hashPassword(input.password),
      role: 'student',
      department: input.department,
      phone: input.phone,
      skills: input.skills,
      interests: input.interests,
      cycleId: cycle?.id,
      approvedAt: null,
    },
  });
  await audit(user.id, 'register', 'User', user.id);
  return toUserDto(user);
}

export async function login(res: Response, email: string, password: string, ip?: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    await audit(null, 'login_failure', 'User', email, { ip });
    throw new HttpError(401, 'UNAUTHENTICATED', 'Invalid email or password');
  }
  if (!user.isActive) throw new HttpError(403, 'ACCOUNT_INACTIVE', 'Account is deactivated');
  if (user.role === 'student' && !user.approvedAt) {
    throw new HttpError(403, 'ACCOUNT_PENDING', 'Your registration is waiting for coordinator approval');
  }
  const accessToken = await issueTokens(res, user);
  await audit(user.id, 'login_success', 'User', user.id, { ip });
  return { user: toUserDto(user), accessToken };
}

export async function refresh(res: Response, cookie?: string) {
  if (!cookie) throw new HttpError(401, 'UNAUTHENTICATED', 'No refresh token');
  let payload: { sub: string; jti: string };
  try {
    payload = verifyRefresh(cookie);
  } catch {
    throw new HttpError(401, 'UNAUTHENTICATED', 'Invalid refresh token');
  }
  const hashed = sha256(cookie);
  const row = await prisma.refreshToken.findFirst({
    where: { userId: payload.sub, hashedToken: hashed, revokedAt: null },
  });
  if (!row || row.expiresAt < new Date()) {
    throw new HttpError(401, 'UNAUTHENTICATED', 'Refresh token expired');
  }
  await prisma.refreshToken.update({ where: { id: row.id }, data: { revokedAt: new Date() } });
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) throw new HttpError(401, 'UNAUTHENTICATED', 'Account unavailable');
  const accessToken = await issueTokens(res, user);
  return { user: toUserDto(user), accessToken };
}

export async function logout(res: Response, cookie?: string, userId?: string) {
  if (cookie) {
    await prisma.refreshToken.updateMany({
      where: { hashedToken: sha256(cookie) },
      data: { revokedAt: new Date() },
    });
  } else if (userId) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return;
  const token = randomToken(24);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetTokenHash: sha256(token),
      passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  await sendMail(
    user.email,
    'Reset your TrackBridge password',
    `Reset link (valid 1 hour): ${env.APP_URL}/reset-password?token=${token}`,
  );
}

export async function resetPassword(token: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: sha256(token),
      passwordResetExpiresAt: { gt: new Date() },
    },
  });
  if (!user) throw new HttpError(400, 'VALIDATION', 'Reset link is invalid or expired');
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      passwordResetTokenHash: null,
      passwordResetExpiresAt: null,
    },
  });
  await prisma.refreshToken.updateMany({
    where: { userId: user.id },
    data: { revokedAt: new Date() },
  });
}
