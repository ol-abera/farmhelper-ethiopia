import { useState } from 'react';
import { aiApi } from '../../api/ai.api';
import { Button } from '../../components/ui/Button';
import { AdvisoryBanner } from '../../components/ui/AdvisoryBanner';

export function MatchingPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Placement matching</h1>
      <AdvisoryBanner>TF-IDF + cosine similarity. Rankings never create a placement. The coordinator still approves.</AdvisoryBanner>
      <Button
        onClick={async () => {
          const d = (await aiApi.match()) as { items: Record<string, unknown>[] };
          setItems(d.items);
        }}
      >
        Rank opportunities for the current student profile
      </Button>
      <ul className="card text-sm space-y-2">
        {items.map((i, idx) => (
          <li key={idx}>
            {String(i.label || i.title || i.id)} — score {String(i.score ?? i.matchScore)} {Array.isArray(i.reasons) ? `· ${(i.reasons as string[]).join('; ')}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
