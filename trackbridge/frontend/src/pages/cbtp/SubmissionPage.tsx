import { useEffect, useState } from 'react';
import { cbtpApi } from '../../api/cbtp.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function SubmissionPage() {
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState({ groupId: '', title: '', body: '', docKind: 'needs_assessment' });
  async function load() {
    const g = (await cbtpApi.groups()) as { items: { id: string; name: string }[] };
    setGroups(g.items);
    const s = (await cbtpApi.submissions()) as { items: Record<string, unknown>[] };
    setItems(s.items);
    if (!form.groupId && g.items[0]) setForm((f) => ({ ...f, groupId: g.items[0].id }));
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">CBTP documents</h1>
      <form
        className="card space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const created = (await cbtpApi.createSubmission(form)) as { submission: { id: string } };
          await cbtpApi.submit(created.submission.id);
          load();
        }}
      >
        <select className="rounded border px-2 py-1" value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })}>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <input className="w-full rounded border px-2 py-1" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full rounded border px-2 py-1" rows={6} placeholder="Report body (long enough for TextRank)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <Button type="submit">Submit report</Button>
      </form>
      {items.map((d) => (
        <div key={String(d.id)} className="card">
          <div className="flex justify-between">
            <strong>{String(d.title)}</strong>
            <StatusBadge status={String(d.status)} />
          </div>
          <p className="text-sm text-ink/70">{String(d.docKind)}</p>
        </div>
      ))}
    </div>
  );
}
