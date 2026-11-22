import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { ROLE_LABELS, ROLES, type Role } from '@trackbridge/shared';
import { Button } from '../../components/ui/Button';

export function RolesAdminPage() {
  const [items, setItems] = useState<{ id: string; fullName: string; email: string; role: Role }[]>([]);
  async function load() {
    const d = (await adminApi.users()) as { items: typeof items };
    setItems(d.items);
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Roles</h1>
      <p className="text-sm">Six official roles. Changing a role is audited. Only an administrator can grant administrator.</p>
      {items.map((u) => (
        <form
          key={u.id}
          className="card flex flex-wrap items-center gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await adminApi.setRole(u.id, String(fd.get('role')));
            load();
          }}
        >
          <span className="flex-1">{u.fullName} · {u.email}</span>
          <select name="role" defaultValue={u.role} className="rounded border px-2 py-1">
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
          <Button type="submit">Update</Button>
        </form>
      ))}
    </div>
  );
}
