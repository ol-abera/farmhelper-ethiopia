import { prisma } from '../db/prisma.js';
import { notify } from '../modules/communications/notifications.service.js';
import { logger } from '../config/logger.js';

function key(kind: string, entityId: string, day: string) {
  return `${kind}:${entityId}:${day}`;
}

export async function runReminders() {
  const day = new Date().toISOString().slice(0, 10);
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  if (!cycle) return;
  const soon = new Date(Date.now() + 36 * 3600 * 1000);
  const weeks = await prisma.logbookWeek.findMany({
    where: { dueAt: { lte: soon, gte: new Date() }, entry: null },
    include: { placement: { include: { student: true } } },
  });
  for (const w of weeks) {
    const reminderKey = key('logbook_due', w.id, day);
    const exists = await prisma.reminderLog.findUnique({
      where: { reminderKey_userId_channel: { reminderKey, userId: w.placement.studentId, channel: 'in_app' } },
    });
    if (exists) continue;
    await notify(w.placement.studentId, 'reminder', 'Logbook due soon', `Week ${w.weekIndex} is due.`);
    await prisma.reminderLog.create({
      data: { reminderKey, userId: w.placement.studentId, channel: 'in_app', success: true },
    });
  }
  logger.info({ count: weeks.length }, 'reminders processed');
}
