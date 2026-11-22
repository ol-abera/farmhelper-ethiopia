import { useEffect, useState } from 'react';
import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../auth/useAuth';

export function OpportunityBrowsePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    internshipsApi.opportunities().then((d: { items: Record<string, unknown>[] }) => setItems(d.items));
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Internship opportunities</h1>
        {(user?.role === 'host_organization' || user?.role === 'coordinator') && (
          <a className="text-sm text-copper" href="/internships/opportunities/new">
            Post opportunity
          </a>
        )}
      </div>
      {items.map((p) => (
        <div key={String(p.id)} className="card">
          <h2 className="font-medium">{String(p.title)}</h2>
          <p className="text-sm">{String(p.organizationName)} · quota {String(p.quota)} · filled {String(p.filled)}</p>
          <p className="mt-2 text-sm">{String(p.description)}</p>
          {user?.role === 'student' && (
            <Button
              className="mt-2"
              onClick={async () => {
                await internshipsApi.apply({ positionId: p.id, coverNote: 'I would like to intern here based on my skills and interests.' });
                alert('Application submitted');
              }}
            >
              Apply
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
