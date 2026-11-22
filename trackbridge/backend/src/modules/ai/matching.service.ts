import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { aiPost } from './aiClient.js';
import { matchStudentToPositions, matchPositionToStudents } from '../../ai/matching.js';

export async function matchForStudent(studentId: string) {
  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student || student.role !== 'student') throw new HttpError(404, 'NOT_FOUND', 'Student not found');
  const positions = await prisma.position.findMany({
    where: { isOpen: true, organization: { archivedAt: null } },
    include: { organization: true },
  });
  const payload = {
    query: `${student.skills ?? ''} ${student.interests ?? ''} ${student.department ?? ''}`,
    items: positions.map((p) => ({
      id: p.id,
      text: `${p.title} ${p.requiredSkills ?? ''} ${p.description}`,
      label: `${p.title} · ${p.organization.name}`,
      extra: { organizationName: p.organization.name, openTo: p.openTo?.toISOString() },
    })),
  };
  const remote = await aiPost<{ items: { id: string; score: number; label?: string }[] }>('/match', payload);
  if (remote?.items) {
    return remote.items.map((i) => {
      const p = positions.find((x) => x.id === i.id);
      return {
        id: i.id,
        label: i.label ?? p?.title,
        score: i.score,
        reasons: ['TF-IDF cosine similarity on skills/interests vs opportunity text'],
        organizationName: p?.organization.name,
      };
    });
  }
  return matchStudentToPositions(
    {
      id: student.id,
      fullName: student.fullName,
      skills: student.skills ?? '',
      interests: student.interests ?? '',
      department: student.department ?? '',
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

export async function matchForOpportunity(opportunityId: string) {
  const pos = await prisma.position.findUnique({ where: { id: opportunityId }, include: { organization: true } });
  if (!pos) throw new HttpError(404, 'NOT_FOUND', 'Opportunity not found');
  const students = await prisma.user.findMany({
    where: { role: 'student', isActive: true, approvedAt: { not: null } },
  });
  const remote = await aiPost<{ items: { id: string; score: number }[] }>('/match', {
    query: `${pos.title} ${pos.requiredSkills ?? ''} ${pos.description}`,
    items: students.map((s) => ({
      id: s.id,
      text: `${s.skills ?? ''} ${s.interests ?? ''} ${s.department ?? ''}`,
      label: s.fullName,
    })),
  });
  if (remote?.items) {
    return remote.items.map((i) => {
      const s = students.find((x) => x.id === i.id);
      return { id: i.id, label: s?.fullName, score: i.score, reasons: ['TF-IDF cosine similarity'] };
    });
  }
  return matchPositionToStudents(
    {
      id: pos.id,
      title: pos.title,
      description: pos.description,
      requiredSkills: pos.requiredSkills ?? '',
      openTo: pos.openTo,
      organizationName: pos.organization.name,
    },
    students.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      skills: s.skills ?? '',
      interests: s.interests ?? '',
      department: s.department ?? '',
    })),
  );
}
