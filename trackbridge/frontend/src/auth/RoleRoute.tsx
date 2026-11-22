import type { Role } from '@trackbridge/shared';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function RoleRoute({ roles }: { roles: Role[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
