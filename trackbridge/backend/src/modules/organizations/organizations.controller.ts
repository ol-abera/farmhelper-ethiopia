import type { Request, Response } from 'express';
import * as svc from './organizations.service.js';

export async function list(req: Request, res: Response) {
  const staff = ['coordinator', 'administrator'].includes(req.user!.role);
  res.json(await svc.listOrgs(req.query as Record<string, unknown>, staff));
}
export async function get(req: Request, res: Response) {
  res.json({ organization: await svc.getOrg(req.params.id) });
}
export async function create(req: Request, res: Response) {
  res.status(201).json({ organization: await svc.createOrg(req.user!.id, req.body) });
}
export async function update(req: Request, res: Response) {
  res.json({ organization: await svc.updateOrg(req.user!.id, req.params.id, req.body) });
}
export async function archive(req: Request, res: Response) {
  res.json({ organization: await svc.archiveOrg(req.user!.id, req.params.id) });
}
export async function addPosition(req: Request, res: Response) {
  res.status(201).json({ position: await svc.createPosition(req.user!.id, req.params.id, req.body) });
}
export async function patchPosition(req: Request, res: Response) {
  res.json({ position: await svc.updatePosition(req.user!.id, req.params.id, req.body) });
}
export async function openPositions(req: Request, res: Response) {
  res.json(await svc.listOpenPositions(req.query as Record<string, unknown>));
}
