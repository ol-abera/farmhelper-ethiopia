import request from 'supertest';
import { app } from '../../src/app.js';
import { DEMO } from '../helpers/factories.js';
import { login, bearer } from '../helpers/auth.js';

describe('cbtp', () => {
  it('lists sites for coordinator and groups for student', async () => {
    const c = await login(app, DEMO.coordinator);
    const sites = await request(app).get('/api/v1/cbtp/sites').set(bearer(c.token));
    expect(sites.status).toBe(200);
    expect(sites.body.items.length).toBeGreaterThan(0);
    const s = await login(app, DEMO.student);
    const groups = await request(app).get('/api/v1/cbtp/groups').set(bearer(s.token));
    expect(groups.status).toBe(200);
    expect(groups.body.items.length).toBeGreaterThan(0);
  });
});
