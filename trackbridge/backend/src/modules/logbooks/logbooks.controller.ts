import type { Request, Response } from 'express';
import * as svc from './logbooks.service.js';

export async function list(req: Request, res: Response) {
  res.json({ items: await svc.listForPlacement(req.params.id) });
}
export async function save(req: Request, res: Response) {
  res.json({ entry: await svc.saveDraft(req.user!.id, req.params.weekId, req.body) });
}
export async function submit(req: Request, res: Response) {
  res.json({ entry: await svc.submit(req.user!.id, req.params.weekId) });
}
export async function review(req: Request, res: Response) {
  res.json({ entry: await svc.review(req.user!.id, req.params.entryId, req.body.action, req.body.body, req.user!.role) });
}
export async function inbox(req: Request, res: Response) {
  res.json({ items: await svc.inbox(req.user!.id, req.user!.role) });
}
