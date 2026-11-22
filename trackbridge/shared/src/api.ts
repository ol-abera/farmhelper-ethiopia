import type { Role } from './roles.js';
import type {
  ApplicationStatus,
  ApplicationType,
  CommentAction,
  DocumentType,
  EvaluationStatus,
  LogbookStatus,
  MilestoneStatus,
  OverallStatus,
  PlacementStatus,
  ProjectMode,
  ProposalStatus,
  RubricComponent,
  SupervisorType,
  TaskStatus,
  TeamRole,
} from './statuses.js';

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type UserDto = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  studentId: string | null;
  phone: string | null;
  department: string | null;
  isActive: boolean;
  approved: boolean;
  organizationId: string | null;
  cycleId: string | null;
  emailRemindersEnabled: boolean;
  coordinatorFlagAtRisk: boolean;
};

export type AuthResponse = {
  user: UserDto;
  accessToken: string;
};

export type CycleConfig = {
  dualApproval: boolean;
  maxTeamSize: number;
  maxApplications: number;
  workloadThreshold: number;
  atRiskLateWeeks: number;
  orgWideHostRole: boolean;
  universityName: string;
  weights: { advisor: number; host: number; project: number };
};

export type CycleDto = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  internshipStart: string;
  internshipEnd: string;
  logbookDueWeekday: number;
  timezone: string;
  evaluationOpenAt: string | null;
  evaluationCloseAt: string | null;
  evaluationsLocked: boolean;
  scoresPublished: boolean;
  isOpen: boolean;
  isArchived: boolean;
  config: CycleConfig;
};

export type OrganizationDto = {
  id: string;
  name: string;
  sector: string;
  address: string;
  city: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  description: string | null;
  archivedAt: string | null;
};

export type PositionDto = {
  id: string;
  organizationId: string;
  organizationName?: string;
  title: string;
  description: string;
  quota: number;
  filled: number;
  notes: string | null;
  isOpen: boolean;
  openFrom: string | null;
  openTo: string | null;
};

export type ApplicationDto = {
  id: string;
  studentId: string;
  studentName?: string;
  studentNumber?: string | null;
  positionId: string | null;
  cycleId: string;
  type: ApplicationType;
  coverNote: string;
  status: ApplicationStatus;
  reason: string | null;
  hostRecommendation: string | null;
  proposedOrgName: string | null;
  proposedOrgAddress: string | null;
  proposedOrgContact: string | null;
  proposedRole: string | null;
  createdAt: string;
};

export type SupervisorSummary = {
  id: string;
  fullName: string;
  email: string;
  type: SupervisorType;
  workload?: number;
};

export type PlacementDto = {
  id: string;
  studentId: string;
  studentName?: string;
  studentNumber?: string | null;
  cycleId: string;
  organizationId: string;
  organizationName?: string;
  positionId: string | null;
  positionTitle?: string | null;
  startDate: string;
  endDate: string;
  status: PlacementStatus;
  letterDocumentId: string | null;
  universitySupervisor?: SupervisorSummary | null;
  hostSupervisor?: SupervisorSummary | null;
};

export type LogbookWeekDto = {
  id: string;
  placementId: string;
  weekIndex: number;
  periodStart: string;
  periodEnd: string;
  dueAt: string;
  entry: LogbookEntryDto | null;
  displayStatus: LogbookStatus;
};

export type LogbookCommentDto = {
  id: string;
  authorId: string;
  authorName?: string;
  body: string;
  action: CommentAction;
  createdAt: string;
};

export type LogbookEntryDto = {
  id: string;
  weekId: string;
  activities: string;
  hours: number;
  skills: string;
  challenges: string;
  status: LogbookStatus;
  submittedAt: string | null;
  late: boolean;
  resubmitCount: number;
  comments: LogbookCommentDto[];
};

export type ProjectMemberDto = {
  userId: string;
  fullName: string;
  email: string;
  roleInTeam: TeamRole;
  acceptedAt: string | null;
};

