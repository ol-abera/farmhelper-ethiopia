import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString('hex');
}

export function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}
