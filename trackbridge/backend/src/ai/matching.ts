import { rankSimilar } from './tfidf.js';

export type MatchableStudent = {
  id: string;
  fullName: string;
  skills: string;
  interests: string;
  department?: string;
};

export type MatchablePosition = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string;
  openTo: Date | null;
  organizationName?: string;
};

function studentText(s: MatchableStudent) {
  return `${s.skills} ${s.interests} ${s.department ?? ''}`.trim();
}

function positionText(p: MatchablePosition) {
  return `${p.title} ${p.requiredSkills} ${p.description}`;
}

function urgencyBoost(openTo: Date | null, now = new Date()) {
  if (!openTo) return { boost: 0, reason: 'No application deadline set' };
  const days = Math.ceil((openTo.getTime() - now.getTime()) / 86400000);
  if (days < 0) return { boost: 0, reason: 'Deadline has passed' };
  if (days <= 3) return { boost: 0.18, reason: `Deadline in ${days} day(s) — high urgency` };
  if (days <= 7) return { boost: 0.12, reason: `Deadline in ${days} days — rising urgency` };
  if (days <= 14) return { boost: 0.06, reason: `Deadline in ${days} days` };
  return { boost: 0, reason: `Deadline in ${days} days` };
}

export function matchStudentToPositions(student: MatchableStudent, positions: MatchablePosition[]) {
  const docs = positions.map((p) => ({ id: p.id, text: positionText(p) }));
  const ranked = rankSimilar(studentText(student) || student.fullName, docs);
  const byId = new Map(positions.map((p) => [p.id, p]));
  return ranked.map((r) => {
    const p = byId.get(r.id)!;
    const urg = urgencyBoost(p.openTo);
    const combined = Math.min(1, r.score + urg.boost);
    const reasons = [
      `Skill/interest overlap score ${(r.score * 100).toFixed(0)}%`,
      urg.reason,
      p.organizationName ? `Host: ${p.organizationName}` : '',
    ].filter(Boolean);
    return {
      positionId: p.id,
      title: p.title,
      organizationName: p.organizationName,
      matchScore: Number(r.score.toFixed(4)),
      urgencyBoost: urg.boost,
      combinedScore: Number(combined.toFixed(4)),
      reasons,
    };
  });
}

export function matchPositionToStudents(position: MatchablePosition, students: MatchableStudent[]) {
  const docs = students.map((s) => ({ id: s.id, text: studentText(s) }));
  const ranked = rankSimilar(positionText(position), docs);
  const byId = new Map(students.map((s) => [s.id, s]));
  const urg = urgencyBoost(position.openTo);
  return ranked.map((r) => {
    const s = byId.get(r.id)!;
    const combined = Math.min(1, r.score + urg.boost);
    return {
      studentId: s.id,
      fullName: s.fullName,
      matchScore: Number(r.score.toFixed(4)),
      urgencyBoost: urg.boost,
      combinedScore: Number(combined.toFixed(4)),
      reasons: [
        `Profile overlap ${(r.score * 100).toFixed(0)}%`,
        urg.reason,
        s.skills ? `Skills: ${s.skills}` : '',
      ].filter(Boolean),
    };
  });
}

export function similarTitles(
  title: string,
  existing: { id: string; title: string; creatorName?: string }[],
  excludeId?: string,
) {
  const docs = existing
    .filter((p) => p.id !== excludeId)
    .map((p) => ({ id: p.id, text: p.title }));
  const ranked = rankSimilar(title, docs, 0);
  const byId = new Map(existing.map((p) => [p.id, p]));
  return ranked.slice(0, 8).map((r) => ({
    projectId: r.id,
    title: byId.get(r.id)?.title ?? '',
    creatorName: byId.get(r.id)?.creatorName,
    score: r.score,
    advisory:
      r.score >= 0.72
        ? 'High overlap — review before approving; this is not a plagiarism verdict.'
        : r.score >= 0.45
          ? 'Moderate overlap — consider whether the topics differ enough.'
          : 'Low overlap.',
  }));
}
