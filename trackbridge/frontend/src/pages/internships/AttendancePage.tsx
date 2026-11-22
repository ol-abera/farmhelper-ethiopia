import { useEffect, useState } from 'react';
import { internshipsApi } from '../../api/internships.api';
import { Button } from '../../components/ui/Button';

export function AttendancePage() {
  const [placementId, setPlacementId] = useState('');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    internshipsApi.placements().then((d: { items: { id: string }[] }) => {
      if (d.items[0]) {
        setPlacementId(d.items[0].id);
        internshipsApi.attendance(d.items[0].id).then((a: { items: Record<string, unknown>[] }) => setRows(a.items));
      }
    });
  }, []);
  return (
    <div className="space-y-3">
      <h1 className="font-serif text-3xl">Attendance</h1>
      <form
        className="card flex flex-wrap gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await internshipsApi.recordAttendance(placementId, {
            date: fd.get('date'),
            status: fd.get('status'),
            hours: 8,
          });
          const a = (await internshipsApi.attendance(placementId)) as { items: Record<string, unknown>[] };
          setRows(a.items);
        }}
      >
        <input name="date" type="date" className="rounded border px-2 py-1" required />
        <select name="status" className="rounded border px-2 py-1">
          <option value="present">present</option>
          <option value="absent">absent</option>
          <option value="late">late</option>
          <option value="excused">excused</option>
        </select>
        <Button type="submit">Record</Button>
      </form>
      <div className="card text-sm">
        {rows.map((r) => (
          <p key={String(r.id)}>
            {String(r.date).slice(0, 10)} — {String(r.status)}
          </p>
        ))}
      </div>
    </div>
  );
}
