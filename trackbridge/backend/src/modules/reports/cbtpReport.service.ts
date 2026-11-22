import { prisma } from '../../db/prisma.js';
import { cbtpProgress } from '../cbtp/cbtpProgress.service.js';

export async function cbtpProgressData() {
  const groups = await prisma.cbtpGroup.findMany({
    include: { members: { include: { student: true } }, documents: true, activity: { include: { site: true } }, advisor: true },
  });
  return groups.map((g) => ({
    group: g.name,
    site: g.activity.site.name,
    advisor: g.advisor?.fullName,
    members: g.members.map((m) => m.student.fullName),
    progress: cbtpProgress(
      ['needs_assessment', 'action_plan', 'progress_report', 'final_report'],
      g.documents.map((d) => ({ docKind: d.docKind, status: d.status })),
    ),
  }));
}
