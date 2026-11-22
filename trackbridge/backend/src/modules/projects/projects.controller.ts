import type { Request, Response } from 'express';
import * as svc from './projects.service.js';
import * as tasks from './tasks.service.js';
import * as miles from './milestones.service.js';
import { compareTitle } from '../ai/titleSimilarity.service.js';

export async function list(req: Request, res: Response) {
  res.json({ items: await svc.listProjects(req.user!) });
}
export async function mine(req: Request, res: Response) {
  res.json({ project: await svc.myProject(req.user!.id) });
}
export async function create(req: Request, res: Response) {
  res.status(201).json(await svc.createProject(req.user!.id, req.body));
}
export async function submitTitle(req: Request, res: Response) {
  res.json(await svc.submitTitle(req.user!.id, req.params.id));
}
export async function similarity(req: Request, res: Response) {
  const p = await svc.myProject(req.user!.id);
  res.json(await compareTitle(String(req.query.title || p?.title || ''), req.params.id));
}
export async function reviewTitle(req: Request, res: Response) {
  res.json({ project: await svc.reviewTitle(req.user!.id, req.params.id, req.body.action, req.body.comment) });
}
export async function addTask(req: Request, res: Response) {
  res.status(201).json({ task: await tasks.addTask(req.params.id, req.body) });
}
export async function patchTask(req: Request, res: Response) {
  res.json({ task: await tasks.setTask(req.params.taskId, req.body.status) });
}
export async function addMilestone(req: Request, res: Response) {
  res.status(201).json({ milestone: await miles.addMilestone(req.params.id, req.body) });
}
export async function submitMilestone(req: Request, res: Response) {
  res.json({ milestone: await miles.submitMilestone(req.params.mid) });
}
export async function reviewMilestone(req: Request, res: Response) {
  res.json({ milestone: await miles.reviewMilestone(req.user!.id, req.params.mid, req.body.action, req.body.comment) });
}
