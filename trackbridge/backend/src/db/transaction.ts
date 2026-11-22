import type { Prisma } from '@prisma/client';
import { prisma } from './prisma.js';

export function transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
  return prisma.$transaction(fn);
}
