import { ROLE_LABELS } from '@trackbridge/shared';
import { useAuth } from '../../auth/useAuth';
import { RoleNav } from './RoleNav';

export function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <aside className="flex w-60 shrink-0 flex-col bg-pine text-parchment">
      <div className="border-b border-white/10 px-4 py-5">
        <p className="font-serif text-2xl">TrackBridge</p>
        <p className="mt-1 text-[11px] leading-snug text-parchment/70">
          CBTP · internships · technical projects
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <RoleNav role={user.role} />
      </div>
      <div className="border-t border-white/10 p-4 text-xs">
        <p className="font-medium">{user.fullName}</p>
        <p className="text-parchment/70">{ROLE_LABELS[user.role]}</p>
      </div>
    </aside>
  );
}
