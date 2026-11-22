import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import * as svc from './attendance.service.js';

export const attendanceRouter = Router();
attendanceRouter.use(authenticate);
attendanceRouter.get('/placements/:id/attendance', asyncHandler(async (req, res) => {
  res.json({ items: await svc.listAttendance(req.params.id) });
}));
attendanceRouter.post('/placements/:id/attendance', authorize('student', 'internship_supervisor', 'host_organization', 'coordinator'), asyncHandler(async (req, res) => {
  res.status(201).json({ attendance: await svc.recordAttendance(req.user!.id, req.user!.role, req.params.id, req.body) });
}));
attendanceRouter.post('/attendance/:id/confirm', authorize('internship_supervisor', 'host_organization', 'coordinator'), asyncHandler(async (req, res) => {
  res.json({ attendance: await svc.confirmAttendance(req.user!.id, req.params.id, req.body.notes) });
}));
