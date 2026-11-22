import type { Request, Response } from 'express';
import * as svc from './supervisors.service.js';

export async function workload(_req: Request, res: Response) {
  res.json({ items: await svc.workload() });
}
export async function unassigned(_req: Request, res: Response) {
  res.json(await svc.unassigned());
}
export async function assign(req: Request, res: Response) {
  res.json(await svc.assign(req.user!.id, req.params.id, req.body.supervisorUserId, req.body.type, req.body.force));
}
