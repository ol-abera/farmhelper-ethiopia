import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { z } from 'zod';
import { orgSchema, positionSchema } from './organizations.schema.js';
import * as c from './organizations.controller.js';
import { prisma } from '../../db/prisma.js';
import * as orgSvc from './organizations.service.js';

export const organizationsRouter = Router();
organizationsRouter.use(authenticate);
organizationsRouter.get('/', asyncHandler(c.list));
organizationsRouter.get('/:id', asyncHandler(c.get));
organizationsRouter.post('/', authorize('coordinator', 'administrator', 'host_organization'), validate({ body: orgSchema }), asyncHandler(c.create));
organizationsRouter.patch('/:id', authorize('coordinator', 'administrator', 'host_organization'), asyncHandler(c.update));
organizationsRouter.post('/:id/archive', authorize('coordinator', 'administrator'), asyncHandler(c.archive));
organizationsRouter.post('/:id/positions', authorize('coordinator', 'administrator', 'host_organization'), validate({ body: positionSchema }), asyncHandler(c.addPosition));

export const positionsRouter = Router();
positionsRouter.use(authenticate);
positionsRouter.get('/', asyncHandler(c.openPositions));
positionsRouter.post(
  '/',
  authorize('coordinator', 'administrator', 'host_organization'),
  validate({ body: positionSchema.extend({ organizationId: z.string().optional() }) }),
  asyncHandler(async (req, res) => {
    const me = await prisma.user.findUnique({ where: { id: req.user!.id } });
    const orgId = String(req.body.organizationId || me?.organizationId || '');
    res.status(201).json({ position: await orgSvc.createPosition(req.user!.id, orgId, req.body) });
  }),
);
positionsRouter.patch('/:id', authorize('coordinator', 'administrator', 'host_organization'), asyncHandler(c.patchPosition));
