import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { parsePage, paginated } from '../../utils/pagination.js';

export async function listOrgs(query: Record<string, unknown>, includeArchived = false) {
  const { skip, take, page, pageSize } = parsePage(query);
  const q = String(query.q || '').trim();
  const where = {
    ...(includeArchived ? {} : { archivedAt: null }),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { city: { contains: q, mode: 'insensitive' as const } },
            { sector: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.organization.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
    prisma.organization.count({ where }),
  ]);
  return paginated(items, total, page, pageSize);
}

export async function getOrg(id: string) {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: { positions: true },
  });
  if (!org) throw new HttpError(404, 'NOT_FOUND', 'Organization not found');
  const filled = await prisma.placement.groupBy({
    by: ['positionId'],
    where: { organizationId: id, status: { in: ['placed', 'approved'] } },
    _count: true,
  });
  const fillMap = new Map(filled.map((f) => [f.positionId, f._count]));
  return {
    ...org,
    positions: org.positions.map((p) => ({ ...p, filled: fillMap.get(p.id) ?? 0 })),
  };
}

export async function createOrg(actorId: string, data: Record<string, unknown>) {
  const org = await prisma.organization.create({
    data: {
      name: String(data.name),
      sector: String(data.sector),
      address: String(data.address),
      city: String(data.city),
      contactName: String(data.contactName),
      contactEmail: String(data.contactEmail),
      contactPhone: String(data.contactPhone),
      description: data.description ? String(data.description) : null,
    },
  });
  await audit(actorId, 'org.create', 'Organization', org.id);
  return org;
}

export async function updateOrg(actorId: string, id: string, data: Record<string, unknown>) {
  const org = await prisma.organization.update({
    where: { id },
    data: {
      name: data.name ? String(data.name) : undefined,
      sector: data.sector ? String(data.sector) : undefined,
      address: data.address ? String(data.address) : undefined,
      city: data.city ? String(data.city) : undefined,
      contactName: data.contactName ? String(data.contactName) : undefined,
      contactEmail: data.contactEmail ? String(data.contactEmail) : undefined,
      contactPhone: data.contactPhone ? String(data.contactPhone) : undefined,
      description: data.description !== undefined ? String(data.description) : undefined,
    },
  });
  await audit(actorId, 'org.update', 'Organization', id);
  return org;
}

export async function archiveOrg(actorId: string, id: string) {
  const org = await prisma.organization.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
  await audit(actorId, 'org.archive', 'Organization', id);
  return org;
}

export async function createPosition(actorId: string, organizationId: string, data: Record<string, unknown>) {
  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!org || org.archivedAt) throw new HttpError(404, 'NOT_FOUND', 'Organization not available');
  const pos = await prisma.position.create({
    data: {
      organizationId,
      title: String(data.title),
      description: String(data.description),
      requiredSkills: data.requiredSkills ? String(data.requiredSkills) : null,
      quota: Number(data.quota ?? 1),
      notes: data.notes ? String(data.notes) : null,
      isOpen: data.isOpen !== false,
      openFrom: data.openFrom ? new Date(String(data.openFrom)) : null,
      openTo: data.openTo ? new Date(String(data.openTo)) : null,
    },
  });
  await audit(actorId, 'position.create', 'Position', pos.id);
  return pos;
}

export async function updatePosition(actorId: string, id: string, data: Record<string, unknown>) {
  const pos = await prisma.position.update({
    where: { id },
    data: {
      title: data.title ? String(data.title) : undefined,
      description: data.description ? String(data.description) : undefined,
      requiredSkills: data.requiredSkills !== undefined ? String(data.requiredSkills) : undefined,
      quota: data.quota !== undefined ? Number(data.quota) : undefined,
      notes: data.notes !== undefined ? String(data.notes) : undefined,
      isOpen: data.isOpen !== undefined ? Boolean(data.isOpen) : undefined,
      openFrom: data.openFrom ? new Date(String(data.openFrom)) : undefined,
      openTo: data.openTo ? new Date(String(data.openTo)) : undefined,
    },
  });
  await audit(actorId, 'position.update', 'Position', id);
  return pos;
}

export async function listOpenPositions(query: Record<string, unknown>) {
  const { skip, take, page, pageSize } = parsePage(query);
  const where = { isOpen: true, organization: { archivedAt: null } };
  const [items, total] = await Promise.all([
    prisma.position.findMany({
      where,
      skip,
      take,
      include: { organization: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.position.count({ where }),
  ]);
  const ids = items.map((p) => p.id);
  const fills = ids.length
    ? await prisma.placement.groupBy({
        by: ['positionId'],
        where: { positionId: { in: ids }, status: { in: ['placed', 'approved'] } },
        _count: true,
      })
    : [];
  const fillMap = new Map(fills.map((f) => [f.positionId, f._count]));
  return paginated(
    items.map((p) => ({
      id: p.id,
      organizationId: p.organizationId,
      organizationName: p.organization.name,
      title: p.title,
      description: p.description,
      requiredSkills: p.requiredSkills,
      quota: p.quota,
      filled: fillMap.get(p.id) ?? 0,
      notes: p.notes,
      isOpen: p.isOpen,
      openFrom: p.openFrom,
      openTo: p.openTo,
    })),
    total,
    page,
    pageSize,
  );
}
