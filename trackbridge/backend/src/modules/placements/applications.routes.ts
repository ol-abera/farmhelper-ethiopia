import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { applySchema, proposeSchema, decisionSchema } from './placements.schema.js';
import * as svc from './placements.service.js';
import { prisma } from '../../db/prisma.js';

export const applicationsRouter = Router();
applicationsRouter.use(authenticate);

applicationsRouter.get('/', asyncHandler(async (req, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.user!.id } });
  res.json(await svc.listApplications(req.query as Record<string, unknown>, { ...req.user!, organizationId: u?.organizationId }));
}));

applicationsRouter.post('/', authorize('student'), validate({ body: applySchema }), asyncHandler(async (req, res) => {
  res.status(201).json({ application: await svc.apply(req.user!.id, req.body.positionId, req.body.coverNote) });
}));

applicationsRouter.post('/propose', authorize('student'), validate({ body: proposeSchema }), asyncHandler(async (req, res) => {
  res.status(201).json({ application: await svc.propose(req.user!.id, req.body) });
}));

applicationsRouter.post('/:id/recommend', authorize('host_organization', 'internship_supervisor', 'coordinator'), asyncHandler(async (req, res) => {
  res.json({ application: await svc.recommend(req.user!.id, req.params.id, String(req.body.recommendation || 'recommend_approve')) });
}));

applicationsRouter.post('/:id/decision', authorize('coordinator', 'administrator'), validate({ body: decisionSchema }), asyncHandler(async (req, res) => {
  res.json(await svc.decide(req.user!.id, req.params.id, req.body.decision, req.body.reason, req.body.overrideQuota));
}));
