import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import * as svc from './reports.service.js';
import { cbtpProgressData } from './cbtpReport.service.js';
import { internshipActivityData } from './internshipReport.service.js';
import { projectStatusData } from './projectReport.service.js';
import { delayedWorkData } from './delayedWorkReport.service.js';

export const reportsRouter = Router();
reportsRouter.use(authenticate);
reportsRouter.get('/cbtp', asyncHandler(async (_req, res) => res.json({ items: await cbtpProgressData() })));
reportsRouter.get('/internship', asyncHandler(async (_req, res) => res.json({ items: await internshipActivityData() })));
reportsRouter.get('/projects', asyncHandler(async (_req, res) => res.json({ items: await projectStatusData() })));
reportsRouter.get('/delayed', asyncHandler(async (_req, res) => res.json({ items: await delayedWorkData() })));
reportsRouter.get('/:kind/pdf', authorize('coordinator', 'administrator', 'advisor', 'internship_supervisor'), asyncHandler(async (req, res) => {
  const kind = req.params.kind as 'cbtp' | 'internship' | 'project' | 'delayed';
  const buf = await svc.reportPdf(kind);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${kind}-report.pdf"`);
  res.send(buf);
}));
reportsRouter.get('/:kind/csv', authorize('coordinator', 'administrator'), asyncHandler(async (req, res) => {
  const kind = req.params.kind;
  const rows =
    kind === 'cbtp'
      ? await cbtpProgressData()
      : kind === 'internship'
        ? await internshipActivityData()
        : kind === 'project'
          ? await projectStatusData()
          : await delayedWorkData();
  res.setHeader('Content-Type', 'text/csv');
  res.send(svc.toCsv(rows as object[]));
}));
reportsRouter.get('/students/:id/progress', asyncHandler(async (req, res) => {
  if (req.user!.role === 'student' && req.user!.id !== req.params.id) {
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not your report' } });
    return;
  }
  const buf = await svc.studentPack(req.params.id);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(buf);
}));

export const archiveRouter = Router();
archiveRouter.use(authenticate);
archiveRouter.get('/', asyncHandler(async (req, res) => {
  res.json(await svc.archiveSearch(String(req.query.q || '')));
}));
