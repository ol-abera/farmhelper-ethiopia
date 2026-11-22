import { z } from 'zod';
export const fileIdParam = z.object({ id: z.string() });
