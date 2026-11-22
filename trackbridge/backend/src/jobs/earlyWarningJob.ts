import { computeWarnings } from '../modules/ai/earlyWarning.service.js';
import { prisma } from '../db/prisma.js';
import { notify } from '../modules/communications/notifications.service.js';

export async function runEarlyWarnings() {
  const hits = await computeWarnings();
  const coordinators = await prisma.user.findMany({ where: { role: { in: ['coordinator', 'administrator'] }, isActive: true } });
  for (const h of hits) {
    const existing = await prisma.earlyWarning.findFirst({
      where: { studentId: h.studentId, resolvedAt: null, type: h.types[0] },
    });
    if (!existing) {
      await prisma.earlyWarning.create({
        data: { studentId: h.studentId, type: h.types[0] || 'inactivity', message: h.reasons.join('; '), reasons: h.reasons },
      });
      for (const c of coordinators) {
        await notify(c.id, 'early_warning', `Early warning: ${h.studentName}`, h.reasons.join('; '));
      }
    }
  }
  return hits.length;
}
