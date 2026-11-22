import request from 'supertest';
import { app } from '../../src/app.js';
import { DEMO } from '../helpers/factories.js';
import { login, bearer } from '../helpers/auth.js';

describe('placements', () => {
  it('lists open opportunities and the seeded placement', async () => {
    const s = await login(app, DEMO.student);
    const ops = await request(app).get('/api/v1/opportunities').set(bearer(s.token));
    expect(ops.status).toBe(200);
    expect(ops.body.items.length).toBeGreaterThan(0);
    const pl = await request(app).get('/api/v1/placements').set(bearer(s.token));
    expect(pl.status).toBe(200);
    expect(pl.body.items.length).toBeGreaterThan(0);
  });
});
