import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { RoleRoute } from '../auth/RoleRoute';
import { AppShell } from '../components/layout/AppShell';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { SiteListPage } from '../pages/cbtp/SiteListPage';
import { SiteDetailPage } from '../pages/cbtp/SiteDetailPage';
import { GroupListPage } from '../pages/cbtp/GroupListPage';
import { GroupAssignPage } from '../pages/cbtp/GroupAssignPage';
import { SubmissionPage } from '../pages/cbtp/SubmissionPage';
import { SubmissionReviewPage } from '../pages/cbtp/SubmissionReviewPage';
import { OpportunityBrowsePage } from '../pages/internships/OpportunityBrowsePage';
import { OpportunityFormPage } from '../pages/internships/OpportunityFormPage';
import { ApplicationPage } from '../pages/internships/ApplicationPage';
import { ProposePlacementPage } from '../pages/internships/ProposePlacementPage';
import { PlacementDetailPage } from '../pages/internships/PlacementDetailPage';
import { AssignSupervisorPage } from '../pages/internships/AssignSupervisorPage';
import { AttendancePage } from '../pages/internships/AttendancePage';
import { LogbookEntryPage } from '../pages/internships/LogbookEntryPage';
import { LogbookReviewPage } from '../pages/internships/LogbookReviewPage';
import { TitleSubmitPage } from '../pages/projects/TitleSubmitPage';
import { ProjectPage } from '../pages/projects/ProjectPage';
import { EvaluationInboxPage } from '../pages/evaluations/EvaluationInboxPage';
import { EvaluationFormPage } from '../pages/evaluations/EvaluationFormPage';
import { MessagesPage } from '../pages/messages/MessagesPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { ArchivePage } from '../pages/reports/ArchivePage';
import { MatchingPage } from '../pages/ai/MatchingPage';
import { RecommendationsPage } from '../pages/ai/RecommendationsPage';
import { EarlyWarningsPage } from '../pages/ai/EarlyWarningsPage';
import { UsersAdminPage } from '../pages/admin/UsersAdminPage';
import { RolesAdminPage } from '../pages/admin/RolesAdminPage';
import { ConfigAdminPage } from '../pages/admin/ConfigAdminPage';
import { FaqAdminPage } from '../pages/admin/FaqAdminPage';
import { AuditLogPage } from '../pages/admin/AuditLogPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cbtp/sites" element={<SiteListPage />} />
          <Route path="/cbtp/sites/:id" element={<SiteDetailPage />} />
          <Route path="/cbtp/groups" element={<GroupListPage />} />
          <Route path="/cbtp/groups/:id/assign" element={<GroupAssignPage />} />
          <Route path="/cbtp/submissions" element={<SubmissionPage />} />
          <Route path="/cbtp/review" element={<SubmissionReviewPage />} />
          <Route path="/internships/opportunities" element={<OpportunityBrowsePage />} />
          <Route path="/internships/opportunities/new" element={<OpportunityFormPage />} />
          <Route path="/internships/applications" element={<ApplicationPage />} />
          <Route path="/internships/propose" element={<ProposePlacementPage />} />
          <Route path="/internships/placements" element={<PlacementDetailPage />} />
          <Route path="/internships/assign" element={<AssignSupervisorPage />} />
          <Route path="/internships/attendance" element={<AttendancePage />} />
          <Route path="/internships/logbook" element={<LogbookEntryPage />} />
          <Route path="/internships/logbook/review" element={<LogbookReviewPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/projects/title" element={<TitleSubmitPage />} />
          <Route path="/evaluations" element={<EvaluationInboxPage />} />
          <Route path="/evaluations/form" element={<EvaluationFormPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/archive" element={<ArchivePage />} />
          <Route path="/ai/matching" element={<MatchingPage />} />
          <Route path="/ai/recommendations" element={<RecommendationsPage />} />
          <Route path="/ai/warnings" element={<EarlyWarningsPage />} />
          <Route element={<RoleRoute roles={['administrator', 'coordinator']} />}>
            <Route path="/admin/users" element={<UsersAdminPage />} />
          </Route>
          <Route element={<RoleRoute roles={['administrator']} />}>
            <Route path="/admin/roles" element={<RolesAdminPage />} />
            <Route path="/admin/config" element={<ConfigAdminPage />} />
            <Route path="/admin/faq" element={<FaqAdminPage />} />
            <Route path="/admin/audit" element={<AuditLogPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
