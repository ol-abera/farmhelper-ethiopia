import PDFDocument from 'pdfkit';
import { env } from '../config/env.js';

export function makePdf(): PDFKit.PDFDocument {
  return new PDFDocument({ size: 'A4', margin: 50 });
}

export function header(doc: PDFKit.PDFDocument, title: string, subtitle?: string) {
  doc.fillColor('#0F3D38').fontSize(16).text(env.UNIVERSITY_NAME);
  doc.fontSize(11).fillColor('#5C4A32').text('TrackBridge — CBTP, Internship & Technical Projects');
  doc.moveDown(0.4);
  doc.fontSize(14).fillColor('#1A1A1A').text(title);
  if (subtitle) doc.fontSize(10).fillColor('#444').text(subtitle);
  doc.moveDown();
  doc.strokeColor('#C4723A').lineWidth(2).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown();
}

export function footerStamp(doc: PDFKit.PDFDocument) {
  const ts = new Date().toISOString();
  doc.fontSize(8).fillColor('#666').text(`Generated ${ts} · Advisory records — authorized staff retain final decisions.`, 50, 780, {
    width: 500,
  });
}

export function collectPdf(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c as Buffer));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}
