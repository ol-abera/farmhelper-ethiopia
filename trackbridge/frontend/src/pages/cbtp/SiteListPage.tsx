import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cbtpApi } from '../../api/cbtp.api';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../auth/useAuth';

export function SiteListPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<{ id: string; name: string; community: string; woreda: string }[]>([]);
  const [form, setForm] = useState({ name: '', woreda: 'Jimma', kebele: '', community: '', address: 'Jimma', contactName: 'Contact', contactPhone: '+251900000000', description: '' });
  async function load() {
    const d = (await cbtpApi.sites()) as { items: typeof items };
    setItems(d.items);
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">CBTP sites</h1>
      <div className="card">
        {items.map((s) => (
          <Link key={s.id} to={`/cbtp/sites/${s.id}`} className="block border-b border-sand py-2">
            {s.name} — {s.community}, {s.woreda}
          </Link>
        ))}
      </div>
      {['coordinator', 'administrator'].includes(user?.role || '') && (
        <form
          className="card grid gap-2 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await cbtpApi.createSite(form);
            load();
          }}
        >
          <h2 className="md:col-span-2 font-medium">Register site</h2>
          {(['name', 'woreda', 'community', 'address'] as const).map((k) => (
            <input key={k} className="rounded border px-2 py-1" placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          ))}
          <Button type="submit">Save site</Button>
        </form>
      )}
    </div>
  );
}
