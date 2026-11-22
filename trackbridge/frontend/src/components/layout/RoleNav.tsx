import { NavLink } from 'react-router-dom';
import type { Role } from '@trackbridge/shared';

const links: Record<Role, { to: string; label: string }[]> = {
  student: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/cbtp/groups', label: 'CBTP' },
    { to: '/internships/opportunities', label: 'Internships' },
    { to: '/internships/applications', label: 'Applications' },
    { to: '/ai/recommendations', label: 'Recommendations' },
    { to: '/internships/logbook', label: 'Logbook' },
    { to: '/internships/attendance', label: 'Attendance' },
    { to: '/projects', label: 'Project' },
    { to: '/messages', label: 'Messages' },
    { to: '/reports', label: 'Reports' },
  ],
  advisor: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/cbtp/groups', label: 'CBTP groups' },
    { to: '/cbtp/review', label: 'Reviews' },
    { to: '/projects', label: 'Projects' },
    { to: '/ai/warnings', label: 'Early warnings' },
    { to: '/evaluations', label: 'Evaluations' },
    { to: '/messages', label: 'Messages' },
    { to: '/reports', label: 'Reports' },
  ],
  internship_supervisor: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/internships/placements', label: 'Interns' },
    { to: '/internships/logbook/review', label: 'Logbooks' },
    { to: '/internships/attendance', label: 'Attendance' },
    { to: '/evaluations', label: 'Evaluations' },
    { to: '/messages', label: 'Messages' },
  ],
  coordinator: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/cbtp/sites', label: 'CBTP sites' },
    { to: '/cbtp/groups', label: 'Groups' },
    { to: '/internships/opportunities', label: 'Opportunities' },
    { to: '/internships/applications', label: 'Applications' },
    { to: '/internships/placements', label: 'Placements' },
    { to: '/internships/assign', label: 'Supervisors' },
    { to: '/ai/recommendations', label: 'Recommendations' },
    { to: '/ai/matching', label: 'Matching' },
    { to: '/ai/warnings', label: 'Warnings' },
    { to: '/projects', label: 'Projects' },
    { to: '/reports', label: 'Reports' },
    { to: '/admin/users', label: 'Users' },
  ],
  host_organization: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/internships/opportunities', label: 'Opportunities' },
    { to: '/internships/placements', label: 'Interns' },
    { to: '/ai/matching', label: 'Matching' },
    { to: '/messages', label: 'Messages' },
  ],
  administrator: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Accounts' },
    { to: '/admin/roles', label: 'Roles' },
    { to: '/admin/faq', label: 'FAQ corpus' },
    { to: '/admin/config', label: 'Configuration' },
    { to: '/admin/audit', label: 'Audit' },
    { to: '/reports', label: 'Reports' },
  ],
};

export function RoleNav({ role }: { role: Role }) {
  return (
    <nav className="flex flex-col gap-1">
      {links[role].map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-white/15 text-white' : 'text-parchment/80 hover:bg-white/10'}`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
