# TrackBridge recommended repository structure

**Working UI name:** TrackBridge  
**Official title:** AI-Driven Integrated Web Platform for CBTP Tracking, Internship Coordination, and Technical Project Management  
**Matches:** `docs/trackbridge-srs.md` v2.0  
**Official tools (proposal §3.5):** React.js, Spring Boot, SQL Server, JWT, TF-IDF / cosine / TextRank  
**Prototype path (this tree):** React (Vite) + Node.js/Express + PostgreSQL/Prisma + Python FastAPI AI service + JWT + SMTP + PDFKit  

This is the tree to create when coding the **prototype**. It is not a CPTP four-role sketch. Folders map to official modules: access/admin, CBTP sites/groups, internships, technical projects, notifications/audit/reports, and **every AI service** (matching, recommendations, early warning, TextRank summaries, title similarity, FAQ chatbot). AI directories contain real implementations, not stubs.

If the team later ports the API to **Spring Boot + SQL Server**, keep `frontend/`, `shared/` DTOs, `ai-service/`, and the `/api/v1` routes in Section 4.5. Do not invent a second product.

---

## 1. Complete tree

```
trackbridge/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.yml
│   │   └── feature.yml
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml
│       └── codeql.yml
├── .husky/
│   └── pre-commit
├── backend/                                    # Express prototype API
│   ├── prisma/
│   │   ├── schema.prisma                       # all SRS §6 entities
│   │   ├── migrations/
│   │   │   └── 0001_init/
│   │   │       └── migration.sql
│   │   ├── seed.ts
│   │   └── seed/
│   │       ├── users.seed.ts                   # six roles
│   │       ├── cbtp.seed.ts                    # sites, activities, groups
│   │       ├── internships.seed.ts             # orgs, opportunities, placements
│   │       ├── projects.seed.ts
│   │       ├── faq.seed.ts                     # published English FAQ corpus
│   │       └── period.seed.ts
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── constants.ts
│   │   │   └── logger.ts
│   │   ├── db/
│   │   │   ├── prisma.ts
│   │   │   └── transaction.ts
│   │   ├── middleware/
│   │   │   ├── authenticate.ts
│   │   │   ├── authorize.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimit.ts
│   │   │   ├── requestId.ts
│   │   │   └── validate.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.schema.ts
│   │   │   │   └── jwt.ts
│   │   │   ├── users/
│   │   │   │   ├── users.routes.ts
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── users.schema.ts
│   │   │   ├── admin/
│   │   │   │   ├── admin.routes.ts
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── admin.service.ts            # FR-ADM accounts, config
│   │   │   ├── faqAdmin.service.ts             # publish FAQ versions
│   │   │   └── admin.schema.ts
│   │   │   ├── periods/
│   │   │   │   ├── periods.routes.ts
│   │   │   │   └── periods.service.ts
│   │   │   ├── cbtp/
│   │   │   │   ├── sites.routes.ts
│   │   │   │   ├── sites.service.ts
│   │   │   │   ├── activities.service.ts
│   │   │   │   ├── groups.routes.ts
│   │   │   │   ├── groups.service.ts            # assign students
│   │   │   │   ├── submissions.routes.ts
│   │   │   │   ├── submissions.service.ts       # advisor approve/return
│   │   │   │   ├── cbtpProgress.service.ts
│   │   │   │   └── cbtp.schema.ts
│   │   │   ├── internships/
│   │   │   │   ├── organizations.routes.ts
│   │   │   │   ├── organizations.service.ts
│   │   │   │   ├── opportunities.routes.ts
│   │   │   │   ├── opportunities.service.ts
│   │   │   │   ├── applications.routes.ts
│   │   │   │   ├── applications.service.ts
│   │   │   │   ├── placements.routes.ts
│   │   │   │   ├── placements.service.ts
│   │   │   │   ├── placementLetter.service.ts
│   │   │   │   ├── supervisors.routes.ts
│   │   │   │   ├── supervisors.service.ts
│   │   │   │   ├── attendance.routes.ts
│   │   │   │   ├── attendance.service.ts
│   │   │   │   ├── logbooks.routes.ts
│   │   │   │   ├── logbooks.service.ts
│   │   │   │   ├── internshipTasks.service.ts
│   │   │   │   └── internships.schema.ts
│   │   │   ├── projects/
│   │   │   │   ├── projects.routes.ts
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   ├── titles.service.ts            # submit + store similarity hits
│   │   │   │   ├── tasks.service.ts
│   │   │   │   ├── milestones.service.ts
│   │   │   │   ├── progress.service.ts
│   │   │   │   └── projects.schema.ts
│   │   │   ├── evaluations/
│   │   │   │   ├── evaluations.routes.ts
│   │   │   │   ├── evaluations.service.ts
│   │   │   │   ├── scoring.service.ts
│   │   │   │   ├── rubrics.service.ts
│   │   │   │   └── evaluations.schema.ts
│   │   │   ├── communications/
│   │   │   │   ├── messages.routes.ts
│   │   │   │   ├── messages.service.ts
│   │   │   │   ├── notifications.routes.ts
│   │   │   │   ├── notifications.service.ts
│   │   │   │   ├── announcements.service.ts
│   │   │   │   └── communications.schema.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.routes.ts
│   │   │   │   ├── dashboard.service.ts         # six role aggregations
│   │   │   └── dashboard.schema.ts
│   │   │   ├── reports/
│   │   │   │   ├── reports.routes.ts
│   │   │   │   ├── reports.service.ts
│   │   │   │   ├── cbtpReport.service.ts
│   │   │   │   ├── internshipReport.service.ts
│   │   │   │   ├── projectReport.service.ts
│   │   │   │   ├── delayedWorkReport.service.ts
│   │   │   │   └── archive.routes.ts
│   │   │   ├── files/
│   │   │   │   ├── files.routes.ts
│   │   │   │   ├── files.service.ts
│   │   │   │   ├── storage.local.ts
│   │   │   │   └── files.schema.ts
│   │   │   └── ai/
│   │   │       ├── ai.routes.ts                # /api/v1/ai/*
│   │   │       ├── ai.controller.ts
│   │   │       ├── aiClient.ts                 # HTTP client to ai-service
│   │   │       ├── matching.service.ts         # FR-AI-MATCH (calls AI)
│   │   │       ├── recommend.service.ts        # FR-AI-REC (score + urgency)
│   │   │       ├── earlyWarning.service.ts     # FR-AI-WARN rule-based SQL
│   │   │       ├── summarize.service.ts        # FR-AI-SUM (calls AI)
│   │   │       ├── titleSimilarity.service.ts  # FR-AI-TITLE (calls AI)
│   │   │       ├── faq.service.ts              # FR-AI-FAQ (calls AI + corpus)
│   │   │       └── ai.schema.ts
│   │   ├── jobs/
│   │   │   ├── scheduler.ts
│   │   │   ├── reminderJob.ts
│   │   │   └── earlyWarningJob.ts
│   │   ├── pdf/
│   │   │   ├── pdfkit.ts
│   │   │   └── templates/
│   │   │       ├── placementLetter.ts
│   │   │       ├── cbtpProgress.ts
│   │   │       ├── internshipActivity.ts
│   │   │       ├── projectStatus.ts
│   │   │       └── delayedWork.ts
│   │   ├── mail/
│   │   │   ├── mailer.ts
│   │   │   ├── send.ts
│   │   │   └── templates/
│   │   │       ├── accountApproved.ts
│   │   │       ├── passwordReset.ts
│   │   │       ├── placementDecision.ts
│   │   │       ├── assignment.ts
│   │   │       ├── reviewEvent.ts
│   │   │       └── reminder.ts
│   │   ├── audit/
│   │   │   └── audit.service.ts
│   │   ├── types/
│   │   │   └── express.d.ts
│   │   └── utils/
│   │       ├── pagination.ts
│   │       ├── crypto.ts
│   │       └── dates.ts
│   ├── tests/
│   │   ├── setup.ts
│   │   ├── helpers/
│   │   │   ├── auth.ts
│   │   │   └── factories.ts
│   │   ├── unit/
│   │   │   ├── scoring.service.test.ts
│   │   │   ├── earlyWarning.service.test.ts
│   │   │   ├── recommend.service.test.ts
│   │   │   └── cbtpProgress.service.test.ts
│   │   └── integration/
│   │       ├── auth.test.ts
│   │       ├── cbtp.test.ts
│   │       ├── placements.test.ts
│   │       ├── logbooks.test.ts
│   │       ├── projects.test.ts
│   │       ├── ai.routes.test.ts
│   │       └── rbac.test.ts
│   ├── postman/
│   │   └── TrackBridge.postman_collection.json
│   ├── uploads/
│   │   └── .gitkeep
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   └── .env.example
├── ai-service/                                 # Python FastAPI — real AI, not stubs
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                             # FastAPI app, internal routes
│   │   ├── config.py
│   │   ├── textutil.py                         # normalize titles/skills
│   │   ├── vectorize.py                        # TF-IDF fit/transform (sklearn)
│   │   ├── matching.py                         # cosine rank students ↔ opportunities
│   │   ├── recommend.py                        # suitability + deadline urgency
│   │   ├── summarization.py                    # TextRank extractive summary
│   │   ├── title_similarity.py                 # TF-IDF + cosine vs title corpus
│   │   └── faq.py                              # retrieve from approved FAQ list
│   ├── tests/
│   │   ├── test_matching.py
│   │   ├── test_recommend.py
│   │   ├── test_summarization.py
│   │   ├── test_title_similarity.py
│   │   └── test_faq.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .dockerignore
│   └── README.md
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── robots.txt
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── vite-env.d.ts
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── users.api.ts
│   │   │   ├── admin.api.ts
│   │   │   ├── cbtp.api.ts
│   │   │   ├── internships.api.ts
│   │   │   ├── projects.api.ts
│   │   │   ├── evaluations.api.ts
│   │   │   ├── communications.api.ts
│   │   │   ├── dashboard.api.ts
│   │   │   ├── reports.api.ts
│   │   │   ├── files.api.ts
│   │   │   └── ai.api.ts                       # all six AI endpoints
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── RoleRoute.tsx
│   │   │   └── useAuth.ts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppShell.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Topbar.tsx
│   │   │   │   └── RoleNav.tsx                 # six role menus
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   ├── AdvisoryBanner.tsx          # AI disclaimer (Appendix C)
│   │   │   │   └── FileUpload.tsx
│   │   │   ├── notifications/
│   │   │   │   └── NotificationBell.tsx
│   │   │   └── chatbot/
│   │   │       └── FaqChatbot.tsx              # English FAQ panel
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   ├── AdvisorDashboard.tsx
│   │   │   │   ├── InternshipSupervisorDashboard.tsx
│   │   │   │   ├── CoordinatorDashboard.tsx
│   │   │   │   ├── HostOrganizationDashboard.tsx
│   │   │   │   └── AdminDashboard.tsx
│   │   │   ├── cbtp/
│   │   │   │   ├── SiteListPage.tsx
│   │   │   │   ├── SiteDetailPage.tsx
│   │   │   │   ├── GroupListPage.tsx
│   │   │   │   ├── GroupAssignPage.tsx
│   │   │   │   ├── SubmissionPage.tsx
│   │   │   │   └── SubmissionReviewPage.tsx
│   │   │   ├── internships/
│   │   │   │   ├── OpportunityBrowsePage.tsx
│   │   │   │   ├── OpportunityFormPage.tsx
│   │   │   │   ├── ApplicationPage.tsx
│   │   │   │   ├── ProposePlacementPage.tsx
│   │   │   │   ├── PlacementDetailPage.tsx
│   │   │   │   ├── AssignSupervisorPage.tsx
│   │   │   │   ├── AttendancePage.tsx
│   │   │   │   ├── LogbookEntryPage.tsx
│   │   │   │   └── LogbookReviewPage.tsx
│   │   │   ├── projects/
│   │   │   │   ├── TitleSubmitPage.tsx         # shows similar titles + scores
│   │   │   │   ├── ProjectPage.tsx
│   │   │   │   ├── TaskBoard.tsx
│   │   │   │   └── MilestoneSection.tsx
│   │   │   ├── evaluations/
│   │   │   │   ├── EvaluationFormPage.tsx
│   │   │   │   └── EvaluationInboxPage.tsx
│   │   │   ├── messages/
│   │   │   │   └── MessagesPage.tsx
│   │   │   ├── reports/
│   │   │   │   ├── ReportsPage.tsx
│   │   │   │   └── ArchivePage.tsx
│   │   │   ├── ai/
│   │   │   │   ├── MatchingPage.tsx            # ranked matches + reasons
│   │   │   │   ├── RecommendationsPage.tsx
│   │   │   │   └── EarlyWarningsPage.tsx
│   │   │   └── admin/
│   │   │       ├── UsersAdminPage.tsx
│   │   │       ├── RolesAdminPage.tsx
│   │   │       ├── ConfigAdminPage.tsx
│   │   │       ├── FaqAdminPage.tsx
│   │   │       └── AuditLogPage.tsx
│   │   ├── hooks/
│   │   │   ├── usePagination.ts
│   │   │   └── useToast.ts
│   │   ├── routes/
│   │   │   └── index.tsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   └── utils/
│   │       ├── dates.ts
│   │       └── errors.ts
│   ├── tests/
│   │   ├── setup.ts
│   │   └── pages/
│   │       ├── LoginPage.test.tsx
│   │       ├── AdvisoryBanner.test.tsx
│   │       └── FaqChatbot.test.tsx
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
├── shared/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── roles.ts                            # six roles
│       ├── statuses.ts                         # CBTP, internship, project, eval
│       ├── ai.ts                               # MatchHit, FaqReply, WarningFlag DTOs
│       ├── api.ts
│       └── errors.ts
├── e2e/
│   ├── playwright.config.ts
│   ├── tests/
│   │   ├── auth.spec.ts
│   │   ├── cbtp.spec.ts
│   │   ├── internship.spec.ts
│   │   ├── project-title.spec.ts
│   │   ├── chatbot.spec.ts
│   │   └── dashboard.spec.ts
│   └── fixtures/
│       └── users.json                          # one seeded user per role
├── docs/
│   ├── README.md
│   ├── trackbridge-srs.md
│   ├── trackbridge-folder-structure.md
│   ├── official-title.md                       # one-pager: official name + CBTP
│   ├── api.md
│   ├── uml/
│   │   ├── use-case.md
│   │   ├── class.md
│   │   └── sequence.md
│   ├── user-manuals/
│   │   ├── student.md
│   │   ├── academic-advisor.md
│   │   ├── internship-supervisor.md
│   │   ├── coordinator.md
│   │   ├── host-organization.md
│   │   └── administrator.md
│   └── deployment.md
├── scripts/
│   ├── wait-for-db.sh
│   ├── wait-for-ai.sh
│   └── reset-dev.sh
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .gitignore
├── .editorconfig
├── .nvmrc
├── .prettierrc
├── .prettierignore
├── eslint.config.js
├── package.json
├── package-lock.json
├── README.md
└── LICENSE
```

