import { useEffect, useState } from 'react';
import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function LogbookEntryPage() {
  const [weeks, setWeeks] = useState<Record<string, unknown>[]>([]);
  const [placementId, setPlacementId] = useState('');
  async function load(id: string) {
    const d = (await internshipsApi.logbooks(id)) as { items: Record<string, unknown>[] };
    setWeeks(d.items);
  }
  useEffect(() => {
    internshipsApi.placements().then((d: { items: { id: string }[] }) => {
      if (d.items[0]) {
        setPlacementId(d.items[0].id);
        load(d.items[0].id);
      }
    });
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Digital logbook</h1>
      {weeks.map((w) => (
        <div key={String(w.id)} className="card space-y-2">
          <div className="flex justify-between">
            <strong>Week {String(w.weekIndex)}</strong>
            <StatusBadge status={String(w.displayStatus)} />
          </div>
          {['draft', 'returned', 'missing'].includes(String(w.displayStatus)) && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await internshipsApi.saveLogbook(String(w.id), {
                  activities: fd.get('activities'),
                  hours: Number(fd.get('hours')),
                  skills: fd.get('skills'),
                  challenges: fd.get('challenges'),
                });
                await internshipsApi.submitLogbook(String(w.id));
                load(placementId);
              }}
              className="grid gap-2"
            >
              <textarea name="activities" className="rounded border px-2 py-1" placeholder="Activities" required />
              <input name="hours" type="number" defaultValue={40} className="rounded border px-2 py-1" />
              <input name="skills" className="rounded border px-2 py-1" placeholder="Skills" required />
              <input name="challenges" className="rounded border px-2 py-1" placeholder="Challenges" required />
              <Button type="submit">Submit week</Button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
