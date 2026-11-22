import { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboard.api';
import { AdvisoryBanner } from '../../components/ui/AdvisoryBanner';

export function AdvisorDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    dashboardApi.get().then(setData as never);
  }, []);
  if (!data) return <p>Loading…</p>;
  const warnings = (data.warnings as { studentName: string; reasons: string[] }[]) || [];
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-pine">Academic advisor</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">Pending CBTP reviews: {String(data.pendingCbtp ?? 0)}</div>
        <div className="card">Pending logbooks: {String(data.pendingLog ?? 0)}</div>
        <div className="card">Groups: {Array.isArray(data.groups) ? (data.groups as unknown[]).length : 0}</div>
      </div>
      <AdvisoryBanner>Early warnings are rule-based and do not establish student failure.</AdvisoryBanner>
      <div className="card">
        <h2 className="font-medium">Progress alerts</h2>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {warnings.map((w, i) => (
            <li key={i}>
              {w.studentName}: {w.reasons.join('; ')}
            </li>
          ))}
          {warnings.length === 0 && <li>No flags for your assigned students.</li>}
        </ul>
      </div>
    </div>
  );
}
