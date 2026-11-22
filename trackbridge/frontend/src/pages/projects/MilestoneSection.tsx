import { projectsApi } from '../../api/projects.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function MilestoneSection({ project }: { project: Record<string, unknown> }) {
  const miles = (project.milestones as { id: string; title: string; status: string; dueAt: string }[]) || [];
  return (
    <div className="card">
      <h2 className="font-medium">Milestones</h2>
      {miles.map((m) => (
        <p key={m.id} className="flex justify-between text-sm">
          {m.title} <StatusBadge status={m.status} />
        </p>
      ))}
      <form
        className="mt-3 grid gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await projectsApi.addMilestone(String(project.id), {
            title: fd.get('title'),
            description: fd.get('description'),
            dueAt: fd.get('dueAt'),
          });
          location.reload();
        }}
      >
        <input name="title" className="rounded border px-2 py-1" placeholder="Milestone" />
        <input name="description" className="rounded border px-2 py-1" placeholder="Description" />
        <input name="dueAt" type="date" className="rounded border px-2 py-1" />
        <Button type="submit">Add milestone</Button>
      </form>
    </div>
  );
}
