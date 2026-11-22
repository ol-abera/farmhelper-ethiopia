import request from 'supertest';
import { app } from '../../src/app.js';
import { DEMO } from '../helpers/factories.js';
import { login, bearer } from '../helpers/auth.js';

describe('rbac', () => {
  it('blocks students from creating CBTP sites', async () => {
    const r = await login(app, DEMO.student);
    const res = await request(app)
      .post('/api/v1/cbtp/sites')
      .set(bearer(r.token))
      .send({ name: 'x', woreda: 'a', kebele: 'b', community: 'c', address: 'd', contactName: 'e', contactPhone: '123456' });
    expect(res.status).toBe(403);
  });

  it('blocks students from FAQ publish', async () => {
    const r = await login(app, DEMO.student);
    const res = await request(app).get('/api/v1/admin/faq').set(bearer(r.token));
    expect(res.status).toBe(403);
  });
});
