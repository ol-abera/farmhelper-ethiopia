import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cbtpApi } from '../../api/cbtp.api';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function GroupListPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    cbtpApi.groups().then((d: { items: Record<string, unknown>[] }) => setItems(d.items));
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">CBTP groups</h1>
      {items.map((g) => (
        <div key={String(g.id)} className="card">
          <div className="flex justify-between">
            <h2 className="font-medium">{String(g.name)}</h2>
            <StatusBadge status={String((g.progress as { status?: string })?.status || 'not_started')} />
          </div>
          <p className="text-sm">{(g.activity as { site?: { name: string } })?.site?.name}</p>
          <Link className="text-copper text-sm" to={`/cbtp/groups/${g.id}/assign`}>
            Members & assignment
          </Link>
        </div>
      ))}
    </div>
  );
}
