import { useEffect, useState } from 'react';
import { projectsApi } from '../../api/projects.api';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TaskBoard } from './TaskBoard';
import { MilestoneSection } from './MilestoneSection';
import { Link } from 'react-router-dom';

export function ProjectPage() {
  const [project, setProject] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    projectsApi.mine().then((d: { project: Record<string, unknown> | null }) => setProject(d.project));
  }, []);
  if (!project) {
    return (
      <div className="card">
        No technical project yet.{' '}
        <Link className="text-copper" to="/projects/title">
          Submit a title
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">{String(project.title)}</h1>
      <StatusBadge status={String(project.overallStatus)} />
      <p className="text-sm">{String(project.problem)}</p>
      <TaskBoard project={project} />
      <MilestoneSection project={project} />
    </div>
  );
}
