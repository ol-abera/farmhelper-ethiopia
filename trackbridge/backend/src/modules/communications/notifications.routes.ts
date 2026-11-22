import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { prisma } from '../../db/prisma.js';
import { announce } from './announcements.service.js';

export const notificationsRouter = Router();
notificationsRouter.use(authenticate);
notificationsRouter.get('/', asyncHandler(async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json({ items, unread: items.filter((i) => !i.readAt).length });
}));
notificationsRouter.post('/:id/read', asyncHandler(async (req, res) => {
  await prisma.notification.update({ where: { id: req.params.id }, data: { readAt: new Date() } });
  res.json({ ok: true });
}));
notificationsRouter.post('/read-all', asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user!.id, readAt: null }, data: { readAt: new Date() } });
  res.json({ ok: true });
}));
notificationsRouter.post('/announce', authorize('coordinator', 'administrator'), asyncHandler(async (req, res) => {
  res.status(201).json({ announcement: await announce(req.user!.id, req.body) });
}));
