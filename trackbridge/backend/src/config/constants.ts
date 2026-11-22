export const ALLOWED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'png',
  'jpg',
  'jpeg',
] as const;

export const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
]);

export const REFRESH_COOKIE = 'tb_refresh';

export const DEFAULT_CYCLE_CONFIG = {
  dualApproval: false,
  maxTeamSize: 4,
  maxApplications: 1,
  workloadThreshold: 8,
  atRiskLateWeeks: 2,
  orgWideHostRole: false,
  universityName: 'Jimma Institute of Technology',
  weights: { advisor: 50, host: 30, project: 20 },
};
