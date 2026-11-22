import { prisma } from '../../db/prisma.js';
import { HttpError } from '../../middleware/errorHandler.js';
import { ALLOWED_EXTENSIONS } from '../../config/constants.js';
import { env } from '../../config/env.js';
import { saveBuffer, readStored } from './storage.local.js';
import { createHash } from 'node:crypto';
import path from 'node:path';
import type { DocumentType } from '@prisma/client';

export async function storeUpload(
  userId: string,
  type: DocumentType,
  file: { originalname: string; mimetype: string; buffer: Buffer; size: number },
) {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    throw new HttpError(400, 'FILE_TYPE', `File type .${ext} is not allowed`);
  }
  if (file.size > env.MAX_FILE_MB * 1024 * 1024) {
    throw new HttpError(400, 'FILE_TOO_LARGE', `Maximum size is ${env.MAX_FILE_MB} MB`);
  }
  const { storagePath } = await saveBuffer(file.originalname, file.buffer);
  return prisma.document.create({
    data: {
      type,
      storagePath,
      originalName: file.originalname,
      mime: file.mimetype,
      size: file.size,
      uploadedBy: userId,
      sha256: createHash('sha256').update(file.buffer).digest('hex'),
    },
  });
}

export async function getFile(id: string) {
  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) throw new HttpError(404, 'NOT_FOUND', 'File not found');
  const buf = await readStored(doc.storagePath);
  return { doc, buf };
}
