import request from 'supertest';
import { app } from '../../src/app.js';
import { DEMO } from '../helpers/factories.js';
import { login, bearer } from '../helpers/auth.js';

describe('ai routes', () => {
  it('answers FAQ from the published corpus or falls back', async () => {
    const s = await login(app, DEMO.student);
    const hit = await request(app).post('/api/v1/ai/faq').set(bearer(s.token)).send({ question: 'What is CBTP?' });
    expect(hit.status).toBe(200);
    expect(hit.body.answer).toMatch(/Community-Based Training Program|close match/i);
    const miss = await request(app).post('/api/v1/ai/faq').set(bearer(s.token)).send({ question: 'zzzzqwerty not in corpus' });
    expect(miss.body.fallback).toBe(true);
  });

  it('returns title similarity scores', async () => {
    const s = await login(app, DEMO.student);
    const res = await request(app)
      .post('/api/v1/ai/title-similarity')
      .set(bearer(s.token))
      .send({ title: 'Hospital appointment web system' });
    expect(res.status).toBe(200);
    expect(res.body.notPlagiarismVerdict).toBe(true);
  });
});
