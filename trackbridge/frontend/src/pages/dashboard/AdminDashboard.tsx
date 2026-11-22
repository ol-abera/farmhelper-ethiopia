import { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboard.api';

export function AdminDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    dashboardApi.get().then(setData as never);
  }, []);
  if (!data) return <p>Loading…</p>;
  const byRole = (data.byRole as { role: string; _count: number }[]) || [];
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-pine">Administrator</h1>
      <p className="text-sm">Pending student registrations: {String(data.pendingRegistrations)} · Published FAQs: {String(data.publishedFaqs)}</p>
      <div className="card">
        <ul className="text-sm">
          {byRole.map((r) => (
            <li key={r.role}>
              {r.role}: {r._count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
