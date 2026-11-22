import request from 'supertest';
import { app } from '../../src/app.js';
import { DEMO } from '../helpers/factories.js';
import { login } from '../helpers/auth.js';

describe('auth', () => {
  it('rejects bad passwords', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: DEMO.student, password: 'wrong' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('logs in a seeded student', async () => {
    const r = await login(app, DEMO.student);
    expect(r.status).toBe(200);
    expect(r.token).toBeTruthy();
    expect(r.user.role).toBe('student');
  });

  it('returns me for a valid token', async () => {
    const r = await login(app, DEMO.coordinator);
    const me = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${r.token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.role).toBe('coordinator');
  });
});
