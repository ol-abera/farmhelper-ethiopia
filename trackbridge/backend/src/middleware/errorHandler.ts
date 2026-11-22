import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, fields: err.fields },
    });
  }
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const i of err.issues) {
      fields[i.path.join('.') || 'body'] = i.message;
    }
    return res.status(400).json({
      error: { code: 'VALIDATION', message: 'Invalid request', fields },
    });
  }
  logger.error({ err }, 'unhandled');
  return res.status(500).json({
    error: {
      code: 'INTERNAL',
      message: env.NODE_ENV === 'production' ? 'Unexpected error' : (err as Error).message,
    },
  });
}

export function asyncHandler<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: T, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
