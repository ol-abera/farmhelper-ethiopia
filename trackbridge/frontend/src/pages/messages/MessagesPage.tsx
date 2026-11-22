import { useEffect, useState } from 'react';
import { commsApi } from '../../api/communications.api';
import { Button } from '../../components/ui/Button';

export function MessagesPage() {
  const [threads, setThreads] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    commsApi.threads().then((d: { items: Record<string, unknown>[] }) => setThreads(d.items));
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Messages</h1>
      <p className="text-sm">Threads are tied to a placement, project or CBTP group — not a general social inbox.</p>
      <form
        className="card flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await commsApi.send({ body: fd.get('body'), groupSubject: 'General academic thread' });
          const d = (await commsApi.threads()) as { items: Record<string, unknown>[] };
          setThreads(d.items);
        }}
      >
        <input name="body" className="flex-1 rounded border px-2 py-1" placeholder="Message" />
        <Button type="submit">Send</Button>
      </form>
      {threads.map((t) => (
        <div key={String(t.id)} className="card text-sm">
          {String(t.subject)} — {(t.lastMessage as { body?: string })?.body}
        </div>
      ))}
    </div>
  );
}
