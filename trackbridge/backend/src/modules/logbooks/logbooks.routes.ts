import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { entrySchema, reviewSchema } from './logbooks.schema.js';
import * as c from './logbooks.controller.js';

export const logbooksRouter = Router();
logbooksRouter.use(authenticate);
logbooksRouter.get('/inbox', asyncHandler(c.inbox));
logbooksRouter.post('/:weekId', authorize('student'), validate({ body: entrySchema }), asyncHandler(c.save));
logbooksRouter.post('/:weekId/submit', authorize('student'), asyncHandler(c.submit));
logbooksRouter.post('/entries/:entryId/review', authorize('advisor', 'internship_supervisor', 'coordinator', 'administrator'), validate({ body: reviewSchema }), asyncHandler(c.review));
