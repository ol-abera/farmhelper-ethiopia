import { useEffect, useState } from 'react';
import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';

export function PlacementDetailPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    internshipsApi.placements().then((d: { items: Record<string, unknown>[] }) => setItems(d.items));
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Placements</h1>
      {items.map((p) => (
        <div key={String(p.id)} className="card">
          <p>
            {String(p.studentName)} @ {String(p.organizationName)} — {String(p.positionTitle)}
          </p>
          <Button
            className="mt-2"
            onClick={async () => {
              const res = await internshipsApi.letter(String(p.id));
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              window.open(url);
            }}
          >
            Download placement letter
          </Button>
        </div>
      ))}
    </div>
  );
}
