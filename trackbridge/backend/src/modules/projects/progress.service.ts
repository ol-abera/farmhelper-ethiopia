import type { OverallStatus, TaskStatus, MilestoneStatus } from '@trackbridge/shared';

export function taskPercent(tasks: { status: TaskStatus }[]) {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

export function milestonePercent(milestones: { status: MilestoneStatus }[]) {
  if (!milestones.length) return 0;
  const accepted = milestones.filter((m) => m.status === 'accepted').length;
  return Math.round((accepted / milestones.length) * 100);
}

export function overallStatus(input: {
  tasks: { status: TaskStatus }[];
  milestones: { status: MilestoneStatus; dueAt: Date }[];
  now?: Date;
}): { overallStatus: OverallStatus; taskPercent: number; milestonePercent: number } {
  const now = input.now ?? new Date();
  const tp = taskPercent(input.tasks);
  const mp = milestonePercent(input.milestones);
  const overdue = input.milestones.some(
    (m) => m.status !== 'accepted' && new Date(m.dueAt).getTime() < now.getTime(),
  );
  if (!input.tasks.length && !input.milestones.length) {
    return { overallStatus: 'not_started', taskPercent: tp, milestonePercent: mp };
  }
  if (mp === 100 && (tp === 100 || !input.tasks.length)) {
    return { overallStatus: 'completed', taskPercent: tp, milestonePercent: mp };
  }
  if (overdue) {
    return { overallStatus: 'behind', taskPercent: tp, milestonePercent: mp };
  }
  if (tp === 0 && mp === 0) {
    return { overallStatus: 'not_started', taskPercent: tp, milestonePercent: mp };
  }
  if (tp >= 50 || mp >= 50) {
    return { overallStatus: 'on_track', taskPercent: tp, milestonePercent: mp };
  }
  return { overallStatus: 'in_progress', taskPercent: tp, milestonePercent: mp };
}
