import { useEffect, useState } from 'react';
import { aiApi } from '../../api/ai.api';
import { AdvisoryBanner } from '../../components/ui/AdvisoryBanner';

export function RecommendationsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    aiApi.recommend().then((d: { items: Record<string, unknown>[] }) => setItems(d.items));
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Urgency-aware recommendations</h1>
      <AdvisoryBanner>Suitability (cosine) plus deadline/quota urgency. Not an automatic assignment.</AdvisoryBanner>
      {items.map((i, n) => (
        <div key={n} className="card text-sm">
          {String(i.title || i.label || i.positionId)} · combined {String(i.combinedScore ?? i.score)}
          <p>{Array.isArray(i.reasons) ? (i.reasons as string[]).join(' · ') : ''}</p>
        </div>
      ))}
    </div>
  );
}