Do not commit: `node_modules/`, `backend/uploads/**` (except `.gitkeep`), `dist/`, `.env`, `__pycache__/`, `.venv/`, generated PDFs, IDE folders.

**Optional later:** `backend-spring/` (Spring Boot) replacing `backend/` only — same routes. Do not add it until a real port starts; this tree is the Express prototype.

---

## 2. Root of the repository

### `package.json` (npm workspaces)

- `name`: `trackbridge` (working name)
- `private`: true
- `workspaces`: `["frontend", "backend", "shared"]`  
  (`ai-service` is Python; Compose builds it separately.)
- scripts: `dev` (db + api + ai + web), `lint`, `test`, `build`, `prisma:migrate`, `prisma:seed`

Pin Node LTS in `.nvmrc` (20). One lockfile (npm).

### `README.md`

Must state:

1. Official Jimma University title and **CBTP** (not CPTP).
2. Working UI name TrackBridge.
3. Official tools: React.js, Spring Boot, SQL Server, JWT.
4. This prototype: React + Express + PostgreSQL + FastAPI AI.
5. Six roles and seeded demo logins.
6. How to run: copy env files, `docker compose up --build`, migrate, seed.
7. That AI features are live services, not placeholders.

### `.env.example` (root / Compose)

`POSTGRES_*`, `API_PORT`, `WEB_PORT`, `AI_PORT`, `AI_SERVICE_URL=http://ai:8000`. Secrets only in untracked `.env`.

