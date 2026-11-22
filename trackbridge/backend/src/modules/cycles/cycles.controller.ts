import type { Request, Response } from 'express';
import * as svc from './cycles.service.js';

export async function list(_req: Request, res: Response) {
  res.json(await svc.listCycles());
}
export async function current(_req: Request, res: Response) {
  res.json({ cycle: await svc.currentCycle() });
}
export async function create(req: Request, res: Response) {
  res.status(201).json({ cycle: await svc.createCycle(req.user!.id, req.body) });
}
export async function update(req: Request, res: Response) {
  res.json({ cycle: await svc.updateCycle(req.user!.id, req.params.id, req.body) });
}
export async function archive(req: Request, res: Response) {
  res.json({ cycle: await svc.archiveCycle(req.user!.id, req.params.id) });
}
