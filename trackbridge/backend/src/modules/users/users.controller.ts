import type { Request, Response } from 'express';
import * as svc from './users.service.js';

export async function list(req: Request, res: Response) {
  res.json(await svc.listUsers(req.query as Record<string, unknown>));
}
export async function create(req: Request, res: Response) {
  res.status(201).json({ user: await svc.createUser(req.user!.id, req.body) });
}
export async function approve(req: Request, res: Response) {
  res.json({ user: await svc.approveStudent(req.user!.id, req.params.id, req.body.cycleId) });
}
export async function activate(req: Request, res: Response) {
  res.json({ user: await svc.setActive(req.user!.id, req.params.id, req.body.isActive !== false) });
}
export async function deactivate(req: Request, res: Response) {
  res.json({ user: await svc.setActive(req.user!.id, req.params.id, false) });
}
export async function profile(req: Request, res: Response) {
  res.json({ user: await svc.updateProfile(req.user!.id, req.body) });
}
export async function flag(req: Request, res: Response) {
  res.json({ user: await svc.flagAtRisk(req.user!.id, req.params.id, Boolean(req.body.flagged)) });
}
export async function cycle(req: Request, res: Response) {
  res.json({ user: await svc.assignCycle(req.user!.id, req.params.id, req.body.cycleId) });
}
export async function auditLog(req: Request, res: Response) {
  res.json(await svc.listAudit(req.query as Record<string, unknown>));
}
