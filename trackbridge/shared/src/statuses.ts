export const APPLICATION_TYPES = ['apply', 'propose'] as const;
export type ApplicationType = (typeof APPLICATION_TYPES)[number];

export const APPLICATION_STATUSES = [
  'pending',
  'recommended',
  'approved',
  'rejected',
  'withdrawn',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const PLACEMENT_STATUSES = [
  'applied',
  'proposed',
  'approved',
  'placed',
  'withdrawn',
  'completed',
  'cancelled',
] as const;
export type PlacementStatus = (typeof PLACEMENT_STATUSES)[number];

export const TERMINAL_PLACEMENT_STATUSES: PlacementStatus[] = [
  'completed',
  'cancelled',
  'withdrawn',
];

export const SUPERVISOR_TYPES = ['advisor', 'internship'] as const;
export type SupervisorType = (typeof SUPERVISOR_TYPES)[number];

export const LOGBOOK_STATUSES = [
  'missing',
  'draft',
  'submitted',
  'late',
  'returned',
  'approved',
] as const;
export type LogbookStatus = (typeof LOGBOOK_STATUSES)[number];

export const COMMENT_ACTIONS = ['comment', 'approve', 'return'] as const;
export type CommentAction = (typeof COMMENT_ACTIONS)[number];

export const PROJECT_MODES = ['individual', 'team'] as const;
export type ProjectMode = (typeof PROJECT_MODES)[number];

export const PROPOSAL_STATUSES = ['draft', 'submitted', 'approved', 'returned'] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export const OVERALL_STATUSES = [
  'not_started',
  'in_progress',
  'behind',
  'on_track',
  'completed',
] as const;
export type OverallStatus = (typeof OVERALL_STATUSES)[number];

export const TEAM_ROLES = ['owner', 'member'] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const MILESTONE_STATUSES = ['pending', 'submitted', 'accepted', 'returned'] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const RUBRIC_COMPONENTS = ['advisor', 'host', 'project'] as const;
export type RubricComponent = (typeof RUBRIC_COMPONENTS)[number];

export const EVALUATION_STATUSES = ['draft', 'submitted'] as const;
export type EvaluationStatus = (typeof EVALUATION_STATUSES)[number];

export const DOCUMENT_TYPES = [
  'cv',
  'logbook_attachment',
  'deliverable',
  'placement_letter',
  'progress_report',
  'final_report',
  'cycle_summary',
  'cbtp_report',
  'cbtp_plan',
  'cbtp_other',
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const REMINDER_CHANNELS = ['email', 'in_app'] as const;
export type ReminderChannel = (typeof REMINDER_CHANNELS)[number];

export const CBTP_ACTIVITY_STATUSES = ['planned', 'active', 'completed', 'cancelled'] as const;
export type CbtpActivityStatus = (typeof CBTP_ACTIVITY_STATUSES)[number];

export const CBTP_DOC_STATUSES = ['draft', 'submitted', 'returned', 'approved'] as const;
export type CbtpDocStatus = (typeof CBTP_DOC_STATUSES)[number];

export const ATTENDANCE_STATUSES = ['present', 'absent', 'late', 'excused'] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const WARNING_TYPES = [
  'missed_deadline',
  'overdue_milestone',
  'inactivity',
  'late_logbook',
  'cbtp_overdue',
  'attendance_gap',
] as const;
export type WarningType = (typeof WARNING_TYPES)[number];
