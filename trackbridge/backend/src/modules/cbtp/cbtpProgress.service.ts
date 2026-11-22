export function cbtpProgress(requiredKinds: string[], docs: { docKind: string; status: string; dueAt?: Date | null }[], now = new Date()) {
  const required = requiredKinds.length ? requiredKinds : ['needs_assessment', 'action_plan', 'progress_report', 'final_report'];
  const approved = required.filter((k) => docs.some((d) => d.docKind === k && d.status === 'approved'));
  const percent = Math.round((approved.length / required.length) * 100);
  const behind = required.some((k) => {
    const d = docs.find((x) => x.docKind === k);
    if (d?.status === 'approved') return false;
    if (d?.dueAt && d.dueAt < now) return true;
    return false;
  });
  let status: 'not_started' | 'in_progress' | 'behind' | 'completed' = 'not_started';
  if (percent === 100) status = 'completed';
  else if (behind) status = 'behind';
  else if (approved.length || docs.some((d) => d.status === 'submitted')) status = 'in_progress';
  return { percent, status, required, approvedKinds: approved };
}
