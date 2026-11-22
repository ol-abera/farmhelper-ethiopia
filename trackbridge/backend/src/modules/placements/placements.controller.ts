import type { Request, Response } from 'express';
import * as svc from './placements.service.js';
import { generateLetter } from './placementLetter.service.js';
import { getFile } from '../files/files.service.js';

export async function list(req: Request, res: Response) {
  res.json(await svc.listPlacements(req.query as Record<string, unknown>, req.user!));
}
export async function get(req: Request, res: Response) {
  res.json({ placement: await svc.getPlacement(req.params.id) });
}
export async function letter(req: Request, res: Response) {
  const p = await svc.getPlacement(req.params.id);
  let docId = p.letterDocumentId;
  if (!docId) {
    const doc = await generateLetter(req.user!.id, p.id);
    docId = doc.id;
  }
  const { doc, buf } = await getFile(docId);
  res.setHeader('Content-Type', doc.mime);
  res.setHeader('Content-Disposition', `attachment; filename="${doc.originalName}"`);
  res.send(buf);
}
export async function complete(req: Request, res: Response) {
  res.json({ placement: await svc.completeOrCancel(req.user!.id, req.params.id, 'completed', String(req.body.reason || 'completed')) });
}
export async function cancel(req: Request, res: Response) {
  res.json({ placement: await svc.completeOrCancel(req.user!.id, req.params.id, 'cancelled', String(req.body.reason || 'cancelled')) });
}
