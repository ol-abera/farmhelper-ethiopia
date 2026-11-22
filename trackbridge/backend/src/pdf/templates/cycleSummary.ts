import { collectPdf, footerStamp, header, makePdf } from '../pdfkit.js';

export async function cycleSummaryPdf(input: { cycleTitle: string; lines: string[] }) {
  const doc = makePdf();
  header(doc, 'Cycle summary', input.cycleTitle);
  doc.fontSize(11).fillColor('#222').text(input.lines.join('\n'));
  footerStamp(doc);
  return collectPdf(doc);
}
