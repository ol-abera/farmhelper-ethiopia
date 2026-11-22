import { projectsApi } from '../../api/projects.api';
import { Button } from '../../components/ui/Button';

export function TaskBoard({ project }: { project: Record<string, unknown> }) {
  const tasks = (project.tasks as { id: string; title: string; status: string }[]) || [];
  return (
    <div className="card">
      <h2 className="font-medium">Tasks</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {tasks.map((t) => (
          <li key={t.id} className="flex justify-between">
            {t.title}
            <button
              className="text-copper"
              onClick={() => projectsApi.patchTask(t.id, t.status === 'done' ? 'todo' : 'done')}
            >
              {t.status}
            </button>
          </li>
        ))}
      </ul>
      <form
        className="mt-3 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await projectsApi.addTask(String(project.id), { title: fd.get('title') });
          location.reload();
        }}
      >
        <input name="title" className="flex-1 rounded border px-2 py-1" placeholder="New task" />
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
}
