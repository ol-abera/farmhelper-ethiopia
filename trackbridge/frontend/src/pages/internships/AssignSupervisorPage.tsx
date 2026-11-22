import { useEffect, useState } from 'react';
import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';

export function AssignSupervisorPage() {
  const [load, setLoad] = useState<Record<string, unknown>[]>([]);
  const [unassigned, setUnassigned] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    internshipsApi.workload().then((d: { items: Record<string, unknown>[] }) => setLoad(d.items));
    internshipsApi.unassigned().then((d: { items: Record<string, unknown>[] }) => setUnassigned(d.items));
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">Supervisor assignment</h1>
      <p className="text-sm">Workload is advisory. You may proceed past the threshold.</p>
      <div className="card">
        {load.map((s) => (
          <p key={String(s.id)}>
            {String(s.fullName)} ({String(s.role)}) — {String(s.count)} students
          </p>
        ))}
      </div>
      <div className="card">
        <h2>Unassigned placements</h2>
        {unassigned.map((u) => (
          <div key={String(u.placementId)} className="my-2 border-t border-sand pt-2 text-sm">
            {String(u.studentName)} @ {String(u.organizationName)}
            {load[0] && (
              <Button
                className="ml-2"
                onClick={async () => {
                  await internshipsApi.assignSupervisor(String(u.placementId), {
                    supervisorUserId: load.find((x) => x.role === 'advisor')?.id || load[0].id,
                    type: u.missingAdvisor ? 'advisor' : 'internship',
                    force: true,
                  });
                  alert('Assigned');
                }}
              >
                Assign
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
