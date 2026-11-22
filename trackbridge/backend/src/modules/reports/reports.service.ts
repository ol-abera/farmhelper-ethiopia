import { prisma } from '../../db/prisma.js';
import { cbtpProgressData } from './cbtpReport.service.js';
import { internshipActivityData } from './internshipReport.service.js';
import { projectStatusData } from './projectReport.service.js';
import { delayedWorkData } from './delayedWorkReport.service.js';
import { cbtpProgressPdf } from '../../pdf/templates/cbtpProgress.js';
import { internshipActivityPdf } from '../../pdf/templates/internshipActivity.js';
import { projectStatusPdf } from '../../pdf/templates/projectStatus.js';
import { delayedWorkPdf } from '../../pdf/templates/delayedWork.js';
import { progressReportPdf } from '../../pdf/templates/progressReport.js';
import { listForPlacement } from '../logbooks/logbooks.service.js';
import { myProject } from '../projects/projects.service.js';
import { saveBuffer } from '../files/storage.local.js';

async function cycleTitle() {
  const c = await prisma.cycle.findFirst({ where: { isOpen: true } });
  return c?.title ?? 'Current period';
}

export async function reportPdf(kind: 'cbtp' | 'internship' | 'project' | 'delayed') {
  const title = await cycleTitle();
  if (kind === 'cbtp') {
    const rows = await cbtpProgressData();
    const lines = rows.map((r) => `${r.site} / ${r.group} — ${r.progress.percent}% (${r.progress.status}) members: ${r.members.join(', ')}`);
    return cbtpProgressPdf(lines, title);
  }
  if (kind === 'internship') {
    const rows = await internshipActivityData();
    const lines = rows.map((r) => `${r.student} @ ${r.organization} — present ${r.attendancePresent}, absent ${r.attendanceAbsent}, logbooks ${r.logbooksApproved}/${r.logbooksSubmitted}`);
    return internshipActivityPdf(lines, title);
  }
  if (kind === 'project') {
    const rows = await projectStatusData();
    const lines = rows.map((r) => `${r.student}: ${r.title} [${r.overallStatus}] sim ${r.maxSimilarity.toFixed(2)}`);
    return projectStatusPdf(lines, title);
  }
  const rows = await delayedWorkData();
  const lines = rows.map((r) => `${r.studentName}: ${r.reasons.join('; ')}`);
  return delayedWorkPdf(lines, title);
}

export async function studentPack(studentId: string) {
  const user = await prisma.user.findUnique({ where: { id: studentId } });
  const placement = await prisma.placement.findFirst({
    where: { studentId, status: 'placed' },
    include: { organization: true, position: true },
  });
  const weeks = placement ? await listForPlacement(placement.id) : [];
  const project = await myProject(studentId);
  const groups = await prisma.cbtpGroupMember.findMany({
    where: { studentId },
    include: { group: { include: { documents: true, activity: { include: { site: true } } } } },
  });
  const buf = await progressReportPdf({
    studentName: user?.fullName ?? '',
    studentId: user?.studentId ?? '',
    cycleTitle: await cycleTitle(),
    placement: placement ? `${placement.organization.name} / ${placement.position?.title}` : undefined,
    logbookLines: weeks.map((w) => `Week ${w.weekIndex}: ${w.displayStatus}`),
    projectLines: project ? [`${project.title} — ${project.overallStatus}`] : [],
    cbtpLines: groups.map((g) => `${g.group.activity.site.name} / ${g.group.name}: ${g.group.documents.length} documents`),
    outstanding: weeks.filter((w) => ['missing', 'late', 'returned'].includes(w.displayStatus)).map((w) => `Logbook week ${w.weekIndex}`),
  });
  const { storagePath } = await saveBuffer('progress.pdf', buf);
  await prisma.document.create({
    data: {
      type: 'progress_report',
      storagePath,
      originalName: `progress-${user?.studentId ?? studentId}.pdf`,
      mime: 'application/pdf',
      size: buf.length,
      uploadedBy: studentId,
    },
  });
  return buf;
}

export async function archiveSearch(q: string) {
  const projects = await prisma.project.findMany({
    where: { OR: [{ title: { contains: q, mode: 'insensitive' } }, { creator: { fullName: { contains: q, mode: 'insensitive' } } }] },
    include: { creator: true, cycle: true },
    take: 20,
  });
  const placements = await prisma.placement.findMany({
    where: {
      OR: [
        { student: { fullName: { contains: q, mode: 'insensitive' } } },
        { organization: { name: { contains: q, mode: 'insensitive' } } },
      ],
    },
    include: { student: true, organization: true, cycle: true },
    take: 20,
  });
  return { projects, placements };
}

export function toCsv(rows: object[]) {
  if (!rows.length) return 'none\n';
  const keys = Object.keys(rows[0] as object);
  const lines = [keys.join(','), ...rows.map((r) => keys.map((k) => JSON.stringify((r as Record<string, unknown>)[k] ?? '')).join(','))];
  return lines.join('\n');
}
