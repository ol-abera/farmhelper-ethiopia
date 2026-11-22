import request from 'supertest';
import type { Express } from 'express';

export async function login(app: Express, email: string, password = process.env.SEED_PASSWORD || 'TrackBridge!2026') {
  const res = await request(app).post('/api/v1/auth/login').send({ email, password });
  return { status: res.status, token: res.body.accessToken as string, user: res.body.user, cookies: res.headers['set-cookie'] };
}

export function bearer(token: string) {
  return { Authorization: `Bearer ${token}` };
}
