import { formTotal, weightedFinal, assertWeights } from '../../src/modules/evaluations/scoring.service.js';

test('formTotal scales to 100', () => {
  const t = formTotal({ A: 8, B: 10 }, [
    { name: 'A', maxPoints: 10 },
    { name: 'B', maxPoints: 10 },
  ]);
  expect(t).toBe(90);
});

test('weightedFinal incomplete when a component is missing', () => {
  const r = weightedFinal({ advisor: 80, host: null, project: 70 }, { advisor: 50, host: 30, project: 20 });
  expect(r.incomplete).toBe(true);
  expect(r.weightedFinal).toBeNull();
});

test('weightedFinal uses weights', () => {
  const r = weightedFinal({ advisor: 80, host: 70, project: 90 }, { advisor: 50, host: 30, project: 20 });
  expect(r.incomplete).toBe(false);
  expect(r.weightedFinal).toBe(79);
});

test('assertWeights rejects bad sums', () => {
  expect(() => assertWeights({ advisor: 40, host: 40, project: 10 })).toThrow();
});
