import type { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma.js';

export async function audit(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId?: string | null,
  metadata?: Prisma.InputJsonValue,
) {
  await prisma.auditEvent.create({
    data: { actorId, action, entityType, entityId: entityId ?? null, metadata: metadata ?? undefined },
  });
}
