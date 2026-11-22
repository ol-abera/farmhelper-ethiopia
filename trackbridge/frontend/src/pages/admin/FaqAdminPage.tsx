import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function FaqAdminPage() {
  const [items, setItems] = useState<{ id: string; question: string; answer: string; approved: boolean }[]>([]);
  async function load() {
    const d = (await adminApi.faq()) as { items: typeof items };
    setItems(d.items);
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">FAQ corpus</h1>
      <p className="text-sm">The English chatbot only retrieves published rows. Unpublished drafts are not answers.</p>
      <form
        className="card grid gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await adminApi.createFaq({ question: fd.get('question'), answer: fd.get('answer'), tags: fd.get('tags') });
          load();
        }}
      >
        <input name="question" className="rounded border px-2 py-1" placeholder="Question" required />
        <textarea name="answer" className="rounded border px-2 py-1" placeholder="Answer" required />
        <input name="tags" className="rounded border px-2 py-1" placeholder="Tags (cbtp, internship, project)" />
        <Button type="submit">Add draft</Button>
      </form>
      {items.map((f) => (
        <div key={f.id} className="card">
          <div className="flex justify-between">
            <strong>{f.question}</strong>
            <StatusBadge status={f.approved ? 'published' : 'draft'} />
          </div>
          <p className="text-sm">{f.answer}</p>
          {!f.approved && (
            <Button className="mt-2" onClick={async () => { await adminApi.publishFaq(f.id); load(); }}>
              Publish
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
