import request from 'supertest';
import { app } from '../../src/app.js';
import { DEMO } from '../helpers/factories.js';
import { login, bearer } from '../helpers/auth.js';

describe('projects', () => {
  it('returns the student project with stored similarity hits', async () => {
    const s = await login(app, DEMO.student);
    const mine = await request(app).get('/api/v1/projects/mine').set(bearer(s.token));
    expect(mine.status).toBe(200);
    expect(mine.body.project.title).toMatch(/hospital/i);
    expect(mine.body.project.similarityHits.length).toBeGreaterThan(0);
  });
});
