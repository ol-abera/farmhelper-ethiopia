import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { assignSchema } from './supervisors.schema.js';
import * as c from './supervisors.controller.js';

export const supervisorsRouter = Router();
supervisorsRouter.use(authenticate);
supervisorsRouter.get('/workload', authorize('coordinator', 'administrator'), asyncHandler(c.workload));
supervisorsRouter.get('/unassigned', authorize('coordinator', 'administrator'), asyncHandler(c.unassigned));
export const placementSupervisorsRouter = Router({ mergeParams: true });
placementSupervisorsRouter.use(authenticate);
placementSupervisorsRouter.post('/', authorize('coordinator', 'administrator', 'host_organization'), validate({ body: assignSchema }), asyncHandler(c.assign));
