import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { messageSchema } from './communications.schema.js';
import * as svc from './messages.service.js';

export const messagesRouter = Router();
messagesRouter.use(authenticate);
messagesRouter.get('/', asyncHandler(async (req, res) => {
  res.json({ items: await svc.listThreads(req.user!.id) });
}));
messagesRouter.get('/:id', asyncHandler(async (req, res) => {
  res.json({ thread: await svc.getThread(req.params.id) });
}));
messagesRouter.post('/', validate({ body: messageSchema }), asyncHandler(async (req, res) => {
  res.status(201).json({ message: await svc.postMessage(req.user!.id, req.body) });
}));