### `docker-compose.yml`

| Service | Build | Ports | Notes |
| --- | --- | --- | --- |
| `db` | `postgres:16` | 5432 | Substitute for SQL Server in the prototype |
| `api` | `./backend` | 3000 | `DATABASE_URL`, JWT, SMTP, `UPLOAD_DIR`, `AI_SERVICE_URL` |
| `ai` | `./ai-service` | 8000 | Internal; API is the public gateway |
| `web` | `./frontend` | 5173 / 80 | `VITE_API_URL=/api/v1` |

Do not publish `ai` on the public host in production compose.

### `scripts/`

`wait-for-db.sh` / `wait-for-ai.sh` for container entrypoints. `reset-dev.sh` migrates and seeds **dev only**.

---

## 3. `shared/` — contracts

| Path | Purpose |
| --- | --- |
| `src/roles.ts` | `student`, `advisor`, `internship_supervisor`, `coordinator`, `host_organization`, `administrator` |
| `src/statuses.ts` | CBTP submission, placement, logbook, attendance, project title, milestone, evaluation enums from the SRS |
| `src/ai.ts` | `MatchHit`, `Recommendation`, `WarningFlag`, `TitleSimilarityHit`, `SummaryDraft`, `FaqReply` |
| `src/api.ts` | DTOs for sites, groups, placements, projects, reports |
| `src/errors.ts` | INT-API-05 codes |

