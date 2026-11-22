import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { createUserSchema } from '../users/users.schema.js';
import { faqSchema, roleSchema } from './admin.schema.js';
import * as c from './admin.controller.js';
import { listAudit } from '../users/users.service.js';

export const adminRouter = Router();
adminRouter.use(authenticate, authorize('administrator', 'coordinator'));
adminRouter.get('/users', asyncHandler(c.listUsers));
adminRouter.post('/users', authorize('administrator', 'coordinator'), validate({ body: createUserSchema }), asyncHandler(c.createUser));
adminRouter.patch('/users/:id/role', authorize('administrator'), validate({ body: roleSchema }), asyncHandler(c.setRole));
adminRouter.get('/config', asyncHandler(c.config));
adminRouter.put('/config', authorize('administrator'), asyncHandler(c.config));
adminRouter.get('/faq', asyncHandler(c.faqs));
adminRouter.post('/faq', authorize('administrator'), validate({ body: faqSchema }), asyncHandler(c.createFaq));
adminRouter.post('/faq/:id/publish', authorize('administrator'), asyncHandler(c.publish));
adminRouter.get('/audit', asyncHandler(async (req, res) => {
  res.json(await listAudit(req.query as Record<string, unknown>));
}));
