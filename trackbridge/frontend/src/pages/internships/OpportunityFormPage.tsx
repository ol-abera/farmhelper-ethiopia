import { useEffect, useState } from 'react';
import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';

export function OpportunityFormPage() {
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
  const [orgId, setOrgId] = useState('');
  useEffect(() => {
    internshipsApi.organizations().then((d: { items: { id: string; name: string }[] }) => {
      setOrgs(d.items);
      if (d.items[0]) setOrgId(d.items[0].id);
    });
  }, []);
  return (
    <form
      className="card space-y-2 max-w-xl"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await internshipsApi.createOpportunity(orgId, {
          title: fd.get('title'),
          description: fd.get('description'),
          requiredSkills: fd.get('requiredSkills'),
          quota: 2,
        });
        alert('Opportunity posted');
      }}
    >
      <h1 className="font-serif text-2xl">Post opportunity</h1>
      <select value={orgId} onChange={(e) => setOrgId(e.target.value)} className="rounded border px-2 py-1">
        {orgs.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
      <input name="title" className="w-full rounded border px-2 py-1" placeholder="Title" />
      <textarea name="description" className="w-full rounded border px-2 py-1" placeholder="Description" />
      <input name="requiredSkills" className="w-full rounded border px-2 py-1" placeholder="Required skills text" />
      <Button type="submit">Save</Button>
    </form>
  );
}
