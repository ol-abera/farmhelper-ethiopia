import { prisma } from '../../db/prisma.js';
import { notify } from './notifications.service.js';
import { audit } from '../../audit/audit.service.js';
import type { Role } from '@trackbridge/shared';

export async function announce(actorId: string, data: { audience: string; title: string; body: string }) {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  if (!cycle) return null;
  const row = await prisma.announcement.create({
    data: { cycleId: cycle.id, authorId: actorId, ...data },
  });
  const where = data.audience === 'all' ? { cycleId: cycle.id, isActive: true } : { cycleId: cycle.id, role: data.audience as Role, isActive: true };
  const users = await prisma.user.findMany({ where });
  for (const u of users) {
    await notify(u.id, 'announcement', data.title, data.body);
  }
  await audit(actorId, 'announcement', 'Announcement', row.id);
  return row;
}
