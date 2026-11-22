import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { env } from '../../config/env.js';

export async function saveBuffer(originalName: string, buffer: Buffer) {
  const ext = path.extname(originalName).toLowerCase().replace('.', '') || 'bin';
  const stored = `${randomUUID()}.${ext}`;
  await mkdir(env.UPLOAD_DIR, { recursive: true });
  const storagePath = path.join(env.UPLOAD_DIR, stored);
  await writeFile(storagePath, buffer);
  return { storagePath, stored };
}

export async function readStored(storagePath: string) {
  return readFile(storagePath);
}
