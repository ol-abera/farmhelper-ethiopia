/** Labels and default thresholds. Computation lives in backend AI / at-risk services. */
export const AT_RISK_REASONS = {
  late_or_missing_logbooks: 'Two or more logbook weeks late or missing',
  project_behind: 'Technical project is behind schedule',
  evaluation_overdue: 'Evaluation not submitted with the window closing soon',
  coordinator_flag: 'Flagged by the coordinator',
  inactivity: 'No recorded activity for several days',
  cbtp_overdue: 'CBTP report or activity overdue',
  attendance_gap: 'Internship attendance gaps',
} as const;

export const AT_RISK_DEFAULTS = {
  lateOrMissingWeeks: 2,
  evaluationClosingDays: 7,
  workloadThreshold: 8,
  maxTeamSize: 4,
  maxApplications: 1,
  inactivityDays: 14,
  attendanceGapDays: 3,
  titleSimilarityWarn: 0.72,
  faqMinScore: 0.18,
};
