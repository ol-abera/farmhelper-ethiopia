import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { usersApi } from '../../api/users.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ROLE_LABELS, type Role } from '@trackbridge/shared';

type UserRow = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  approved: boolean;
  isActive: boolean;
};

export function UsersAdminPage() {
  const [items, setItems] = useState<UserRow[]>([]);
  const [pendingOnly, setPendingOnly] = useState(false);
  async function load(pending = pendingOnly) {
    const d = (await adminApi.users(pending ? '?pending=true' : '')) as { items: UserRow[] };
    setItems(d.items);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingOnly]);
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">Accounts</h1>
      <label className="text-sm">
        <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} className="mr-2" />
        Pending student registrations only
      </label>
      <form
        className="card grid gap-2 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await adminApi.createUser({
            fullName: fd.get('fullName'),
            email: fd.get('email'),
            role: fd.get('role'),
            department: fd.get('department'),
          });
          load();
        }}
      >
        <h2 className="md:col-span-2 font-medium">Create account</h2>
        <input name="fullName" className="rounded border px-2 py-1" placeholder="Full name" required />
        <input name="email" className="rounded border px-2 py-1" placeholder="Email" required />
        <input name="department" className="rounded border px-2 py-1" placeholder="Department" />
        <select name="role" className="rounded border px-2 py-1" defaultValue="student">
          {Object.entries(ROLE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <Button type="submit">Create</Button>
      </form>
      {items.map((u) => (
        <div key={u.id} className="card flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-medium">{u.fullName}</p>
            <p className="text-sm">{u.email} · {ROLE_LABELS[u.role]}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={u.approved ? 'approved' : 'pending'} />
            {!u.approved && (
              <Button onClick={async () => { await usersApi.approve(u.id); load(); }}>Approve</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
