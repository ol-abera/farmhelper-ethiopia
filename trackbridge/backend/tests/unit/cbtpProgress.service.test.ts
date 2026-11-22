import { cbtpProgress } from '../../src/modules/cbtp/cbtpProgress.service.js';

test('completed when all required approved', () => {
  const kinds = ['needs_assessment', 'action_plan', 'progress_report', 'final_report'];
  const r = cbtpProgress(
    kinds,
    kinds.map((k) => ({ docKind: k, status: 'approved' })),
  );
  expect(r.status).toBe('completed');
  expect(r.percent).toBe(100);
});
