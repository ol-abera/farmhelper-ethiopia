import { collectPdf, footerStamp, header, makePdf } from '../pdfkit.js';

export async function progressReportPdf(input: {
  studentName: string;
  studentId: string;
  cycleTitle: string;
  placement?: string;
  logbookLines: string[];
  projectLines: string[];
  cbtpLines: string[];
  outstanding: string[];
}) {
  const doc = makePdf();
  header(doc, 'Student progress report', `${input.studentName} · ${input.studentId} · ${input.cycleTitle}`);
  if (input.placement) doc.fontSize(11).text(`Placement: ${input.placement}`).moveDown(0.5);
  doc.fontSize(12).fillColor('#0F3D38').text('Logbooks');
  doc.fontSize(10).fillColor('#222').text(input.logbookLines.join('\n') || 'No logbook weeks.');
  doc.moveDown();
  doc.fontSize(12).fillColor('#0F3D38').text('Technical project');
  doc.fontSize(10).fillColor('#222').text(input.projectLines.join('\n') || 'No project.');
  doc.moveDown();
  doc.fontSize(12).fillColor('#0F3D38').text('CBTP');
  doc.fontSize(10).fillColor('#222').text(input.cbtpLines.join('\n') || 'No CBTP records.');
  doc.moveDown();
  doc.fontSize(12).fillColor('#0F3D38').text('Outstanding items');
  doc.fontSize(10).fillColor('#222').text(input.outstanding.join('\n') || 'None listed.');
  footerStamp(doc);
  return collectPdf(doc);
}
