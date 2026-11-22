import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { cycleSchema } from './cycles.schema.js';
import * as c from './cycles.controller.js';

export const cyclesRouter = Router();
cyclesRouter.use(authenticate);
cyclesRouter.get('/', asyncHandler(c.list));
cyclesRouter.get('/current', asyncHandler(c.current));
cyclesRouter.post('/', authorize('coordinator', 'administrator'), validate({ body: cycleSchema }), asyncHandler(c.create));
cyclesRouter.patch('/:id', authorize('coordinator', 'administrator'), asyncHandler(c.update));
cyclesRouter.post('/:id/archive', authorize('coordinator', 'administrator'), asyncHandler(c.archive));
