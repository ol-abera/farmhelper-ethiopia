import { useAuth } from '../../auth/useAuth';
import { StudentDashboard } from './StudentDashboard';
import { AdvisorDashboard } from './AdvisorDashboard';
import { InternshipSupervisorDashboard } from './InternshipSupervisorDashboard';
import { CoordinatorDashboard } from './CoordinatorDashboard';
import { HostOrganizationDashboard } from './HostOrganizationDashboard';
import { AdminDashboard } from './AdminDashboard';

export function DashboardPage() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'advisor':
      return <AdvisorDashboard />;
    case 'internship_supervisor':
      return <InternshipSupervisorDashboard />;
    case 'coordinator':
      return <CoordinatorDashboard />;
    case 'host_organization':
      return <HostOrganizationDashboard />;
    case 'administrator':
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
}
