import { prisma } from '../../db/prisma.js';
import { placementLetterPdf } from '../../pdf/templates/placementLetter.js';
import { saveBuffer } from '../files/storage.local.js';
import { HttpError } from '../../middleware/errorHandler.js';

export async function generateLetter(actorId: string, placementId: string) {
  const p = await prisma.placement.findUnique({
    where: { id: placementId },
    include: { student: true, organization: true, position: true, cycle: true },
  });
  if (!p) throw new HttpError(404, 'NOT_FOUND', 'Placement not found');
  const buf = await placementLetterPdf({
    studentName: p.student.fullName,
    studentId: p.student.studentId ?? '—',
    organization: p.organization.name,
    position: p.position?.title ?? 'Intern',
    startDate: p.startDate.toISOString().slice(0, 10),
    endDate: p.endDate.toISOString().slice(0, 10),
    cycleTitle: p.cycle.title,
  });
  const { storagePath } = await saveBuffer('placement-letter.pdf', buf);
  const doc = await prisma.document.create({
    data: {
      type: 'placement_letter',
      storagePath,
      originalName: `placement-${p.student.studentId ?? p.studentId}.pdf`,
      mime: 'application/pdf',
      size: buf.length,
      uploadedBy: actorId,
    },
  });
  await prisma.placement.update({
    where: { id: placementId },
    data: { letterDocumentId: doc.id },
  });
  return doc;
}
