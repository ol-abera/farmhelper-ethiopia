import { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboard.api';

export function HostOrganizationDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    dashboardApi.get().then(setData as never);
  }, []);
  if (!data) return <p>Loading…</p>;
  const opps = (data.opportunities as { title: string }[]) || [];
  const placements = (data.placements as { student: { fullName: string } }[]) || [];
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-pine">Host organisation</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2>Opportunities</h2>
          <ul className="mt-2 text-sm">{opps.map((o) => <li key={o.title}>{o.title}</li>)}</ul>
        </div>
        <div className="card">
          <h2>Placed interns</h2>
          <ul className="mt-2 text-sm">{placements.map((p, i) => <li key={i}>{p.student.fullName}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