Front end and Express depend on `@trackbridge/shared`. Early-warning **computation** stays in `backend` SQL/rules; the shared file only types the flags.

---

## 4. `backend/` — Express prototype API

### 4.1 `package.json`

Express, cors, helmet, cookie-parser, Prisma, bcrypt/argon2, jsonwebtoken, zod, nodemailer, pdfkit, multer, node-cron, pino/morgan, express-rate-limit. Dev: typescript, tsx, jest, supertest.

Scripts: `dev`, `build`, `start`, `test`, `prisma:*`.

### 4.2 `prisma/schema.prisma`

Single schema for SRS §6.2, including:

`User`, `RefreshToken`, `Period`, `Organization`, `CbtpSite`, `CbtpActivity`, `CbtpGroup`, `CbtpMembership`, `CbtpSubmission`, `ReviewComment`, `Opportunity`, `Application`, `Placement`, `SupervisorAssignment`, `Attendance`, `LogbookWeek`, `LogbookEntry`, `InternshipTask`, `Project`, `ProjectMember`, `TitleSimilarityHit`, `ProjectTask`, `Milestone`, `Deliverable`, `Rubric`, `Evaluation`, `FinalScore`, `MessageThread`, `Message`, `Announcement`, `Notification`, `ReminderLog`, `Document`, `AuditEvent`, `FaqEntry`, `ChatbotLog`, `AiSummary`.

