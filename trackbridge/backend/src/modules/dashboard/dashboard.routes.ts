import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { forUser } from './dashboard.service.js';

export const dashboardRouter = Router();
dashboardRouter.use(authenticate);
dashboardRouter.get('/', asyncHandler(async (req, res) => {
  res.json(await forUser(req.user!));
}));
