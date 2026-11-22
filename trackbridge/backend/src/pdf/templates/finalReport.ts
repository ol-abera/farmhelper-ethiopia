import { collectPdf, footerStamp, header, makePdf } from '../pdfkit.js';

export async function finalReportPdf(input: {
  studentName: string;
  studentId: string;
  cycleTitle: string;
  placement?: string;
  logbookSummary: string;
  projectSummary: string;
  cbtpSummary: string;
  scores: string;
  files: string[];
}) {
  const doc = makePdf();
  header(doc, 'Final student report', `${input.studentName} · ${input.studentId} · ${input.cycleTitle}`);
  doc.fontSize(11).fillColor('#222');
  if (input.placement) doc.text(`Placement: ${input.placement}`).moveDown(0.4);
  doc.text(input.logbookSummary).moveDown(0.4);
  doc.text(input.projectSummary).moveDown(0.4);
  doc.text(input.cbtpSummary).moveDown(0.4);
  doc.text(input.scores).moveDown(0.4);
  doc.text(`Stored files: ${input.files.join(', ') || 'none'}`);
  footerStamp(doc);
  return collectPdf(doc);
}
