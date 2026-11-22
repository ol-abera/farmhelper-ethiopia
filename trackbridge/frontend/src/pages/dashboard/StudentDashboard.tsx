import { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboard.api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AdvisoryBanner } from '../../components/ui/AdvisoryBanner';

export function StudentDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    dashboardApi.get().then(setData as never);
  }, []);
  if (!data) return <p>Loading…</p>;
  const placement = data.placement as { organization?: { name: string }; position?: { title: string } } | null;
  const warnings = (data.warnings as { reasons: string[] }[]) || [];
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-pine">Student dashboard</h1>
      {warnings.length > 0 && (
        <AdvisoryBanner>
          Early-warning flags on your work do not mean you have failed. Review the items below with your advisor.
        </AdvisoryBanner>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="font-medium">Internship</h2>
          <p className="mt-2 text-sm">{placement ? `${placement.organization?.name} — ${placement.position?.title}` : 'No placement yet — apply or propose an organisation.'}</p>
        </div>
        <div className="card">
          <h2 className="font-medium">CBTP</h2>
          <p className="mt-2 text-sm">{Array.isArray(data.groups) && (data.groups as unknown[]).length ? `${(data.groups as unknown[]).length} group(s)` : 'Not assigned to a CBTP group yet.'}</p>
        </div>
        <div className="card">
          <h2 className="font-medium">Technical project</h2>
          <p className="mt-2 text-sm">{data.project ? JSON.stringify((data.project as { title?: string }).title) : 'Submit a project title to begin.'}</p>
        </div>
      </div>
      <div className="card">
        <h2 className="font-medium">Logbook weeks</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries((data.logbookSummary as Record<string, number>) || {}).map(([k, v]) => (
            <StatusBadge key={k} status={`${k}: ${v}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
