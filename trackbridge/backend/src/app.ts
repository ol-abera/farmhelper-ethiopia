import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { cyclesRouter } from './modules/cycles/cycles.routes.js';
import { periodsRouter } from './modules/periods/periods.routes.js';
import { organizationsRouter, positionsRouter } from './modules/organizations/organizations.routes.js';
import { applicationsRouter } from './modules/placements/applications.routes.js';
import { placementsRouter } from './modules/placements/placements.routes.js';
import { supervisorsRouter, placementSupervisorsRouter } from './modules/supervisors/supervisors.routes.js';
import { logbooksRouter } from './modules/logbooks/logbooks.routes.js';
import { list as listLogbooks } from './modules/logbooks/logbooks.controller.js';
import { authenticate } from './middleware/authenticate.js';
import { asyncHandler } from './middleware/errorHandler.js';
import { cbtpSitesRouter } from './modules/cbtp/sites.routes.js';
import { cbtpGroupsRouter } from './modules/cbtp/groups.routes.js';
import { cbtpSubmissionsRouter } from './modules/cbtp/submissions.routes.js';
import { attendanceRouter } from './modules/internships/attendance.routes.js';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { evaluationsRouter } from './modules/evaluations/evaluations.routes.js';
import { messagesRouter } from './modules/communications/messages.routes.js';
import { notificationsRouter } from './modules/communications/notifications.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';
import { reportsRouter, archiveRouter } from './modules/reports/reports.routes.js';
import { filesRouter } from './modules/files/files.routes.js';
import { aiRouter } from './modules/ai/ai.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import * as internTasks from './modules/internships/internshipTasks.service.js';
import { authorize } from './middleware/authorize.js';
import { prisma } from './db/prisma.js';

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.APP_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(requestId);

app.get('/health', (_req, res) => res.json({ ok: true, name: 'trackbridge-api' }));
app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

const v1 = express.Router();
v1.use('/auth', authRouter);
v1.use('/users', usersRouter);
v1.use('/admin', adminRouter);
v1.use('/cycles', cyclesRouter);
v1.use('/periods', periodsRouter);
v1.use('/organizations', organizationsRouter);
v1.use('/positions', positionsRouter);
v1.use('/opportunities', positionsRouter);
v1.use('/applications', applicationsRouter);
v1.use('/placements', placementsRouter);
v1.use('/placements/:id/supervisors', placementSupervisorsRouter);
v1.get('/placements/:id/logbooks', authenticate, asyncHandler(listLogbooks));
v1.use('/supervisors', supervisorsRouter);
v1.use('/logbooks', logbooksRouter);
v1.use('/cbtp/sites', cbtpSitesRouter);
v1.use('/cbtp/groups', cbtpGroupsRouter);
v1.use('/cbtp/submissions', cbtpSubmissionsRouter);
v1.use('/cbtp/activities', cbtpSitesRouter);
v1.use('/', attendanceRouter);
v1.use('/projects', projectsRouter);
v1.use('/evaluations', evaluationsRouter);
v1.use('/messages', messagesRouter);
v1.use('/notifications', notificationsRouter);
v1.use('/dashboard', dashboardRouter);
v1.use('/reports', reportsRouter);
v1.use('/archive', archiveRouter);
v1.use('/files', filesRouter);
v1.use('/ai', aiRouter);

v1.get('/placements/:id/tasks', authenticate, asyncHandler(async (req, res) => {
  res.json({ items: await internTasks.listTasks(req.params.id) });
}));
v1.post(
  '/placements/:id/tasks',
  authenticate,
  authorize('internship_supervisor', 'coordinator', 'host_organization'),
  asyncHandler(async (req, res) => {
    res.status(201).json({ task: await internTasks.createTask(req.user!.id, req.params.id, req.body) });
  }),
);
v1.patch('/internship-tasks/:id', authenticate, asyncHandler(async (req, res) => {
  res.json({ task: await internTasks.setTaskStatus(req.params.id, req.body.status) });
}));

v1.use(async (req, _res, next) => {
  if (req.user) {
    await prisma.user.update({ where: { id: req.user.id }, data: { lastActivityAt: new Date() } }).catch(() => undefined);
  }
  next();
});

app.use('/api/v1', v1);
app.use(errorHandler);
