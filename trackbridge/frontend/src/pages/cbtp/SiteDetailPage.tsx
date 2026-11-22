import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cbtpApi } from '../../api/cbtp.api';
import { Button } from '../../components/ui/Button';

export function SiteDetailPage() {
  const { id } = useParams();
  const [site, setSite] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    if (id) cbtpApi.site(id).then((d: { site: Record<string, unknown> }) => setSite(d.site));
  }, [id]);
  if (!site) return <p>Loading…</p>;
  const activities = (site.activities as { id: string; title: string; status: string }[]) || [];
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">{String(site.name)}</h1>
      <p className="text-sm">{String(site.community)} · {String(site.woreda)}</p>
      <div className="card">
        <h2>Activities</h2>
        {activities.map((a) => (
          <p key={a.id}>{a.title} ({a.status})</p>
        ))}
      </div>
      <form
        className="card space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await cbtpApi.addActivity(id!, {
            title: fd.get('title'),
            description: fd.get('description'),
            startDate: '2026-10-01',
            endDate: '2026-12-15',
          });
          const d = (await cbtpApi.site(id!)) as { site: Record<string, unknown> };
          setSite(d.site);
        }}
      >
        <input name="title" className="w-full rounded border px-2 py-1" placeholder="Activity title" />
        <textarea name="description" className="w-full rounded border px-2 py-1" placeholder="Description" />
        <Button type="submit">Add activity</Button>
      </form>
    </div>
  );
}
