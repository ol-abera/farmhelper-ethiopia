import { useState } from 'react';
import { aiApi } from '../../api/ai.api';
import { AdvisoryBanner } from '../ui/AdvisoryBanner';

type Msg = { q: string; a: string; fallback?: boolean };

export function FaqChatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!question.trim()) return;
    setBusy(true);
    try {
      const r = (await aiApi.faq(question)) as { answer: string; fallback: boolean };
      setMsgs((m) => [...m, { q: question, a: r.answer, fallback: r.fallback }]);
      setQuestion('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className="fixed bottom-5 right-5 z-30 rounded-full bg-copper px-4 py-3 text-sm font-semibold text-white shadow-lg"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close FAQ' : 'English FAQ'}
      </button>
      {open && (
        <div className="fixed bottom-20 right-5 z-30 flex h-[420px] w-[340px] flex-col rounded-xl border border-sand bg-white shadow-xl">
          <div className="border-b border-sand p-3">
            <p className="font-serif">FAQ assistant</p>
            <p className="text-xs text-ink/60">Retrieves published English FAQs only</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm">
            <AdvisoryBanner>
              I cannot grade, approve submissions, or decide placements. If I miss, ask your advisor or coordinator.
            </AdvisoryBanner>
            {msgs.map((m, i) => (
              <div key={i}>
                <p className="font-medium">{m.q}</p>
                <p className="text-ink/80">{m.a}</p>
                {m.fallback && <p className="text-xs text-copper">No close corpus match — please message staff.</p>}
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-sand p-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              className="flex-1 rounded border border-sand px-2 py-1 text-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about CBTP or internships"
            />
            <button disabled={busy} className="text-sm text-pine">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
