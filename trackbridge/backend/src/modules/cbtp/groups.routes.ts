import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { groupSchema } from './cbtp.schema.js';
import * as groups from './groups.service.js';

export const cbtpGroupsRouter = Router();
cbtpGroupsRouter.use(authenticate);
cbtpGroupsRouter.get('/', asyncHandler(async (req, res) => {
  res.json({ items: await groups.listGroups(req.user!) });
}));
cbtpGroupsRouter.post('/', authorize('coordinator', 'administrator'), validate({ body: groupSchema }), asyncHandler(async (req, res) => {
  res.status(201).json({ group: await groups.createGroup(req.user!.id, req.body) });
}));
cbtpGroupsRouter.post('/:id/members', authorize('coordinator', 'administrator'), asyncHandler(async (req, res) => {
  res.status(201).json({
    member: await groups.addMember(req.user!.id, req.params.id, req.body.studentId, Boolean(req.body.exception)),
  });
}));
