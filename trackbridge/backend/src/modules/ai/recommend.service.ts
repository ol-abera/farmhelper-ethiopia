import { prisma } from '../../db/prisma.js';
import { aiPost } from './aiClient.js';
import { matchStudentToPositions } from '../../ai/matching.js';

export async function recommendForStudent(studentId: string) {
  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student) return [];
  const positions = await prisma.position.findMany({
    where: { isOpen: true },
    include: { organization: true },
  });
  const fills = await prisma.placement.groupBy({
    by: ['positionId'],
    where: { status: { in: ['placed', 'approved'] } },
    _count: true,
  });
  const fillMap = new Map(fills.map((f) => [f.positionId, f._count]));
  const remote = await aiPost<{
    items: { id: string; combinedScore: number; matchScore: number; urgencyBoost: number; reasons?: string[]; label?: string }[];
  }>('/recommend', {
    query: `${student.skills ?? ''} ${student.interests ?? ''}`,
    items: positions.map((p) => ({
      id: p.id,
      text: `${p.title} ${p.requiredSkills ?? ''} ${p.description}`,
      label: p.title,
      openTo: p.openTo?.toISOString(),
      remainingQuota: Math.max(0, p.quota - (fillMap.get(p.id) ?? 0)),
    })),
  });
  if (remote?.items) return remote.items;
  return matchStudentToPositions(
    {
      id: student.id,
      fullName: student.fullName,
      skills: student.skills ?? '',
      interests: student.interests ?? '',
    },
    positions.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      requiredSkills: p.requiredSkills ?? '',
      openTo: p.openTo,
      organizationName: p.organization.name,
    })),
  );
}
