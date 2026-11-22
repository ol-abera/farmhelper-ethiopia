import { prisma } from '../../db/prisma.js';
import { overallStatus } from '../projects/progress.service.js';

export async function projectStatusData() {
  const projects = await prisma.project.findMany({
    include: { creator: true, tasks: true, milestones: true, similarityHits: true },
  });
  return projects.map((p) => ({
    title: p.title,
    student: p.creator.fullName,
    proposalStatus: p.proposalStatus,
    maxSimilarity: Math.max(0, ...p.similarityHits.map((h) => h.score)),
    ...overallStatus({ tasks: p.tasks, milestones: p.milestones }),
  }));
}
