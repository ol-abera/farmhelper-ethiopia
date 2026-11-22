import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { createUserSchema, profileSchema } from './users.schema.js';
import * as c from './users.controller.js';

export const usersRouter = Router();
usersRouter.use(authenticate);

usersRouter.get('/me', asyncHandler(async (req, res) => {
  const { prisma } = await import('../../db/prisma.js');
  const { toUserDto } = await import('../auth/auth.service.js');
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  res.json({ user: user ? toUserDto(user) : null });
}));
usersRouter.patch('/me', validate({ body: profileSchema }), asyncHandler(c.profile));
usersRouter.get('/', authorize('administrator', 'coordinator'), asyncHandler(c.list));
usersRouter.post('/', authorize('administrator', 'coordinator'), validate({ body: createUserSchema }), asyncHandler(c.create));
usersRouter.post('/:id/approve', authorize('administrator', 'coordinator'), asyncHandler(c.approve));
usersRouter.post('/:id/activate', authorize('administrator', 'coordinator'), asyncHandler(c.activate));
usersRouter.post('/:id/deactivate', authorize('administrator', 'coordinator'), asyncHandler(c.deactivate));
usersRouter.post('/:id/flag', authorize('coordinator', 'administrator'), asyncHandler(c.flag));
usersRouter.post('/:id/cycle', authorize('coordinator', 'administrator'), asyncHandler(c.cycle));
usersRouter.get('/audit', authorize('administrator', 'coordinator'), asyncHandler(c.auditLog));
