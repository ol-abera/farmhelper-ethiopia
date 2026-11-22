import type { Role } from '@trackbridge/shared';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        role: Role;
        email: string;
        fullName: string;
      };
    }
  }
}

export {};
