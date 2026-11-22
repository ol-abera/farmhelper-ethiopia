import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { audit } from '../../audit/audit.service.js';
import { parsePage, paginated } from '../../utils/pagination.js';

export async function listSites(query: Record<string, unknown>) {
  const { skip, take, page, pageSize } = parsePage(query);
  const q = String(query.q || '').trim();
  const where = {
    archivedAt: query.archived ? undefined : null,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { community: { contains: q, mode: 'insensitive' as const } },
            { woreda: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.cbtpSite.findMany({ where, skip, take, orderBy: { name: 'asc' }, include: { activities: true } }),
    prisma.cbtpSite.count({ where }),
  ]);
  return paginated(items, total, page, pageSize);
}

export async function getSite(id: string) {
  const site = await prisma.cbtpSite.findUnique({
    where: { id },
    include: { activities: { include: { groups: { include: { members: true, advisor: true } } } } },
  });
  if (!site) throw new HttpError(404, 'NOT_FOUND', 'CBTP site not found');
  return site;
}

export async function createSite(actorId: string, data: Record<string, string>) {
  const site = await prisma.cbtpSite.create({
    data: {
      name: data.name,
      woreda: data.woreda,
      kebele: data.kebele,
      community: data.community,
      address: data.address,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      description: data.description,
    },
  });
  await audit(actorId, 'cbtp.site.create', 'CbtpSite', site.id);
  return site;
}

export async function updateSite(actorId: string, id: string, data: Record<string, string>) {
  const site = await prisma.cbtpSite.update({ where: { id }, data });
  await audit(actorId, 'cbtp.site.update', 'CbtpSite', id);
  return site;
}

export async function archiveSite(actorId: string, id: string) {
  const site = await prisma.cbtpSite.update({ where: { id }, data: { archivedAt: new Date() } });
  await audit(actorId, 'cbtp.site.archive', 'CbtpSite', id);
  return site;
}

export async function createActivity(actorId: string, siteId: string, data: Record<string, string>) {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  if (!cycle) throw new HttpError(400, 'CYCLE_CLOSED', 'No open academic period');
  const act = await prisma.cbtpActivity.create({
    data: {
      siteId,
      cycleId: cycle.id,
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: (data.status as 'planned') || 'planned',
    },
  });
  await audit(actorId, 'cbtp.activity.create', 'CbtpActivity', act.id);
  return act;
}