export type ProjectTaskDto = {
  id: string;
  title: string;
  assigneeId: string | null;
  dueAt: string | null;
  status: TaskStatus;
};

export type DeliverableDto = {
  id: string;
  fileId: string;
  originalName: string;
  version: number;
  uploadedAt: string;
};

export type MilestoneDto = {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  status: MilestoneStatus;
  reviewComment: string | null;
  deliverables: DeliverableDto[];
};

export type ProjectDto = {
  id: string;
  cycleId: string;
  title: string;
  problem: string;
  objectives: string;
  tools: string;
  mode: ProjectMode;
  proposalStatus: ProposalStatus;
  overallStatus: OverallStatus;
  frozen: boolean;
  taskPercent: number;
  milestonePercent: number;
  members: ProjectMemberDto[];
  tasks: ProjectTaskDto[];
  milestones: MilestoneDto[];
};

export type RubricCriterion = { name: string; maxPoints: number; weight: number };

export type RubricDto = {
  id: string;
  cycleId: string;
  component: RubricComponent;
  criteria: RubricCriterion[];
};

export type EvaluationDto = {
  id: string;
  studentId: string;
  studentName?: string;
  cycleId: string;
  component: RubricComponent;
  evaluatorId: string;
  scores: Record<string, number>;
  total: number | null;
  comments: string | null;
  status: EvaluationStatus;
  submittedAt: string | null;
};

export type FinalScoreDto = {
  studentId: string;
  cycleId: string;
  universityTotal: number | null;
  hostTotal: number | null;
  projectTotal: number | null;
  weightedFinal: number | null;
  incomplete: boolean;
  publishedAt: string | null;
};

export type MessageDto = {
  id: string;
  threadId: string;
  senderId: string;
  senderName?: string;
  body: string;
  createdAt: string;
};

export type MessageThreadDto = {
  id: string;
  placementId: string | null;
  projectId: string | null;
  cycleId: string;
  subject: string;
  unread: number;
  lastMessage: MessageDto | null;
};

export type NotificationDto = {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
  link: string | null;
};

export type AtRiskStudentDto = {
  studentId: string;
  studentName: string;
  studentNumber: string | null;
  reasons: string[];
};

export type DashboardStudentDto = {
  placement: PlacementDto | null;
  logbookSummary: Record<string, number>;
  project: Pick<ProjectDto, 'id' | 'title' | 'overallStatus' | 'taskPercent' | 'milestonePercent'> | null;
  unreadMessages: number;
  deadlines: { label: string; dueAt: string }[];
  scores: FinalScoreDto | null;
  atRisk: boolean;
};

export type DashboardUniversityDto = {
  assignedCount: number;
  pendingLogbooks: number;
  pendingProposals: number;
  pendingMilestones: number;
  pendingEvaluations: number;
  workload: number;
  atRisk: AtRiskStudentDto[];
};

export type DashboardHostDto = {
  assignedCount: number;
  pendingLogbookComments: number;
  pendingEvaluations: number;
  students: { id: string; name: string; organization: string }[];
};

export type DashboardCoordinatorDto = {
  studentsInCycle: number;
  placed: number;
  unplaced: number;
  unassignedSupervisors: number;
  lateLogbooks: number;
  behindProjects: number;
  atRisk: AtRiskStudentDto[];
  workload: { supervisorId: string; name: string; role: Role; count: number }[];
  evaluationCompletionPercent: number;
  orgFill: { organizationId: string; name: string; quota: number; filled: number }[];
};

export type ArchiveRecordDto = {
  studentId: string;
  studentName: string;
  studentNumber: string | null;
  cycleId: string;
  cycleTitle: string;
  organizationName: string | null;
  projectTitle: string | null;
  universitySupervisor: string | null;
  hostSupervisor: string | null;
  placementId: string | null;
  projectId: string | null;
};

export type DocumentDto = {
  id: string;
  type: DocumentType;
  originalName: string;
  mime: string;
  size: number;
  createdAt: string;
};
