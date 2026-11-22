import { useState } from 'react';
import { reportsApi } from '../../api/reports.api';
import { Button } from '../../components/ui/Button';

export function ArchivePage() {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<Record<string, unknown> | null>(null);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Archive search</h1>
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setRes((await reportsApi.archive(q)) as Record<string, unknown>);
        }}
      >
        <input className="flex-1 rounded border px-2 py-1" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button type="submit">Search</Button>
      </form>
      <pre className="card text-xs overflow-auto">{JSON.stringify(res, null, 2)}</pre>
    </div>
  );
}
