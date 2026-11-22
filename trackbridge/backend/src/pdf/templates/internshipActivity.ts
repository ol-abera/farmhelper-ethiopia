import { collectPdf, footerStamp, header, makePdf } from '../pdfkit.js';

export async function internshipActivityPdf(lines: string[], cycleTitle: string) {
  const doc = makePdf();
  header(doc, 'Internship activity report', cycleTitle);
  doc.fontSize(10).fillColor('#222').text(lines.join('\n') || 'No placements.');
  footerStamp(doc);
  return collectPdf(doc);
}
