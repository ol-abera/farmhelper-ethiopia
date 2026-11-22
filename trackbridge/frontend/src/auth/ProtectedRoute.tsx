import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-pine">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
