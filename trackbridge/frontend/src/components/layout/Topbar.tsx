import { useAuth } from '../../auth/useAuth';
import { NotificationBell } from '../notifications/NotificationBell';

export function Topbar() {
  const { logout, user } = useAuth();
  return (
    <header className="flex items-center justify-between border-b border-sand bg-white/70 px-6 py-3">
      <p className="text-sm text-ink/70">Jimma Institute of Technology · Faculty of Computing and Informatics</p>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <span className="text-sm">{user?.email}</span>
        <button className="text-sm text-copper" onClick={() => logout()}>
          Log out
        </button>
      </div>
    </header>
  );
}
