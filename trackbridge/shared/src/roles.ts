export const ROLES = [
  'student',
  'advisor',
  'internship_supervisor',
  'coordinator',
  'host_organization',
  'administrator',
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  student: 'Student',
  advisor: 'Academic advisor',
  internship_supervisor: 'Internship supervisor',
  coordinator: 'Coordinator',
  host_organization: 'Host organization',
  administrator: 'Administrator',
};
