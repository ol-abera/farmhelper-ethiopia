import { useEffect, useState } from 'react';
import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';

export function LogbookReviewPage() {
  const [weeks, setWeeks] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    internshipsApi.placements().then(async (d: { items: { id: string }[] }) => {
      if (!d.items[0]) return;
      const lb = (await internshipsApi.logbooks(d.items[0].id)) as { items: Record<string, unknown>[] };
      setWeeks(lb.items.filter((w) => ['submitted', 'late'].includes(String(w.displayStatus))));
    });
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Logbook review</h1>
      {weeks.map((w) => {
        const entry = w.entry as { id: string; activities: string } | null;
        return (
          <div key={String(w.id)} className="card">
            <p>Week {String(w.weekIndex)}</p>
            <p className="text-sm">{entry?.activities}</p>
            {entry && (
              <Button
                className="mt-2"
                onClick={async () => {
                  await internshipsApi.reviewLogbook(entry.id, { action: 'approve', body: 'Approved' });
                  alert('Approved');
                }}
              >
                Approve
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
