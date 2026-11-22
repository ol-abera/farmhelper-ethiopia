import { AT_RISK_DEFAULTS } from '@trackbridge/shared';

export type WarningInput = {
  studentId: string;
  studentName: string;
  studentNumber: string | null;
  lateOrMissingLogbooks: number;
  projectBehind: boolean;
  daysSinceActivity: number | null;
  cbtpOverdue: boolean;
  attendanceGaps: number;
  evaluationClosingSoonWithoutForm: boolean;
  coordinatorFlag: boolean;
  overdueMilestones: number;
};

export type WarningHit = {
  studentId: string;
  studentName: string;
  studentNumber: string | null;
  reasons: string[];
  types: string[];
};

export function evaluateEarlyWarnings(
  rows: WarningInput[],
  thresholds = AT_RISK_DEFAULTS,
): WarningHit[] {
  const hits: WarningHit[] = [];
  for (const r of rows) {
    const reasons: string[] = [];
    const types: string[] = [];
    if (r.lateOrMissingLogbooks >= thresholds.lateOrMissingWeeks) {
      reasons.push(
        `${r.lateOrMissingLogbooks} logbook week(s) late or missing (threshold ${thresholds.lateOrMissingWeeks})`,
      );
      types.push('late_logbook');
    }
    if (r.projectBehind) {
      reasons.push('Technical project is behind schedule');
      types.push('missed_deadline');
    }
    if (r.overdueMilestones > 0) {
      reasons.push(`${r.overdueMilestones} overdue project milestone(s)`);
      types.push('overdue_milestone');
    }
    if (r.daysSinceActivity != null && r.daysSinceActivity >= thresholds.inactivityDays) {
      reasons.push(`No recorded activity for ${r.daysSinceActivity} days`);
      types.push('inactivity');
    }
    if (r.cbtpOverdue) {
      reasons.push('CBTP document or activity is overdue');
      types.push('cbtp_overdue');
    }
    if (r.attendanceGaps >= thresholds.attendanceGapDays) {
      reasons.push(`${r.attendanceGaps} internship attendance gap(s)`);
      types.push('attendance_gap');
    }
    if (r.evaluationClosingSoonWithoutForm) {
      reasons.push('Evaluation window closing with no advisor form submitted');
      types.push('missed_deadline');
    }
    if (r.coordinatorFlag) {
      reasons.push('Flagged by the coordinator');
      types.push('coordinator_flag');
    }
    if (reasons.length) {
      hits.push({
        studentId: r.studentId,
        studentName: r.studentName,
        studentNumber: r.studentNumber,
        reasons,
        types,
      });
    }
  }
  return hits;
}

export const atRiskFromWarnings = evaluateEarlyWarnings;
