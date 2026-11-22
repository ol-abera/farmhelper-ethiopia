import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_CYCLE_CONFIG } from '../src/config/constants.js';

const prisma = new PrismaClient();
const PASSWORD = process.env.SEED_PASSWORD || 'TrackBridge!2026';

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 12);
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "ChatbotLog","AiSummary","TitleSimilarityHit","InternshipTask","EarlyWarning","FaqEntry","CbtpDocument","CbtpGroupMember","CbtpGroup","CbtpActivity","CbtpSite","LogbookComment","LogbookEntry","LogbookWeek","Attendance","SupervisorAssignment","Message","MessageThreadParticipant","MessageThread","Notification","ReminderLog","Evaluation","FinalScore","Rubric","Deliverable","Milestone","ProjectTask","ProjectMember","Project","Application","Placement","Position","Organization","RefreshToken","AuditEvent","Document","Announcement","SystemConfig","User","Cycle" CASCADE');

  const cycle = await prisma.cycle.create({
    data: {
      title: 'CBTP / Internship / Projects 2026',
      startDate: new Date('2026-09-15'),
      endDate: new Date('2027-02-15'),
      internshipStart: new Date('2026-10-06'),
      internshipEnd: new Date('2026-12-26'),
      logbookDueWeekday: 0,
      timezone: 'Africa/Addis_Ababa',
      evaluationOpenAt: new Date('2026-11-10'),
      evaluationCloseAt: new Date('2026-12-10'),
      isOpen: true,
      config: {
        ...DEFAULT_CYCLE_CONFIG,
        universityName: 'Jimma Institute of Technology',
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      fullName: 'Amina Bekele',
      email: 'admin@trackbridge.demo',
      passwordHash: hash,
      role: 'administrator',
      department: 'IT administration',
      approvedAt: new Date(),
      cycleId: cycle.id,
    },
  });
  const coordinator = await prisma.user.create({
    data: {
      fullName: 'Dr. Tadesse Lemma',
      email: 'coordinator@trackbridge.demo',
      passwordHash: hash,
      role: 'coordinator',
      department: 'Information Technology',
      approvedAt: new Date(),
      cycleId: cycle.id,
    },
  });
  const advisor = await prisma.user.create({
    data: {
      fullName: 'Meron Tadesse',
      email: 'advisor@trackbridge.demo',
      passwordHash: hash,
      role: 'advisor',
      department: 'Information Technology',
      approvedAt: new Date(),
      cycleId: cycle.id,
    },
  });

  const ethiotech = await prisma.organization.create({
    data: {
      name: 'Jimma University Hospital ICT',
      sector: 'Health / ICT',
      address: 'Jimma University Medical Centre',
      city: 'Jimma',
      contactName: 'Dawit Kebede',
      contactEmail: 'host@trackbridge.demo',
      contactPhone: '+251911000001',
      description: 'Hospital information systems and helpdesk internships.',
    },
  });
  const telecom = await prisma.organization.create({
    data: {
      name: 'Ethio Telecom Jimma',
      sector: 'Telecommunications',
      address: 'Bishari, Jimma',
      city: 'Jimma',
      contactName: 'Sara Nuru',
      contactEmail: 'sara.nuru@ethiotelecom.demo',
      contactPhone: '+251911000002',
      description: 'Network operations and customer systems.',
    },
  });

  const host = await prisma.user.create({
    data: {
      fullName: 'Jimma University Hospital ICT (host)',
      email: 'host@trackbridge.demo',
      passwordHash: hash,
      role: 'host_organization',
      organizationId: ethiotech.id,
      approvedAt: new Date(),
      cycleId: cycle.id,
    },
  });
  const supervisor = await prisma.user.create({
    data: {
      fullName: 'Dawit Kebede',
      email: 'supervisor@trackbridge.demo',
      passwordHash: hash,
      role: 'internship_supervisor',
      organizationId: ethiotech.id,
      department: 'Hospital ICT',
      approvedAt: new Date(),
      cycleId: cycle.id,
    },
  });

  const student = await prisma.user.create({
    data: {
      fullName: 'Abel Mekonnen',
      email: 'student@trackbridge.demo',
      passwordHash: hash,
      role: 'student',
      studentId: 'RU1201/16',
      department: 'Information Technology',
      skills: 'React, Node.js, PostgreSQL, community survey design, Excel',
      interests: 'health information systems, CBTP sanitation, hospital ICT internships',
      phone: '+251911111111',
      approvedAt: new Date(),
      cycleId: cycle.id,
    },
  });
  const sara = await prisma.user.create({
    data: {
      fullName: 'Sara Hassan',
      email: 'sara.hassan@trackbridge.demo',
      passwordHash: hash,
      role: 'student',
      studentId: 'RU1202/16',
      department: 'Information Technology',
      skills: 'Python, data collection, report writing',
      interests: 'community health, delayed logbook student for warnings demo',
      approvedAt: new Date(),
      cycleId: cycle.id,
      lastActivityAt: new Date(Date.now() - 21 * 86400000),
    },
  });
  const yonas = await prisma.user.create({
    data: {
      fullName: 'Yonas Girma',
      email: 'yonas.girma@trackbridge.demo',
      passwordHash: hash,
      role: 'student',
      studentId: 'RU1203/16',
      department: 'Information Technology',
      skills: 'networking, customer support',
      interests: 'telecom internships, rural connectivity',
      approvedAt: new Date(),
      cycleId: cycle.id,
    },
  });
  await prisma.user.create({
    data: {
      fullName: 'Pending Student',
      email: 'pending.student@trackbridge.demo',
      passwordHash: hash,
      role: 'student',
      studentId: 'RU1299/16',
      department: 'Information Technology',
      cycleId: cycle.id,
    },
  });

  const pos1 = await prisma.position.create({
    data: {
      organizationId: ethiotech.id,
      title: 'Hospital ICT intern',
      description: 'Support the hospital information system, helpdesk tickets, and digitisation of patient records under supervision.',
      requiredSkills: 'React Node.js PostgreSQL helpdesk health information systems',
      quota: 2,
      isOpen: true,
      openFrom: new Date('2026-09-20'),
      openTo: new Date('2026-11-28'),
    },
  });
  await prisma.position.create({
    data: {
      organizationId: telecom.id,
      title: 'Network operations intern',
      description: 'Assist NOC engineers with monitoring, customer incident logs, and field connectivity reports around Jimma.',
      requiredSkills: 'networking customer support linux rural connectivity',
      quota: 2,
      isOpen: true,
      openFrom: new Date('2026-09-20'),
      openTo: new Date('2026-12-05'),
    },
  });

  const placement = await prisma.placement.create({
    data: {
      studentId: student.id,
      cycleId: cycle.id,
      organizationId: ethiotech.id,
      positionId: pos1.id,
      startDate: cycle.internshipStart,
      endDate: cycle.internshipEnd,
      status: 'placed',
    },
  });
  await prisma.supervisorAssignment.createMany({
    data: [
      { placementId: placement.id, supervisorUserId: advisor.id, type: 'advisor', assignedBy: coordinator.id },
      { placementId: placement.id, supervisorUserId: supervisor.id, type: 'internship', assignedBy: coordinator.id },
    ],
  });

  // logbook weeks
  const start = new Date(cycle.internshipStart);
  for (let i = 0; i < 8; i++) {
    const periodStart = new Date(start);
    periodStart.setDate(periodStart.getDate() + i * 7);
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 6);
    const dueAt = new Date(periodEnd);
    dueAt.setHours(23, 59, 0, 0);
    const week = await prisma.logbookWeek.create({
      data: { placementId: placement.id, weekIndex: i + 1, periodStart, periodEnd, dueAt },
    });
    if (i < 5) {
      const entry = await prisma.logbookEntry.create({
        data: {
          weekId: week.id,
          activities: `Week ${i + 1}: supported helpdesk tickets, shadowed HIS data entry, and documented downtime.`,
          hours: 40,
          skills: 'HIS, tickets, documentation',
          challenges: 'Unstable power in the records office.',
          status: i < 4 ? 'approved' : 'submitted',
          submittedAt: periodEnd,
          late: false,
        },
      });
      if (i < 4) {
        await prisma.logbookComment.create({
          data: { entryId: entry.id, authorId: supervisor.id, body: 'Clear week. Continue.', action: 'approve' },
        });
      }
    }
  }

  await prisma.attendance.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      placementId: placement.id,
      date: new Date(Date.UTC(2026, 9, 7 + i)),
      status: i === 4 ? 'absent' : 'present',
      hours: 8,
      recordedBy: student.id,
    })),
  });

  const site = await prisma.cbtpSite.create({
    data: {
      name: 'Seka Chekorsa community health post',
      woreda: 'Seka Chekorsa',
      kebele: 'Gibe',
      community: 'Rural kebele around Jimma',
      address: 'Seka Chekorsa woreda, Jimma zone',
      contactName: 'Health extension worker Hana',
      contactPhone: '+251922000010',
      description: 'CBTP site for sanitation and maternal-health needs assessment.',
    },
  });
  const activity = await prisma.cbtpActivity.create({
    data: {
      siteId: site.id,
      cycleId: cycle.id,
      title: 'Household sanitation needs assessment',
      description: 'Identify sanitation gaps, prioritise problems, draft an action plan with the kebele.',
      startDate: new Date('2026-10-01'),
      endDate: new Date('2026-12-15'),
      status: 'active',
    },
  });
  const group = await prisma.cbtpGroup.create({
    data: { activityId: activity.id, name: 'Group A — Seka sanitation', advisorId: advisor.id },
  });
  await prisma.cbtpGroupMember.createMany({
    data: [
      { groupId: group.id, studentId: student.id },
      { groupId: group.id, studentId: sara.id },
    ],
  });
  await prisma.cbtpDocument.create({
    data: {
      groupId: group.id,
      authorId: student.id,
      title: 'Needs assessment draft — Gibe kebele',
      body: `Community members reported limited latrine coverage, seasonal water shortage, and long walks to the health post. Household interviews with 24 families showed that 11 use unimproved pits. Women described difficulty accessing antenatal follow-up during harvest. The group mapped water points and discussed priorities with the health extension worker. Next steps include a ranked problem tree and a draft action plan with the kebele administration. This paragraph is long enough for TextRank to extract a draft summary for the academic advisor to review. Additional observations include school-age children fetching water before class and a broken hand pump near the market. The team will return with a structured questionnaire.`,
      docKind: 'needs_assessment',
      status: 'submitted',
      submittedAt: new Date(),
    },
  });

  const p1 = await prisma.project.create({
    data: {
      cycleId: cycle.id,
      creatorId: student.id,
      title: 'Web-based hospital appointment and records helper for Jimma',
      problem: 'Paper queues delay outpatient registration at the teaching hospital.',
      objectives: 'Prototype a role-based appointment helper with audit logs.',
      tools: 'React, Express, PostgreSQL',
      mode: 'individual',
      proposalStatus: 'approved',
      overallStatus: 'in_progress',
      members: { create: { userId: student.id, roleInTeam: 'owner', acceptedAt: new Date() } },
    },
  });
  await prisma.project.create({
    data: {
      cycleId: cycle.id,
      creatorId: yonas.id,
      title: 'Hospital patient appointment scheduling web system',
      problem: 'Similar topic used to demonstrate title similarity.',
      objectives: 'Study scheduling workflows.',
      tools: 'React',
      mode: 'individual',
      proposalStatus: 'approved',
      members: { create: { userId: yonas.id, roleInTeam: 'owner', acceptedAt: new Date() } },
    },
  });
  await prisma.titleSimilarityHit.create({
    data: {
      projectId: p1.id,
      otherTitle: 'Hospital patient appointment scheduling web system',
      score: 0.71,
      advisory: 'High overlap — review before approving; this is not a plagiarism verdict.',
    },
  });
  await prisma.projectTask.createMany({
    data: [
      { projectId: p1.id, title: 'Interview records clerks', status: 'done', assigneeId: student.id },
      { projectId: p1.id, title: 'Build registration form', status: 'in_progress', assigneeId: student.id },
    ],
  });
  const ms = await prisma.milestone.create({
    data: {
      projectId: p1.id,
      title: 'Requirements note',
      description: 'Document HIS pain points',
      dueAt: new Date('2026-11-30'),
      status: 'accepted',
    },
  });
  await prisma.milestone.create({
    data: {
      projectId: p1.id,
      title: 'Working prototype',
      description: 'Demo login and appointment list',
      dueAt: new Date('2026-11-10'),
      status: 'pending',
    },
  });
  void ms;

  const criteria = [
    { name: 'Quality of work', maxPoints: 40, weight: 40 },
    { name: 'Professionalism', maxPoints: 30, weight: 30 },
    { name: 'Documentation', maxPoints: 30, weight: 30 },
  ];
  await prisma.rubric.createMany({
    data: [
      { cycleId: cycle.id, component: 'advisor', criteria },
      { cycleId: cycle.id, component: 'host', criteria },
      { cycleId: cycle.id, component: 'project', criteria },
    ],
  });

  const faqs = [
    ['How do I submit a CBTP report?', 'Open CBTP → Submissions, choose your group, write the report, then Submit. Your academic advisor reviews it. The chatbot cannot approve it for you.', 'cbtp student'],
    ['Who approves my internship placement?', 'The coordinator makes the final placement decision. A host organisation may recommend. Matching scores are advisory only.', 'internship'],
    ['What is CBTP?', 'Community-Based Training Program: students work with a community to identify needs, plan, implement and assess activities. It is not an internship.', 'cbtp'],
    ['How do weekly logbooks work?', 'Each internship week has a slot. Write activities and hours, submit before the due time. Late weeks are marked late. Your internship supervisor approves or returns the entry.', 'logbook'],
    ['How is attendance recorded?', 'Students record present, absent, late or excused for each day. Internship supervisors confirm or dispute records.', 'attendance'],
    ['What does a title similarity score mean?', 'It is TF-IDF cosine overlap with existing titles. It is decision support, not a plagiarism verdict, and it does not auto-reject your title.', 'project ai'],
    ['Who can I ask if the chatbot cannot answer?', 'Contact your academic advisor for CBTP/project questions or the coordinator for placements. Use Messages in TrackBridge.', 'faq'],
    ['Can the chatbot grade me?', 'No. The FAQ bot never grades, never approves submissions, and never places students.', 'ai'],
    ['How do early warnings work?', 'They are transparent rules: missed deadlines, overdue milestones, or no activity for many days. A flag is not a failing grade.', 'warnings'],
    ['How do I reset my password?', 'Use Forgot password on the login page. A time-limited link is emailed. TrackBridge never sends your password.', 'account'],
    ['What roles exist?', 'Student, academic advisor, internship supervisor, coordinator, host organisation, and administrator.', 'roles'],
    ['Can a host organisation post opportunities?', 'Yes, when the administrator allows host posting. The coordinator still approves placements.', 'host'],
    ['How are supervisors assigned?', 'The coordinator (or host for internship supervisors) assigns them. Workload counts are shown as a warning, not a block.', 'supervisors'],
    ['What files can I upload?', 'PDF, Word, PowerPoint, Excel, PNG and JPEG up to 10 MB unless the administrator lowers the cap.', 'files'],
    ['Where are reports?', 'Coordinators generate CBTP progress, internship activity, project status and delayed-work PDFs from Reports.', 'reports'],
    ['Is this CPTP?', 'No. The official programme name is CBTP — Community-Based Training Program — plus internships and technical projects.', 'cbtp'],
  ] as const;
  for (const [question, answer, tags] of faqs) {
    await prisma.faqEntry.create({ data: { question, answer, tags, approved: true } });
  }

  await prisma.systemConfig.createMany({
    data: [
      { key: 'institution', value: { name: 'Jimma Institute of Technology' } },
      { key: 'earlyWarning', value: { inactivityDays: 14, lateOrMissingWeeks: 2 } },
    ],
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      type: 'welcome',
      title: 'Welcome to TrackBridge',
      body: 'Your CBTP group, internship placement and project title are ready in this demo.',
    },
  });

  console.log('Seeded TrackBridge demo. Password for all demo users:', PASSWORD);
  console.log({
    admin: admin.email,
    coordinator: coordinator.email,
    advisor: advisor.email,
    supervisor: supervisor.email,
    host: host.email,
    student: student.email,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
