import { useEffect, useState } from 'react';
import { evaluationsApi } from '../../api/evaluations.api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Link } from 'react-router-dom';

export function EvaluationInboxPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    evaluationsApi.list().then((d: { items: Record<string, unknown>[] }) => setItems(d.items));
  }, []);
  return (
    <div>
      <h1 className="font-serif text-3xl">Evaluations</h1>
      <Link to="/evaluations/form" className="text-copper text-sm">
        Open form
      </Link>
      {items.map((e) => (
        <p key={String(e.id)} className="card mt-2">
          {String((e.student as { fullName?: string })?.fullName)} · {String(e.component)} <StatusBadge status={String(e.status)} />
        </p>
      ))}
    </div>
  );
}
