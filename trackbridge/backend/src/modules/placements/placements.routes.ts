import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import * as c from './placements.controller.js';

export const placementsRouter = Router();
placementsRouter.use(authenticate);
placementsRouter.get('/', asyncHandler(c.list));
placementsRouter.get('/:id', asyncHandler(c.get));
placementsRouter.get('/:id/letter', asyncHandler(c.letter));
placementsRouter.post('/:id/letter', authorize('coordinator', 'administrator'), asyncHandler(c.letter));
placementsRouter.post('/:id/complete', authorize('coordinator', 'administrator'), asyncHandler(c.complete));
placementsRouter.post('/:id/cancel', authorize('coordinator', 'administrator'), asyncHandler(c.cancel));
