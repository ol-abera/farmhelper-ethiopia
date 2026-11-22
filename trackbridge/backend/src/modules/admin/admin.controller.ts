import type { Request, Response } from 'express';
import * as users from '../users/users.service.js';
import * as admin from './admin.service.js';
import * as faq from './faqAdmin.service.js';

export async function listUsers(req: Request, res: Response) {
  res.json(await users.listUsers(req.query as Record<string, unknown>));
}
export async function createUser(req: Request, res: Response) {
  res.status(201).json({ user: await users.createUser(req.user!.id, req.body) });
}
export async function setRole(req: Request, res: Response) {
  res.json({ user: await admin.setRole(req.user!.id, req.params.id, req.body.role) });
}
export async function config(req: Request, res: Response) {
  if (req.method === 'PUT' || req.method === 'POST') {
    res.json({ config: await admin.putConfig(req.user!.id, req.body.key, req.body.value) });
  } else {
    res.json({ config: await admin.getConfig() });
  }
}
export async function faqs(req: Request, res: Response) {
  res.json({ items: await faq.listFaq(true) });
}
export async function createFaq(req: Request, res: Response) {
  res.status(201).json({ faq: await faq.createFaq(req.user!.id, req.body) });
}
export async function publish(req: Request, res: Response) {
  res.json({ faq: await faq.publishFaq(req.user!.id, req.params.id, req.body.approved !== false) });
}
