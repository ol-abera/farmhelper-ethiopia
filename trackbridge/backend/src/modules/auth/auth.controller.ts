import type { Request, Response } from 'express';
import { REFRESH_COOKIE } from '../../config/constants.js';
import * as svc from './auth.service.js';

export async function register(req: Request, res: Response) {
  const user = await svc.register(req.body);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const result = await svc.login(res, req.body.email, req.body.password, req.ip);
  res.json(result);
}

export async function refresh(req: Request, res: Response) {
  const result = await svc.refresh(res, req.cookies?.[REFRESH_COOKIE]);
  res.json(result);
}

export async function logout(req: Request, res: Response) {
  await svc.logout(res, req.cookies?.[REFRESH_COOKIE], req.user?.id);
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  const { prisma } = await import('../../db/prisma.js');
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  res.json({ user: user ? svc.toUserDto(user) : null });
}

export async function forgot(req: Request, res: Response) {
  await svc.forgotPassword(req.body.email);
  res.json({ ok: true, message: 'If the account exists, a reset email was queued.' });
}

export async function reset(req: Request, res: Response) {
  await svc.resetPassword(req.body.token, req.body.password);
  res.json({ ok: true });
}
