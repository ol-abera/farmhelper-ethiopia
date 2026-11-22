import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { activitySchema, siteSchema } from './cbtp.schema.js';
import * as sites from './sites.service.js';

export const cbtpSitesRouter = Router();
cbtpSitesRouter.use(authenticate);
cbtpSitesRouter.get('/', asyncHandler(async (req, res) => {
  res.json(await sites.listSites(req.query as Record<string, unknown>));
}));
cbtpSitesRouter.get('/:id', asyncHandler(async (req, res) => {
  res.json({ site: await sites.getSite(req.params.id) });
}));
cbtpSitesRouter.post('/', authorize('coordinator', 'administrator'), validate({ body: siteSchema }), asyncHandler(async (req, res) => {
  res.status(201).json({ site: await sites.createSite(req.user!.id, req.body) });
}));
cbtpSitesRouter.patch('/:id', authorize('coordinator', 'administrator'), asyncHandler(async (req, res) => {
  res.json({ site: await sites.updateSite(req.user!.id, req.params.id, req.body) });
}));
cbtpSitesRouter.post('/:id/archive', authorize('coordinator', 'administrator'), asyncHandler(async (req, res) => {
  res.json({ site: await sites.archiveSite(req.user!.id, req.params.id) });
}));
cbtpSitesRouter.post('/:id/activities', authorize('coordinator', 'administrator'), validate({ body: activitySchema }), asyncHandler(async (req, res) => {
  res.status(201).json({ activity: await sites.createActivity(req.user!.id, req.params.id, req.body) });
}));
