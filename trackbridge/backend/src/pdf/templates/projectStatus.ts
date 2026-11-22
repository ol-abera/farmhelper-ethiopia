import { collectPdf, footerStamp, header, makePdf } from '../pdfkit.js';

export async function projectStatusPdf(lines: string[], cycleTitle: string) {
  const doc = makePdf();
  header(doc, 'Technical project status', cycleTitle);
  doc.fontSize(10).fillColor('#222').text(lines.join('\n') || 'No projects.');
  footerStamp(doc);
  return collectPdf(doc);
}
