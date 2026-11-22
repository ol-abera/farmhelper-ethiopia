import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export async function aiPost<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${env.AI_SERVICE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      logger.warn({ path, status: res.status }, 'AI service HTTP error');
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    logger.warn({ err, path }, 'AI service unavailable');
    return null;
  }
}
