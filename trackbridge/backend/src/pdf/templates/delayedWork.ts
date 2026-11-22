import { collectPdf, footerStamp, header, makePdf } from '../pdfkit.js';

export async function delayedWorkPdf(lines: string[], cycleTitle: string) {
  const doc = makePdf();
  header(doc, 'Delayed work report', cycleTitle);
  doc.fontSize(10).fillColor('#222').text(
    'These items are rule-based early warnings. They do not establish student failure.\n\n' + (lines.join('\n') || 'None.'),
  );
  footerStamp(doc);
  return collectPdf(doc);
}
