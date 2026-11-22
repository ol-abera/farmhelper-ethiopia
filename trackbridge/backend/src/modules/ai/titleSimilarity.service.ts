import { prisma } from '../../db/prisma.js';
import { aiPost } from './aiClient.js';
import { similarTitles } from '../../ai/matching.js';

export async function compareTitle(title: string, projectId?: string) {
  const existing = await prisma.project.findMany({
    where: {
      proposalStatus: { in: ['approved', 'submitted'] },
      ...(projectId ? { id: { not: projectId } } : {}),
    },
    include: { creator: true },
  });
  const corpus = existing.map((p) => ({
    id: p.id,
    title: p.title,
    creatorName: p.creator.fullName,
  }));
  const remote = await aiPost<{ items: { id?: string; title: string; score: number; advisory: string; creatorName?: string }[] }>(
    '/title-similarity',
    { title, corpus: corpus.map((c) => ({ id: c.id, title: c.title, creatorName: c.creatorName })) },
  );
  const items = remote?.items?.length
    ? remote.items.map((i) => ({
        projectId: i.id,
        title: i.title,
        score: i.score,
        advisory: i.advisory,
        creatorName: i.creatorName,
      }))
    : similarTitles(title, corpus, projectId);
  if (projectId) {
    await prisma.titleSimilarityHit.deleteMany({ where: { projectId } });
    if (items.length) {
      await prisma.titleSimilarityHit.createMany({
        data: items.map((i) => ({
          projectId,
          otherTitle: i.title,
          otherProjectId: i.projectId,
          score: i.score,
          advisory: i.advisory,
        })),
      });
    }
  }
  return { items, advisory: true, notPlagiarismVerdict: true };
}
