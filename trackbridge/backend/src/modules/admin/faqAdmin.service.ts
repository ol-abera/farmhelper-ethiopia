import { prisma } from '../../db/prisma.js';
import { audit } from '../../audit/audit.service.js';

export async function listFaq(includeDrafts = false) {
  return prisma.faqEntry.findMany({
    where: includeDrafts ? {} : { approved: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createFaq(actorId: string, data: { question: string; answer: string; tags?: string; audience?: string }) {
  const row = await prisma.faqEntry.create({
    data: { question: data.question, answer: data.answer, tags: data.tags ?? '', audience: data.audience ?? 'all', approved: false },
  });
  await audit(actorId, 'faq.create', 'FaqEntry', row.id);
  return row;
}

export async function publishFaq(actorId: string, id: string, approved = true) {
  const row = await prisma.faqEntry.update({ where: { id }, data: { approved } });
  await audit(actorId, approved ? 'faq.publish' : 'faq.unpublish', 'FaqEntry', id);
  return row;
}
