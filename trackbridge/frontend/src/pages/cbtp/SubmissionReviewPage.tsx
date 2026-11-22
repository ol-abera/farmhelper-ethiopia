import { useEffect, useState } from 'react';
import { cbtpApi } from '../../api/cbtp.api';
import { aiApi } from '../../api/ai.api';
import { Button } from '../../components/ui/Button';
import { AdvisoryBanner } from '../../components/ui/AdvisoryBanner';

export function SubmissionReviewPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [draft, setDraft] = useState('');
  async function load() {
    const s = (await cbtpApi.submissions()) as { items: Record<string, unknown>[] };
    setItems(s.items.filter((i) => i.status === 'submitted'));
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">Advisor review</h1>
      {items.map((d) => (
        <div key={String(d.id)} className="card space-y-2">
          <h2>{String(d.title)}</h2>
          <p className="whitespace-pre-wrap text-sm">{String(d.body)}</p>
          <Button
            type="button"
            onClick={async () => {
              const r = (await aiApi.summarize(String(d.body))) as { summary: string; insufficient?: boolean };
              setDraft(r.insufficient ? 'Insufficient text' : r.summary);
            }}
          >
            Draft TextRank summary
          </Button>
          {draft && (
            <>
              <AdvisoryBanner>AI draft summary — review before relying on it. Not the student’s own words.</AdvisoryBanner>
              <p className="text-sm italic">{draft}</p>
            </>
          )}
          <div className="flex gap-2">
            <Button onClick={async () => { await cbtpApi.review(String(d.id), { action: 'approve', body: 'Approved' }); load(); }}>Approve</Button>
            <button className="text-copper" onClick={async () => { const c = prompt('Return comment') || 'Please revise'; await cbtpApi.review(String(d.id), { action: 'return', body: c }); load(); }}>Return</button>
          </div>
        </div>
      ))}
    </div>
  );
}
