import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@trackbridge/shared';

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in required' } });
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You cannot access this resource' } });
    }
    next();
  };
}