Enums match `@trackbridge/shared`. Do not cascade-delete placements or CBTP history when an organization or site is archived.

`seed/` must create **all six roles**, at least one CBTP site/group with membership, one opportunity/placement, attendance + logbook sample, one project title with stored similarity hits, published FAQ rows, and an open `Period`. Passwords from env (`SEED_*_PASSWORD`).

### 4.3 `backend/.env.example`

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://trackbridge:trackbridge@localhost:5432/trackbridge
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
UPLOAD_DIR=./uploads
MAX_FILE_MB=10
AI_SERVICE_URL=http://localhost:8000
SMTP_HOST=localhost
SMTP_PORT=1025
MAIL_FROM="TrackBridge <noreply@localhost>"
APP_URL=http://localhost:5173
TZ=Africa/Addis_Ababa
LOG_LEVEL=info
```

`src/config/env.ts` parses with zod and exits if required keys are missing.

### 4.4 Middleware and entry

Same pattern as before: `authenticate` / `authorize('coordinator' | 'advisor' | …)` / `validate` / login rate limit. `req.user.role` is one of the six roles.

### 4.5 Route modules (SRS mapping)

Mounted from `app.ts` under `/api/v1`:

| Mount | Folder | SRS |
| --- | --- | --- |
| `/auth` | `modules/auth` | FR-AUTH |
| `/users` | `modules/users` | profiles |
| `/admin` | `modules/admin` | FR-ADM, FAQ publish |
| `/periods` | `modules/periods` | academic period |
| `/cbtp/sites`, `/cbtp/activities`, `/cbtp/groups`, `/cbtp/submissions` | `modules/cbtp` | FR-CBTP |
| `/organizations`, `/opportunities`, `/applications`, `/placements`, `/attendance`, `/logbooks` | `modules/internships` | FR-INP |
| `/projects` | `modules/projects` | FR-TPM |
| `/evaluations` | `modules/evaluations` | CBTP/internship/project scores |
| `/messages`, `/notifications` | `modules/communications` | FR-NTF, FR-COM |
| `/dashboard` | `modules/dashboard` | FR-DSH (six payloads) |
| `/reports`, `/archive` | `modules/reports` | FR-RPT-01–04 delayed work included |
| `/files` | `modules/files` | INT-FILE |
| `/ai/match`, `/ai/recommend`, `/ai/warnings`, `/ai/summarize`, `/ai/title-similarity`, `/ai/faq` | `modules/ai` | FR-AI-* |

Indicative routes:

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password

GET/POST /api/v1/admin/users
PATCH    /api/v1/admin/users/:id/role
GET/PUT  /api/v1/admin/config
GET/POST /api/v1/admin/faq
POST     /api/v1/admin/faq/:id/publish

GET/POST /api/v1/cbtp/sites
GET/POST /api/v1/cbtp/sites/:id/activities
GET/POST /api/v1/cbtp/groups
POST     /api/v1/cbtp/groups/:id/members
GET/POST /api/v1/cbtp/submissions
POST     /api/v1/cbtp/submissions/:id/review

GET/POST /api/v1/organizations
GET/POST /api/v1/opportunities
POST     /api/v1/applications
POST     /api/v1/applications/:id/decision
POST     /api/v1/placements/:id/supervisors
GET/POST /api/v1/placements/:id/attendance
GET/POST /api/v1/logbooks/:weekId/submit
POST     /api/v1/logbooks/:entryId/review

POST /api/v1/projects
POST /api/v1/projects/:id/title
GET  /api/v1/projects/:id/similarity
POST /api/v1/projects/:id/tasks
POST /api/v1/projects/:id/milestones

POST /api/v1/ai/match
POST /api/v1/ai/recommend
GET  /api/v1/ai/warnings
POST /api/v1/ai/summarize
POST /api/v1/ai/title-similarity
POST /api/v1/ai/faq
```

