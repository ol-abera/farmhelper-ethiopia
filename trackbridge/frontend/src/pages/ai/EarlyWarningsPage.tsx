import { useEffect, useState } from 'react';
import { aiApi } from '../../api/ai.api';
import { AdvisoryBanner } from '../../components/ui/AdvisoryBanner';

export function EarlyWarningsPage() {
  const [items, setItems] = useState<{ studentName: string; reasons: string[] }[]>([]);
  useEffect(() => {
    aiApi.warnings().then((d: { items: typeof items }) => setItems(d.items));
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Early warnings</h1>
      <AdvisoryBanner>Rule-based flags (missed deadlines, overdue milestones, inactivity). A flag does not establish student failure.</AdvisoryBanner>
      {items.map((w, i) => (
        <div key={i} className="card">
          <strong>{w.studentName}</strong>
          <ul className="list-disc pl-5 text-sm">{w.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
