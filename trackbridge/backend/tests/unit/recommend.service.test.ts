import { matchStudentToPositions } from '../../src/ai/matching.js';

test('ranks hospital skills above telecom for HIS student', () => {
  const ranked = matchStudentToPositions(
    {
      id: 's',
      fullName: 'Abel',
      skills: 'hospital information systems React PostgreSQL helpdesk',
      interests: 'health ICT',
    },
    [
      {
        id: 'his',
        title: 'Hospital ICT intern',
        description: 'hospital information system helpdesk',
        requiredSkills: 'React PostgreSQL health information',
        openTo: new Date(Date.now() + 2 * 86400000),
        organizationName: 'Hospital',
      },
      {
        id: 'net',
        title: 'Network intern',
        description: 'routers and radio towers',
        requiredSkills: 'cisco microwave',
        openTo: new Date(Date.now() + 40 * 86400000),
        organizationName: 'Telecom',
      },
    ],
  );
  expect(ranked[0].positionId).toBe('his');
  expect(ranked[0].combinedScore).toBeGreaterThan(ranked[1].combinedScore);
});