`modules/ai/aiClient.ts` times out and maps failures to FR-AI-02 (core CRUD still works). `earlyWarning.service.ts` runs **rules in SQL/JS** (missed deadlines, overdue milestones, days since last activity) — not a trained model.

### 4.6 Jobs, mail, PDF, audit

| Path | SRS |
| --- | --- |
| `jobs/reminderJob.ts` | FR-NTF-03/04 |
| `jobs/earlyWarningJob.ts` | FR-AI-WARN recompute + notify |
| `pdf/templates/*` | FR-RPT CBTP / internship / project / delayed work |
| `audit/audit.service.ts` | FR-AUD |

### 4.7 Tests

Unit: scoring, early-warning rules, recommendation ordering (match + urgency), CBTP progress percent.  
Integration: auth, CBTP approve/return, placement decision, logbook return, title submit stores similarity (AI mocked or Compose `ai`), RBAC IDOR, FAQ fallback.  
Postman collection for examiners (proposal testing tool).

---

## 5. `ai-service/` — required AI (not stubs)

Python 3.11+, FastAPI, scikit-learn, numpy. TextRank in `summarization.py` (sentence graph + PageRank; NLTK or a minimal tokenizer). **No OpenAI (or other hosted LLM) call** for the FAQ path.

| File | Behaviour |
| --- | --- |
| `matching.py` | TF-IDF on skills/interests vs `requirementsText`; cosine rank |
| `recommend.py` | matching score + urgency from close date / remaining quota; return `reasons[]` |
| `summarization.py` | TextRank extractive sentences; empty/short input → `insufficient_text` |
| `title_similarity.py` | normalise title; TF-IDF + cosine vs corpus; top N hits |
| `faq.py` | cosine vs published questions; below threshold → `{ fallback: true }` |
| `tests/` | fixtures proving rank order, fallback, non-empty summary on a long paragraph |

