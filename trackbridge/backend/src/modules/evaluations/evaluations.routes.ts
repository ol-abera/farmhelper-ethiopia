import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { evalSchema } from './evaluations.schema.js';
import * as svc from './evaluations.service.js';
import { rubricsForCycle } from './rubrics.service.js';
import { prisma } from '../../db/prisma.js';

export const evaluationsRouter = Router();
evaluationsRouter.use(authenticate);
evaluationsRouter.get('/', asyncHandler(async (req, res) => {
  res.json({ items: await svc.inbox(req.user!.id, req.user!.role) });
}));
evaluationsRouter.get('/rubrics', asyncHandler(async (_req, res) => {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  res.json({ items: cycle ? await rubricsForCycle(cycle.id) : [] });
}));
evaluationsRouter.post('/', authorize('advisor', 'internship_supervisor', 'coordinator', 'host_organization'), validate({ body: evalSchema }), asyncHandler(async (req, res) => {
  res.json({ evaluation: await svc.upsert(req.user!.id, req.body) });
}));
evaluationsRouter.post('/lock', authorize('coordinator', 'administrator'), asyncHandler(async (req, res) => {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  res.json({ cycle: cycle ? await svc.lock(req.user!.id, cycle.id) : null });
}));
evaluationsRouter.post('/publish', authorize('coordinator', 'administrator'), asyncHandler(async (req, res) => {
  const cycle = await prisma.cycle.findFirst({ where: { isOpen: true } });
  res.json({ cycle: cycle ? await svc.publish(req.user!.id, cycle.id) : null });
}));
