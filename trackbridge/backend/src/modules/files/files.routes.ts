import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { getFile } from './files.service.js';

export const filesRouter = Router();
filesRouter.use(authenticate);
filesRouter.get('/:id', asyncHandler(async (req, res) => {
  const { doc, buf } = await getFile(req.params.id);
  res.setHeader('Content-Type', doc.mime);
  res.setHeader('Content-Disposition', `attachment; filename="${doc.originalName}"`);
  res.send(buf);
}));