`GET /health` for Compose. Bind `0.0.0.0:8000` inside Docker. README documents that this realises proposal §3.2.

---

## 6. `frontend/` — React SPA

### 6.1 Tooling

Vite, React Router, Tailwind (or equivalent), charts **Should** for coordinator delayed-work counts. `VITE_API_URL=/api/v1` only. `vite.config.ts` proxies `/api` to Express.

`index.html` title: `TrackBridge` — about/footer includes the official CBTP title.

### 6.2 Shell and AI UI

`AppShell` shows working name, role, logout, bell, **chatbot** entry. `AdvisoryBanner` on matching, recommendations, title similarity, summaries, warnings. `FaqChatbot` is a panel, not a hidden route only for developers.

`RoleNav` has six menus (INT-UI-01). Host organization sees opportunities and intern progress, not CBTP site admin. Administrator sees users, config, FAQ, audit — not by default CBTP grading screens.

### 6.3 Pages vs roles

| Folder | Roles |
| --- | --- |
| `pages/dashboard/*` | All six (separate components) |
| `pages/cbtp/*` | Coordinator CRUD; student submit; advisor review |
| `pages/internships/*` | Student, host, coordinator, internship supervisor |
| `pages/projects/*` | Student, advisor, coordinator (title similarity visible) |
| `pages/ai/*` | Coordinator (and host **Should** for own posts); warnings also advisor |
| `pages/admin/*` | Administrator |
| `pages/reports/*` | Coordinator, advisor/supervisor scoped |

### 6.4 Front-end tests and Docker

Login, advisory banner, chatbot fallback copy. Production image: nginx + `try_files` + `/api` proxy to `api`.

---

## 7. `e2e/`, `docs/`, CI

Playwright specs: login each role; CBTP submit/review; internship apply/approve; project title shows similarity scores; chatbot returns a corpus answer and a fallback; coordinator dashboard shows a warning flag.

`docs/user-manuals/` — **one guide per official role** (six files). `docs/official-title.md` states CBTP vs the retired CPTP wording.

CI (`.github/workflows/ci.yml`): `npm ci`, lint, JS tests (Postgres service), `pytest` in `ai-service`, `npm run build`.

---

## 8. Implementation order

1. Workspaces, `shared` roles/statuses, Compose `db`.  
2. Prisma `0001_init` + seed **six** roles.  
3. Auth + admin config + period.  
4. React shell, six dashboards (can be thin), login.  
5. CBTP sites, groups, assignments, submissions, advisor review.  
6. Internships: orgs, opportunities, applications, placements, attendance, logbooks, supervisor tasks.  
7. `ai-service` + `modules/ai` — matching, recommend, title similarity, FAQ, TextRank; wire title submit.  
8. Early-warning rules + jobs + advisor/coordinator lists.  
9. Evaluations, notifications, four report types, archive.  
10. FAQ admin UI, chatbot, e2e, manuals.

Do not ship a module with “AI coming soon”. Title similarity and FAQ can go live as soon as `ai-service` and seed FAQ exist.

---

## 9. Naming

- HTTP folders: plural (`cbtp/groups`, `placements`).  
- Prisma models: singular PascalCase (`CbtpGroup`).  
- Statuses: snake_case from the SRS.  
- Roles: `advisor` in code, **Academic advisor** in UI; never “university supervisor” as the product role.  
- Product copy: **CBTP**, not CPTP.  
- One Express backend in this prototype; no Laravel/Django tree.

---

## 10. Official Spring Boot + SQL Server (not this folder’s default)

The approved proposal lists Spring Boot and SQL Server. This repository structure is the **Express + PostgreSQL prototype** already chosen for implementation, with a Python AI service so §3.2 algorithms are real.

A later official-stack port would add (not mix into `backend/` piecemeal):

```
backend-spring/
  pom.xml  or build.gradle
  src/main/java/et/ju/trackbridge/
    modules/cbtp|internships|projects|ai|admin/...
  src/main/resources/application.yml   # SQL Server
```

React, `shared` types, `ai-service`, and `/api/v1` paths stay. Until that port exists, **do not** leave empty Java folders in the prototype.

---

*End of folder structure. Companion: `docs/trackbridge-srs.md` v2.0.*
