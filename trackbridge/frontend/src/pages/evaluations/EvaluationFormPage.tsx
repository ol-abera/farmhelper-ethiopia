import { internshipsApi } from '../../api/internships.api';
import { evaluationsApi } from '../../api/evaluations.api';
import { Button } from '../../components/ui/Button';
import { useEffect, useState } from 'react';

export function EvaluationFormPage() {
  const [students, setStudents] = useState<{ studentId: string; studentName: string }[]>([]);
  useEffect(() => {
    internshipsApi.placements().then((d: { items: { studentId: string; studentName: string }[] }) => setStudents(d.items));
  }, []);
  return (
    <form
      className="card max-w-lg space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await evaluationsApi.save({
          studentId: fd.get('studentId'),
          component: fd.get('component'),
          scores: {
            'Quality of work': Number(fd.get('q1')),
            Professionalism: Number(fd.get('q2')),
            Documentation: Number(fd.get('q3')),
          },
          comments: fd.get('comments'),
          submit: true,
        });
        alert('Saved');
      }}
    >
      <h1 className="font-serif text-2xl">Evaluation form</h1>
      <select name="studentId" className="rounded border px-2 py-1">
        {students.map((s) => (
          <option key={s.studentId} value={s.studentId}>
            {s.studentName}
          </option>
        ))}
      </select>
      <select name="component" className="rounded border px-2 py-1">
        <option value="advisor">advisor</option>
        <option value="host">host</option>
        <option value="project">project</option>
      </select>
      <input name="q1" type="number" defaultValue={32} className="rounded border px-2 py-1" /> Quality /40
      <input name="q2" type="number" defaultValue={24} className="rounded border px-2 py-1" /> Professionalism /30
      <input name="q3" type="number" defaultValue={24} className="rounded border px-2 py-1" /> Documentation /30
      <textarea name="comments" className="w-full rounded border px-2 py-1" />
      <Button type="submit">Submit evaluation</Button>
    </form>
  );
}
