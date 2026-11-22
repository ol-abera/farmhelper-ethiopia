import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  JWT_ACCESS_EXPIRES: z.string().default('30m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_MB: z.coerce.number().default(10),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().default('TrackBridge <noreply@localhost>'),
  APP_URL: z.string().default('http://localhost:5173'),
  TZ: z.string().default('Africa/Addis_Ababa'),
  LOG_LEVEL: z.string().default('info'),
  SEED_PASSWORD: z.string().default('TrackBridge!2026'),
  AI_SERVICE_URL: z.string().default('http://127.0.0.1:8000'),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  UNIVERSITY_NAME: z.string().default('Jimma Institute of Technology'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
