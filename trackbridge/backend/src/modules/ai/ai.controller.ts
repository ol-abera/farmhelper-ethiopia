import type { Request, Response } from 'express';
import * as matching from './matching.service.js';
import * as rec from './recommend.service.js';
import * as warn from './earlyWarning.service.js';
import * as sum from './summarize.service.js';
import * as titles from './titleSimilarity.service.js';
import * as faq from './faq.service.js';
import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';

export async function match(req: Request, res: Response) {
  if (req.query.opportunityId || req.body.opportunityId) {
    if (!['coordinator', 'administrator', 'host_organization'].includes(req.user!.role)) {
      throw new HttpError(403, 'FORBIDDEN', 'Not allowed to rank students');
    }
    res.json({ items: await matching.matchForOpportunity(String(req.query.opportunityId || req.body.opportunityId)), advisory: true });
    return;
  }
  const studentId = String(req.query.studentId || req.body.studentId || req.user!.id);
  if (req.user!.role === 'student' && studentId !== req.user!.id) {
    throw new HttpError(403, 'FORBIDDEN', 'Students may only see matches for themselves');
  }
  res.json({ items: await matching.matchForStudent(studentId), advisory: true });
}

export async function recommend(req: Request, res: Response) {
  const studentId = req.user!.role === 'student' ? req.user!.id : String(req.query.studentId || req.user!.id);
  res.json({ items: await rec.recommendForStudent(studentId), advisory: true });
}

export async function warnings(req: Request, res: Response) {
  let items = await warn.computeWarnings();
  if (req.user!.role === 'student') items = items.filter((i) => i.studentId === req.user!.id);
  if (req.user!.role === 'advisor') {
    const assigned = await prisma.supervisorAssignment.findMany({
      where: { supervisorUserId: req.user!.id, endedAt: null },
      select: { placement: { select: { studentId: true } } },
    });
    const ids = new Set(assigned.map((a) => a.placement.studentId));
    const groups = await prisma.cbtpGroup.findMany({ where: { advisorId: req.user!.id }, include: { members: true } });
    for (const g of groups) for (const m of g.members) ids.add(m.studentId);
    items = items.filter((i) => ids.has(i.studentId));
  }
  res.json({
    items,
    advisory: true,
    disclaimer: 'These flags do not establish student failure. Authorized staff review them.',
  });
}

export async function summarize(req: Request, res: Response) {
  res.json(await sum.summarizeText(req.user!.id, String(req.body.text || ''), req.body.sourceType, req.body.sourceId));
}

export async function titleSimilarity(req: Request, res: Response) {
  res.json(await titles.compareTitle(req.body.title || String(req.query.title || ''), req.body.projectId));
}

export async function chatbot(req: Request, res: Response) {
  res.json(await faq.askFaq(req.user!.id, req.body.question));
}
