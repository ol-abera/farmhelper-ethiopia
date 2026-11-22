import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Button } from '../../components/ui/Button';

export function ConfigAdminPage() {
  const [config, setConfig] = useState<Record<string, unknown>>({});
  useEffect(() => {
    adminApi.config().then((d: { config: Record<string, unknown> }) => setConfig(d.config));
  }, []);
  return (
    <form
      className="card max-w-xl space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await fetch('/api/v1/admin/config', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('tb_access')}` },
          body: JSON.stringify({ key: fd.get('key'), value: { text: fd.get('value') } }),
        });
        const d = (await adminApi.config()) as { config: Record<string, unknown> };
        setConfig(d.config);
      }}
    >
      <h1 className="font-serif text-3xl">System configuration</h1>
      <p className="text-sm">Institution name, rubric weights and calendar dates live here — they are not hard-coded law.</p>
      <input name="key" className="w-full rounded border px-2 py-1" placeholder="Key (e.g. universityName)" required />
      <textarea name="value" className="w-full rounded border px-2 py-1" placeholder="JSON or text value" />
      <Button type="submit">Save</Button>
      <pre className="overflow-auto text-xs">{JSON.stringify(config, null, 2)}</pre>
    </form>
  );
}
