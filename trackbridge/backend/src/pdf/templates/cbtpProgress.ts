import { collectPdf, footerStamp, header, makePdf } from '../pdfkit.js';

export async function cbtpProgressPdf(lines: string[], cycleTitle: string) {
  const doc = makePdf();
  header(doc, 'CBTP progress report', cycleTitle);
  doc.fontSize(10).fillColor('#222').text(lines.join('\n') || 'No CBTP groups.');
  footerStamp(doc);
  return collectPdf(doc);
}
