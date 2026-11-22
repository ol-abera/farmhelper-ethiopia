import { useEffect, useState } from 'react';
import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../auth/useAuth';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function ApplicationPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  async function load() {
    const d = (await internshipsApi.applications()) as { items: Record<string, unknown>[] };
    setItems(d.items);
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Applications</h1>
      {items.map((a) => (
        <div key={String(a.id)} className="card flex items-start justify-between gap-4">
          <div>
            <p>{String(a.studentName)} → {String(a.positionTitle || a.proposedRole)}</p>
            <StatusBadge status={String(a.status)} />
          </div>
          {user?.role === 'coordinator' && a.status === 'pending' && (
            <div className="flex gap-2">
              <Button onClick={async () => { await internshipsApi.decide(String(a.id), { decision: 'approve' }); load(); }}>Approve</Button>
              <button onClick={async () => { await internshipsApi.decide(String(a.id), { decision: 'reject', reason: 'Not a fit this cycle' }); load(); }}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
