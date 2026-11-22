import { evaluateEarlyWarnings } from '../../src/modules/dashboard/atRisk.service.js';

test('flags inactivity and overdue milestones', () => {
  const hits = evaluateEarlyWarnings([
    {
      studentId: '1',
      studentName: 'Sara',
      studentNumber: 'RU1',
      lateOrMissingLogbooks: 2,
      projectBehind: true,
      daysSinceActivity: 20,
      cbtpOverdue: false,
      attendanceGaps: 0,
      evaluationClosingSoonWithoutForm: false,
      coordinatorFlag: false,
      overdueMilestones: 1,
    },
  ]);
  expect(hits).toHaveLength(1);
  expect(hits[0].types).toEqual(expect.arrayContaining(['late_logbook', 'inactivity', 'overdue_milestone']));
});

test('quiet student is not flagged', () => {
  const hits = evaluateEarlyWarnings([
    {
      studentId: '2',
      studentName: 'Abel',
      studentNumber: 'RU2',
      lateOrMissingLogbooks: 0,
      projectBehind: false,
      daysSinceActivity: 2,
      cbtpOverdue: false,
      attendanceGaps: 0,
      evaluationClosingSoonWithoutForm: false,
      coordinatorFlag: false,
      overdueMilestones: 0,
    },
  ]);
  expect(hits).toHaveLength(0);
});
