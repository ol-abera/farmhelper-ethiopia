import { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboard.api';
import { AdvisoryBanner } from '../../components/ui/AdvisoryBanner';

export function CoordinatorDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    dashboardApi.get().then(setData as never);
  }, []);
  if (!data) return <p>Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-pine">Coordinator</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Students', data.studentsInCycle],
          ['Placed', data.placed],
          ['Unplaced', data.unplaced],
          ['Pending registrations', data.pendingRegistrations],
        ].map(([k, v]) => (
          <div key={String(k)} className="card">
            <p className="text-xs uppercase text-ink/50">{k}</p>
            <p className="font-serif text-3xl">{String(v ?? 0)}</p>
          </div>
        ))}
      </div>
      <AdvisoryBanner>Placement matching never auto-places a student. Use Matching, then approve an application.</AdvisoryBanner>
    </div>
  );
}
