import { prisma } from '../../db/prisma.js';

export async function rubricsForCycle(cycleId: string) {
  return prisma.rubric.findMany({ where: { cycleId } });
}
