import { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboard.api';

export function InternshipSupervisorDashboard() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    dashboardApi.get().then(setData as never);
  }, []);
  if (!data) return <p>Loading…</p>;
  const placements = (data.placements as { student: { fullName: string }; organization: { name: string } }[]) || [];
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-pine">Internship supervisor</h1>
      <p>Assigned interns: {String(data.assignedCount ?? 0)} · Pending logbooks: {String(data.pendingLogbooks ?? 0)}</p>
      <div className="card">
        <ul className="space-y-2 text-sm">
          {placements.map((p, i) => (
            <li key={i}>
              {p.student.fullName} — {p.organization.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
