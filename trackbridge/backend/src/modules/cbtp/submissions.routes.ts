import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { reviewSchema, submissionSchema } from './cbtp.schema.js';
import * as sub from './submissions.service.js';

export const cbtpSubmissionsRouter = Router();
cbtpSubmissionsRouter.use(authenticate);
cbtpSubmissionsRouter.get('/', asyncHandler(async (req, res) => {
  res.json({ items: await sub.listSubmissions(req.user!, req.query.groupId as string | undefined) });
}));
cbtpSubmissionsRouter.post('/', authorize('student'), validate({ body: submissionSchema }), asyncHandler(async (req, res) => {
  res.status(201).json({ submission: await sub.createSubmission(req.user!.id, req.body) });
}));
cbtpSubmissionsRouter.post('/:id/submit', authorize('student'), asyncHandler(async (req, res) => {
  res.json({ submission: await sub.submitDoc(req.user!.id, req.params.id) });
}));
cbtpSubmissionsRouter.post('/:id/review', authorize('advisor', 'coordinator', 'administrator'), validate({ body: reviewSchema }), asyncHandler(async (req, res) => {
  res.json({ submission: await sub.reviewDoc(req.user!.id, req.params.id, req.body.action, req.body.body, req.user!.role) });
}));
