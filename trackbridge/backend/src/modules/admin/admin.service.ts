import { prisma } from '../../db/prisma.js';
import { audit } from '../../audit/audit.service.js';
import { HttpError } from '../../middleware/errorHandler.js';
import type { Role } from '@trackbridge/shared';

export async function setRole(actorId: string, userId: string, role: Role) {
  const actor = await prisma.user.findUnique({ where: { id: actorId } });
  if (role === 'administrator' && actor?.role !== 'administrator') {
    throw new HttpError(403, 'FORBIDDEN', 'Only an administrator can grant administrator');
  }
  const user = await prisma.user.update({ where: { id: userId }, data: { role } });
  await audit(actorId, 'user.role_change', 'User', userId, { role });
  return user;
}

export async function getConfig() {
  const rows = await prisma.systemConfig.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function putConfig(actorId: string, key: string, value: unknown) {
  const row = await prisma.systemConfig.upsert({
    where: { key },
    create: { key, value: value as object },
    update: { value: value as object },
  });
  await audit(actorId, 'config.update', 'SystemConfig', key, value as object);
  return row;
}
