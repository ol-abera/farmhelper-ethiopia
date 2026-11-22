import request from 'supertest';
import { app } from '../../src/app.js';
import { DEMO } from '../helpers/factories.js';
import { login, bearer } from '../helpers/auth.js';

describe('logbooks', () => {
  it('lists weeks for the seeded placement', async () => {
    const s = await login(app, DEMO.student);
    const pl = await request(app).get('/api/v1/placements').set(bearer(s.token));
    const id = pl.body.items[0].id;
    const weeks = await request(app).get(`/api/v1/placements/${id}/logbooks`).set(bearer(s.token));
    expect(weeks.status).toBe(200);
    expect(weeks.body.items.length).toBeGreaterThan(0);
  });
});
