import { prisma } from '../../db/prisma.js';
import { addDays, dueAtForWeek } from '../../utils/dates.js';

export async function generateWeeks(placementId: string) {
  const placement = await prisma.placement.findUnique({
    where: { id: placementId },
    include: { cycle: true },
  });
  if (!placement) return [];
  const start = new Date(placement.cycle.internshipStart);
  const end = new Date(placement.cycle.internshipEnd);
  const weekday = placement.cycle.logbookDueWeekday;
  const existing = await prisma.logbookWeek.count({ where: { placementId } });
  if (existing) {
    return prisma.logbookWeek.findMany({ where: { placementId }, orderBy: { weekIndex: 'asc' } });
  }
  const rows = [];
  let cursor = new Date(start);
  let index = 1;
  while (cursor <= end) {
    const periodStart = new Date(cursor);
    const periodEnd = addDays(periodStart, 6);
    rows.push({
      placementId,
      weekIndex: index,
      periodStart,
      periodEnd: periodEnd > end ? end : periodEnd,
      dueAt: dueAtForWeek(periodEnd > end ? end : periodEnd, weekday),
    });
    cursor = addDays(cursor, 7);
    index += 1;
  }
  await prisma.logbookWeek.createMany({ data: rows });
  return prisma.logbookWeek.findMany({ where: { placementId }, orderBy: { weekIndex: 'asc' } });
}
