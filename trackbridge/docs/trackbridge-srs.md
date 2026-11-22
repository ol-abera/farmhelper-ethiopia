# Software Requirements Specification

**Working product name:** TrackBridge  
**Official project title:** AI-Driven Integrated Web Platform for CBTP Tracking, Internship Coordination, and Technical Project Management  
**Document type:** Software Requirements Specification (IEEE 830-style)  
**Project type:** Final-year undergraduate IT project (new system)  
**Version:** 2.0  
**Date:** 22 November 2026  
**Status:** Baseline aligned to the official Jimma University FYP proposal  
**Supersedes:** SRS v1.0 (concept-note / CPTP four-role draft)

| Field | Value |
| --- | --- |
| Institution | Jimma University, Jimma Institute of Technology, Faculty of Computing and Informatics, Department of Information Technology |
| Authors | Lensa Fikadu (RR1196/15), Fenet Abdulkerm (RU0353/16), Hanan Esmael (RU0462/16), Hewan Shimalis (RR1121/15), Yohanis Worku (RR1993/15) |
| Source of truth | Official FYP proposal (same title as above). Concept-note “CPTP / four roles” is **not** the product. |
| Official tools (proposal §3.5) | React.js, Spring Boot, SQL Server, JWT, TF-IDF / cosine similarity / TextRank, local or approved server file storage, Git/GitHub, Postman, Figma, Draw.io |
| Prototype path (this SRS) | React.js + Node.js/Express + PostgreSQL + JWT + Python FastAPI AI service + SMTP + PDF + local files (see Appendix A) |

**TrackBridge** is the working name on the user interface. Documents, README files, and academic text shall use the **official title** and **CBTP** (Community-Based Training Program). Do not write CPTP.

This specification describes **one product**. AI services listed in Section 3.8 are required behaviour, not optional stubs.

---

## Table of contents

1. [Introduction](#1-introduction)
2. [Overall description](#2-overall-description)
3. [Specific requirements (functional)](#3-specific-requirements-functional)
4. [Non-functional requirements](#4-non-functional-requirements)
5. [External interface requirements](#5-external-interface-requirements)
6. [Data requirements](#6-data-requirements)
7. [Use cases](#7-use-cases)
8. [Out of scope](#8-out-of-scope)
9. [Traceability](#9-traceability)
10. [Appendix A — Official tools and prototype stack](#appendix-a--official-tools-and-prototype-stack)
11. [Appendix B — Requirement identifier scheme](#appendix-b--requirement-identifier-scheme)
12. [Appendix C — AI human-oversight rules](#appendix-c--ai-human-oversight-rules)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional, non-functional, interface and data requirements for the official FYP product: an **AI-supported, integrated web platform** that centralises **CBTP tracking**, **internship coordination**, and **technical project management**.

The document is written for:

- the student development team, as the authoritative source of what to build;
- the academic advisor and examiners, as evidence that requirements follow the approved proposal;
- future maintainers, as a baseline for verification and change control.

It is **not** a user manual, database design document, or source code. Design artefacts (UML, schema, prototypes) shall refine these requirements; they shall not contradict them without a documented change.

### 1.2 Scope

The system is a **new** responsive web application that replaces fragmented paper forms, spreadsheets, email, messaging applications and personal files used to run CBTP, internships and technical projects at one educational institution (Jimma University as the target setting).

The system shall:

- authenticate users and enforce **six** roles: **student**, **academic advisor**, **internship supervisor**, **coordinator**, **host organization**, and **system administrator**;
- provide role-based dashboards;
- manage **CBTP** sites, activities, groups, student assignments, document and report submission, advisor review/approval, and progress tracking;
- manage **internships**: opportunities, placements, supervisor assignment, attendance, logbooks, feedback and evaluation; host organisations provide placement information and take part in supervision;
- manage **technical projects** from title submission through tasks, milestones, deadlines, file uploads and advisor monitoring, including **title similarity** comparison against existing titles;
- send notifications and reminders; keep approval records and activity histories; generate reports on CBTP progress, internship activity, project status and delayed work;
- provide **AI-supported assistance** that is advisory only:
  - student-to-placement matching (TF-IDF + cosine similarity on skills/interests vs placement requirements);
  - suitability- and urgency-aware recommendations, with reasons;
  - rule-based early warnings (missed deadlines, overdue milestones, days since last activity);
  - extractive report summarization (TextRank) as draft text for reviewers;
  - project-title similarity (TF-IDF + cosine) as decision support, **not** an automatic plagiarism verdict;
  - English-language FAQ chatbot over an approved knowledge base, with fallback to an advisor or coordinator.

The expected deliverable is a **secure, usable prototype** (proposal § abstract and §4), not a production-certified institutional system. Multi-institution federation, native mobile apps, offline operation, and advanced predictive ML that needs large historical datasets are out of scope ([Section 8](#8-out-of-scope)).

**Working name:** TrackBridge (UI)  
**Product type:** Browser-based three-tier information system (presentation, application including AI, data)  
**Novelty (proposal):** combining CBTP, internships and technical projects in one role-based platform, with bounded AI decision support that does not replace academic judgement.

### 1.3 Definitions, acronyms and abbreviations

| Term | Definition |
| --- | --- |
| CBTP | Community-Based Training Program: students work with communities to identify needs, collect and analyse information, prioritise problems, prepare action plans, implement activities and assess outcomes. |
| TrackBridge | Working product name of the web system specified here. |
| Official title | AI-Driven Integrated Web Platform for CBTP Tracking, Internship Coordination, and Technical Project Management. |
| Student | Enrolled learner; views assignments and placements; submits CBTP documents, attendance and logbooks; submits project titles and updates; views deadlines and feedback. |
| Academic advisor | Academic staff who monitors assigned students and CBTP groups; reviews major reports; gives academic feedback; views progress alerts; records evaluations. Distinct from the internship supervisor. |
| Internship supervisor | Staff member who assigns and reviews internship tasks, checks logbooks and attendance, gives feedback, and evaluates intern performance. |
| Coordinator | Staff who registers CBTP sites and activities; assigns students and groups; manages internship opportunities and placements; monitors progress; generates reports. |
| Host organization | External organisation (role account) that provides placement information, assigns supervision, and reviews relevant logbooks and progress where authorised. |
| Administrator | System administrator who manages accounts, roles, permissions, system configuration, and authorised system records. |
| CBTP site | Community or partner location registered for CBTP work. |
| CBTP activity | A planned CBTP work item or phase at a site (for example needs assessment, implementation). |
| CBTP group | A set of students assigned together to a site/activity, with an academic advisor. |
| Internship opportunity | A posted workplace opening with requirements, quota and dates. |
| Placement | Approved assignment of a student to an internship opportunity / host organization. |
| Logbook | Structured (typically weekly) record of internship activity. |
| Attendance | Dated internship presence records submitted or confirmed in the system. |
| Technical project | Student project workstream (software, research, engineering, or institutional improvement): title, tasks, milestones, deadlines, files, advisor monitoring. |
| Cycle / academic period | One offering window for CBTP, internships and projects (start/end dates, deadlines). |
| Early warning | Rule-based flag for inactivity or delayed work; does **not** establish student failure. |
| TF-IDF | Term frequency–inverse document frequency text representation used for matching and title similarity. |
| Cosine similarity | Ranking metric over TF-IDF vectors. |
| TextRank | Extractive summarization algorithm used for draft report summaries. |
| FAQ chatbot | English retrieval chatbot over an approved FAQ corpus; not a general LLM tutor. |
| RBAC | Role-based access control. |
| REST | JSON HTTP APIs used by the React client. |
| JWT | JSON Web Token used for API authentication after login. |
| SPA | Single-page application (React front end). |
| SMTP | Simple Mail Transfer Protocol for notification email. |
| PII | Personally identifiable information. |

### 1.4 References

1. IEEE Std 830-1998, *IEEE Recommended Practice for Software Requirements Specifications*.
2. Jimma University, Faculty of Computing and Informatics, Department of Information Technology, *Final Year Project Proposal: AI-Driven Integrated Web Platform for CBTP Tracking, Internship Coordination, and Technical Project Management* (official source of this SRS).
3. IEEE Std 29148-2018, *Systems and software engineering — Life cycle processes — Requirements engineering*.
4. R. S. Sandhu et al., “Role-based access control models,” *Computer*, vol. 29, no. 2, 1996 (proposal [1]).
5. C. D. Manning, P. Raghavan, and H. Schütze, *Introduction to Information Retrieval*, 2008 — TF-IDF and cosine similarity (proposal [4]).
6. R. Mihalcea and P. Tarau, “TextRank: Bringing order into texts,” EMNLP 2004 (proposal [7]).
7. F. Pedregosa et al., “Scikit-learn: Machine learning in Python,” *JMLR*, 2011 (proposal [6]).
8. M. Jones, J. Bradley, and N. Sakimura, RFC 7519, JSON Web Token (proposal [11]).
9. OWASP ASVS 4.x — security checklist (not a certification claim).
10. React, Spring Boot, SQL Server, Node.js/Express, PostgreSQL, FastAPI documentation — implementation references (Appendix A).

Institutional calendar dates, letterheads and rubric weights are **configuration data**, not hard-coded law.

### 1.5 Overview of this document

- **Section 2** — product perspective, functions, six user classes, environment, constraints, assumptions.
- **Section 3** — numbered functional requirements grouped by official modules (access, CBTP, internship, technical projects, notifications/audit, dashboards/reports, AI).
- **Section 4** — non-functional requirements, including AI evaluation limits from the proposal.
- **Section 5** — UI, API, email, PDF, file storage, AI-service interfaces.
- **Section 6** — key entities and integrity rules.
- **Section 7** — use cases for every role.
- **Section 8** — out of scope (proposal limitations plus explicit exclusions).
- **Section 9** — traceability from official objectives to requirement IDs.
- **Appendices** — official vs prototype stack, ID scheme, AI oversight.

Priority used throughout:

| Priority | Meaning |
| --- | --- |
| **Must** | Required for the submitted prototype; absence is a defect. |
| **Should** | Expected unless a documented waiver exists. |
| **Could** | Desirable if time remains. |

Unmarked functional requirements are **Must**.

---

## 2. Overall description

### 2.1 Product perspective

TrackBridge is a **standalone three-tier web product**. It is not a plug-in to Moodle, Google Classroom, Microsoft Teams, or the university student-information system.

**Context.** CBTP, internships and technical projects are currently coordinated through separate paper forms, spreadsheets, email, messaging apps and personal files. The platform becomes the system of record for:

- CBTP sites, activities, groups, assignments, documents and approvals;
- internship opportunities, placements, attendance, logbooks and evaluations;
- technical project titles (with similarity support), tasks, milestones and files;
- notifications, audit/approval history and management reports;
- advisory AI outputs (matches, recommendations, early warnings, summaries, title similarity, FAQ answers).

**Related systems (external, not implemented inside the product):**

| External system | Relationship |
| --- | --- |
| User’s web browser | Runs the React SPA. |
| SMTP mail service | Sends alerts and reminders. |
| University identity / SIS | **Not integrated.** Users are provisioned in this system. |
| File storage | Server-local directory in the prototype; approved cloud/server storage if available at deployment (proposal §3.5). |
| AI runtime | Prototype: Python FastAPI process called by the application layer. Official architecture: AI-support components in the application layer. |

**Logical block diagram**

```
[Browser: React SPA]
        |  HTTPS JSON (REST) + JWT
        v
[Application layer: Express prototype API  |  official: Spring Boot]
        |-- RBAC, CBTP, internship, project, notify, report
        |-- AI client (advisory only)
        |       v
        |  [AI service: TF-IDF/cosine, TextRank, FAQ retrieval]
        |-- Relational DB (PostgreSQL prototype | SQL Server official)
        |-- File storage
        +-- SMTP
```

The chatbot does not browse the open web. AI receives only the data needed for each defined task.

### 2.2 Product functions (summary)

Functions follow the official proposal modules (§1.3).

1. **User and access management.** Registration, login, logout, profile; role-based dashboards; administrator manages accounts, roles, permissions and configuration.
2. **CBTP management.** Coordinators register sites and activities, create groups, assign students; students submit documents and reports; advisors review, feedback and approve; progress is tracked.
3. **Internship management.** Coordinators and host organisations register opportunities and placements; supervisors are assigned; students submit attendance and logbooks; supervisors give feedback and evaluate.
4. **Technical project management.** Students submit titles checked for similarity against existing titles; approved projects get tasks, milestones, deadlines and file uploads; advisors monitor progress.
5. **Notifications, monitoring and reporting.** Reminders for deadlines, pending submissions, reviews and approvals; activity histories and approval records; reports on CBTP progress, internship activity, project status and delayed work.
6. **AI-supported assistance.** Placement matching and recommendations; rule-based early warnings; report summarization; title similarity; English FAQ chatbot. Outputs support decisions; authorised staff keep final responsibility.

### 2.3 User classes and characteristics

#### 2.3.1 Student

Views assignments and placements; submits CBTP documents, attendance and logbooks; submits project titles and updates; views deadlines, feedback and (where published) evaluations. Typical load: one CBTP group assignment, optional internship placement, one technical project (individual or small team).

#### 2.3.2 Academic advisor

Monitors assigned students and CBTP groups; reviews major reports; provides academic feedback; views progress alerts (including early warnings and draft summaries); records academic evaluations. Does not administer system-wide accounts (administrator) and does not replace the internship supervisor for workplace logbooks.

#### 2.3.3 Internship supervisor

Assigns and reviews internship tasks; checks logbooks and attendance; provides feedback; evaluates intern performance. Sees only assigned interns (and, **Should**, others at the same host if the coordinator enables it).

#### 2.3.4 Coordinator

Registers CBTP sites and activities; assigns students and groups; manages internship opportunities and placements (final placement decisions); monitors progress; generates reports; reviews AI matching/recommendations as decision support. Does not require the administrator role.

#### 2.3.5 Host organization

Provides placement information (opportunities, requirements, quotas); assigns supervision (links internship supervisors); reviews relevant logbooks and intern progress where authorised. Organisation-level account, distinct from an individual internship supervisor.

#### 2.3.6 System administrator

Manages accounts, roles, permissions, system configuration (cycle dates, file limits, reminder thresholds, FAQ corpus publication), and authorised system records (audit visibility). Does not by default act as academic approver of CBTP reports or intern evaluations.

Public anonymous visitors see only landing/login/register. The academic **project advisor** (FYP supervisor of the student team) is not a seventh runtime role.

### 2.4 Operating environment

| Item | Requirement |
| --- | --- |
| Client | Desktop/laptop browsers: current Chrome, Firefox, Edge, or Safari. Primary layout 1280×720+; **Must** be a responsive web app (proposal scope). |
| Presentation | React.js SPA. |
| Application | Prototype: Node.js LTS + Express. Official proposal: Spring Boot. Same REST resource model so the React client does not depend on the Java vs Node choice. |
| AI process | Prototype: Python 3.11+ FastAPI service on loopback or Docker network; scikit-learn for TF-IDF/cosine; TextRank implementation for summaries; FAQ retrieval by cosine similarity. |
| Data | Prototype: PostgreSQL 15+ (relational substitute for SQL Server). Official: Microsoft SQL Server. |
| Files | `UPLOAD_DIR` on the API host for the prototype. |
| Email | Outbound SMTP. Development may log to console. |
| Network | HTTPS when deployed; HTTP only on localhost. |
| Hosting | Single VM or Docker Compose (`web`, `api`, `ai`, `db`) for the prototype. |

### 2.5 Constraints

- **Agile sprints** as in proposal §3.1; this SRS is the requirements baseline for the product backlog.
- **Single institution**, single product; no multi-tenant white-label.
- **UI language:** English. The chatbot is English-only.
- **Auth:** email + password + JWT. Campus SSO is out of scope.
- **Browser-only client.** Native Android/iOS apps are out of scope.
- **AI is advisory.** No auto-approve, auto-place, auto-grade, or plagiarism conviction (Appendix C).
- **No claim of production-level AI accuracy** unless measured on an appropriate dataset (proposal §3.6).
- **Grading authority:** the system stores evaluations; it does not post grades to the official university gradebook.
- **Data:** collect only what the workflows need; anonymise records used for AI experiments where possible; if adequate historical data cannot be obtained, use a clearly labelled **synthetic** dataset and disclose that limitation (proposal §3.3).

### 2.6 Assumptions and dependencies

1. The institution nominates at least one administrator and one coordinator before a cycle opens.
2. Students have a unique student ID and a working email address.
3. Host organisations can name a contact who will use a host-organization account.
4. Coordinators can enter CBTP sites, activities, groups and internship opportunities from existing forms/guidelines.
5. An approved English FAQ set can be prepared from institutional guidance (proposal §3.3).
6. SMTP credentials may be absent in development (console transport).
7. Users have sufficient internet access; **offline operation is out of scope**.
8. File uploads are documents and images, not large video courses.
9. Placement matching ranks candidates; coordinators (and authorised hosts) make the decision.
10. Title similarity shows similar existing titles and scores; advisors/coordinators decide whether a title may proceed.
11. PostgreSQL is accepted for the prototype if SQL Server is impractical. Spring Boot remains the official backend tool; the prototype may continue Express because that path is already chosen (Appendix A).

---

## 3. Specific requirements (functional)

### 3.1 Module: User and access management (including administrator)

**Goal:** Secure, role-based access for all system users (specific objective 1).

| ID | Requirement |
| --- | --- |
| FR-AUTH-01 | A **student** shall self-register with: full name, student ID, email, password, department/programme, and optional phone, skills text, and interests text (skills/interests feed AI matching). Email and student ID shall be unique. |
| FR-AUTH-02 | Student registration shall remain **pending** until an administrator or coordinator approves the account. Pending users cannot access other modules. |
| FR-AUTH-03 | The **administrator** shall create accounts for advisors, internship supervisors, coordinators, host-organization accounts, and additional administrators. Host-organization accounts shall be linked to an Organization record. |
| FR-AUTH-04 | Users shall log in with email and password. Success shall issue a JWT access token and a refresh token. |
| FR-AUTH-05 | Passwords shall be stored only as a strong one-way hash (bcrypt or Argon2). They shall never be logged or emailed. |
| FR-AUTH-06 | Logout shall revoke the refresh token server-side. |
| FR-AUTH-07 | Password reset shall use a time-limited email token. |
| FR-AUTH-08 | Protected APIs shall return 401 if unauthenticated and 403 if the role lacks permission. Enforcement is server-side. |
| FR-AUTH-09 | Primary roles shall be exactly: `student`, `advisor`, `internship_supervisor`, `coordinator`, `host_organization`, `administrator`. A user has one primary role. |
| FR-AUTH-10 | Authenticated users shall view and update their own profile (name, phone, password, and for students skills/interests). They shall not change their own role. |
| FR-AUTH-11 | After login each role shall land on its **role-specific dashboard** (FR-DSH). |
| FR-AUTH-12 | IDOR: a user shall not read or write another user’s records except where a module explicitly grants access (assigned advisor, assigned supervisor, same CBTP group **Should** for shared group files, coordinator, administrator). |
| FR-ADM-01 | The administrator shall activate, deactivate and reset accounts. Deactivated users cannot log in. Historical academic records remain. |
| FR-ADM-02 | The administrator shall assign and change roles. Role changes are audit-logged. Only an administrator can create another administrator. The first administrator is seeded by the operator. |
| FR-ADM-03 | The administrator shall configure: current academic period dates, file size/type limits, reminder thresholds, early-warning thresholds, dual-approval flags, and whether host accounts may post opportunities. |
| FR-ADM-04 | The administrator shall publish and version the **FAQ knowledge base** used by the chatbot (FR-AI-FAQ). Unpublished drafts are not queried. |
| FR-ADM-05 | The administrator shall view audit/approval histories (FR-AUD) and authorised system records; they shall not silently edit audit rows. |
| FR-ADM-06 | The administrator **Should** export/import configuration (not student grades) as JSON for backup. |
| FR-AUTH-13 | Login success/failure (without password), role changes, and activation/deactivation shall be audit-logged. |

### 3.2 Module: CBTP management

**Goal:** Centralise CBTP site, activity, group and student management (specific objective 2). Proposal workflow: coordinators register sites and activities, create groups, assign students; students submit documents and reports; advisors review, give feedback and approve; progress is tracked.

| ID | Requirement |
| --- | --- |
| FR-CBTP-01 | The coordinator shall create, update and archive **CBTP sites** (name, community/location, description, contact, status). |
| FR-CBTP-02 | The coordinator shall create **activities** under a site (title, description, start/end, deliverable expectations, status). |
| FR-CBTP-03 | The coordinator shall create **groups** (name, site, optional activity, academic period, assigned academic advisor). |
| FR-CBTP-04 | The coordinator shall **assign students** to a group. A student shall have at most one active CBTP group per academic period unless the coordinator records an explicit exception (audit). |
| FR-CBTP-05 | Assigned students and the group advisor shall see group membership, site, activities and deadlines on their dashboards. |
| FR-CBTP-06 | Students in a group shall **submit documents and reports** (type: e.g. needs assessment, action plan, progress report, final report; file + metadata). Status: `draft`, `submitted`, `returned`, `approved`. |
| FR-CBTP-07 | The assigned **academic advisor** shall comment, and **approve** or **return** a submission. Return requires a comment. |
| FR-CBTP-08 | Returned submissions become editable; resubmit sets `submitted` and stores a resubmit count. |
| FR-CBTP-09 | The coordinator shall view all sites, groups, assignments and submission statuses, with filters. |
| FR-CBTP-10 | **Progress** for a group/student shall be computed from required submission types completed (`approved`) vs required, and displayed as percent plus status `not_started`, `in_progress`, `behind`, `completed`. `behind` applies when a required item is past due and not approved. |
| FR-CBTP-11 | Advisors shall record a **CBTP evaluation** (criteria configured for the period) after sufficient approved work, or as the coordinator opens an evaluation window. |
| FR-CBTP-12 | Students shall see advisor feedback and, after the coordinator or advisor publishes, their CBTP evaluation comments/scores they are allowed to see. |
| FR-CBTP-13 | Archived sites/groups remain readable in history and reports; they shall not accept new assignments. |
| FR-CBTP-14 | File attachments follow INT-FILE. |
| FR-CBTP-15 | The coordinator **Should** copy a previous period’s site list as a draft for a new period. |
| FR-CBTP-16 | Advisors shall see only groups/students assigned to them, except coordinators and administrators who see all. |

### 3.3 Module: Internship management

**Goal:** Streamline internship placement, supervision and evaluation (specific objective 3). Includes opportunities, placements, supervisor assignment, attendance, logbooks, feedback and evaluation. Host organisations provide placement information and participate in supervision.

| ID | Requirement |
| --- | --- |
| FR-INP-01 | The coordinator shall create, update and archive **host organizations** (name, sector, address, contact). A host-organization user is linked to one organization. |
| FR-INP-02 | Coordinators and, when configuration allows, **host organization** users shall register **internship opportunities** (title, description, requirements/skills text, quota, location, open/close dates, status). |
| FR-INP-03 | Students with an approved account and no active placement in the period shall browse **open** opportunities and apply (cover note, optional CV, skills/interests already on profile). |
| FR-INP-04 | Students shall **propose** a self-sourced placement (organisation details, role, supporting file). The coordinator converts an approved proposal into organization + opportunity + placement, or rejects it with a reason. |
| FR-INP-05 | Coordinators shall approve or reject applications. Host users **Should** recommend approve/reject for their opportunities; the **coordinator makes the final placement decision**. AI rankings never auto-place (FR-AI-MATCH, Appendix C). |
| FR-INP-06 | Approval shall create a **Placement** (student, organization, opportunity, dates, status `placed`) and **Should** generate a placement letter PDF. |
| FR-INP-07 | The system shall not place a student who already has an active placement in the same period, and shall not exceed quota unless the coordinator overrides (audit). |
| FR-INP-08 | The coordinator or host organization shall **assign an internship supervisor** (user with role `internship_supervisor` linked to that organization) to a placement. Reassignment until evaluation lock; notify old/new supervisor and student. |
| FR-INP-09 | Students shall submit **attendance** records (date, present/absent/excused, optional note). Supervisors shall confirm or dispute. Unconfirmed records remain visible as pending. |
| FR-INP-10 | For each placement the system shall generate **logbook weeks** from period internship dates. Students submit entries (activities, hours, optional attachment). Status: `draft`, `submitted`, `late`, `returned`, `approved`. |
| FR-INP-11 | The internship supervisor shall comment and approve or return logbooks. Return requires a comment. Academic advisors **Should** be able to read assigned students’ internship logbooks (not approve unless configured). |
| FR-INP-12 | Host organization users shall review logbooks and progress for interns at their organisation where authorised (assigned via FR-INP-08 or org-wide flag). |
| FR-INP-13 | Internship supervisors shall **assign internship tasks** to their interns (title, due date, status) and review completion. |
| FR-INP-14 | Supervisors shall complete an **internship evaluation** form (configured criteria) per intern; drafts allowed; lock when the coordinator closes the window. |
| FR-INP-15 | Placement statuses: `applied`, `proposed`, `approved`, `placed`, `withdrawn`, `completed`, `cancelled`. |
| FR-INP-16 | Students, assigned supervisors, host org (authorised), advisor (assigned), coordinator and administrator shall download the placement letter if generated. |
| FR-INP-17 | Coordinators shall list placements with filters: organization, status, supervisor assigned/unassigned, student. |

### 3.4 Module: Technical project management

**Goal:** Support technical projects from title submission to completion (specific objective 4), including similarity comparison, tasks, milestones, deadlines, file uploads and advisor monitoring.

| ID | Requirement |
| --- | --- |
| FR-TPM-01 | A student in the current period shall submit a **project title** (title, short abstract/problem, type: software / research / engineering / institutional improvement, individual or team). |
| FR-TPM-02 | On submit, the system shall call **project-title similarity** (FR-AI-TITLE) and store similar existing titles with scores on the submission. The student and reviewers shall see this as decision support, not a plagiarism verdict. |
| FR-TPM-03 | Title status: `draft`, `submitted`, `approved`, `returned`, `withdrawn`. The **academic advisor** (or coordinator if no advisor yet) approves or returns the title. Similarity score shall not auto-reject. |
| FR-TPM-04 | Team projects: owner invites other students in the period; invitees accept/decline; max team size is configurable (default 4). One project record is shared. A student shall not own/join a second active project in the same period. |
| FR-TPM-05 | After title approval, members shall maintain **tasks** (title, assignee, due date, status `todo` / `in_progress` / `done`). |
| FR-TPM-06 | Members shall define **milestones** (title, description, due date, status `pending` / `submitted` / `accepted` / `returned`) and upload files. |
| FR-TPM-07 | The academic advisor shall accept or return milestones; return requires a comment. Advisors monitor progress for assigned projects. |
| FR-TPM-08 | Overall project status: `not_started`, `in_progress`, `behind`, `on_track`, `completed`, derived from tasks and milestones (past-due unaccepted milestone ⇒ `behind`). |
| FR-TPM-09 | Coordinators shall list all projects with title, similarity flag (e.g. max score above a configurable review threshold), advisor, members and status. |
| FR-TPM-10 | File deliverables follow INT-FILE; **Should** keep previous versions per milestone. |
| FR-TPM-11 | The advisor **Should** record a project evaluation component when the evaluation window is open (FR-EVL weights live on the period config). |
| FR-TPM-12 | Existing titles used for similarity include approved and completed titles from the current and archived periods available in the database (plus seed titles). Drafts of other students are not in the comparison corpus. |

### 3.5 Module: Notifications, approval records, and monitoring

**Goal:** Timely monitoring, feedback, notifications (specific objective 5).

| ID | Requirement |
| --- | --- |
| FR-NTF-01 | The system shall send **in-app notifications** for: account approval, placement decision, supervisor/group assignment, CBTP submission events, logbook/attendance events, title/milestone review, evaluation window, reminders, early-warning flags, and new advisor/coordinator messages. |
| FR-NTF-02 | The system shall send **email** for the same classes when SMTP is configured; otherwise log the payload (dev). Security emails (reset) always attempt send. |
| FR-NTF-03 | A scheduled job (at least daily) shall remind: upcoming CBTP/internship/project deadlines (24–48 h), missing logbooks/attendance, submissions awaiting review longer than a configured number of days, open evaluation forms. |
| FR-NTF-04 | Duplicate emails for the same `reminderKey` on the same calendar day shall not be sent (idempotent). |
| FR-NTF-05 | Coordinators **Should** broadcast an announcement to a role or to the academic period. |
| FR-NTF-06 | Users **Should** disable non-critical reminder email; account and reset emails always send. |
| FR-AUD-01 | Every approve, return, reject, placement decision, role change, evaluation lock, and configuration change shall write an **approval/activity record** (actor, action, entity, timestamp, comment). |
| FR-AUD-02 | Authorised users shall view the history for records they can access (student sees own submission timeline; advisor sees assigned; coordinator/admin see all). |
| FR-AUD-03 | Audit rows are append-only from the application UI. |
| FR-COM-01 | Authenticated users shall message within a thread tied to a CBTP group, placement, or project (participants: relevant students, advisor and/or internship supervisor, coordinator). No general social inbox. |

### 3.6 Module: Dashboards

| ID | Requirement |
| --- | --- |
| FR-DSH-01 | **Student dashboard:** CBTP group/site, internship placement, project status, upcoming deadlines, unread notifications, early-warning flags on their own work, published feedback. |
| FR-DSH-02 | **Advisor dashboard:** assigned groups and students, pending CBTP/project reviews, progress alerts / early warnings, draft summaries waiting review (**Should**), evaluation inbox. |
| FR-DSH-03 | **Internship supervisor dashboard:** assigned interns, pending logbooks, attendance to confirm, tasks, evaluations, alerts. |
| FR-DSH-04 | **Coordinator dashboard:** unassigned students (no CBTP group / no placement / no advisor), site and opportunity fill, delayed work counts, early-warning list, evaluation completion, report shortcuts, **Should** AI match queue. |
| FR-DSH-05 | **Host organization dashboard:** own opportunities, applications, placed interns, assigned supervisors, pending logbook reviews authorised to them. |
| FR-DSH-06 | **Administrator dashboard:** user counts by role, pending registrations, configuration status, FAQ publish state, job/reminder health, audit shortcut. |
| FR-DSH-07 | All figures respect RBAC. Manual refresh is required; auto-refresh **Could**. |

### 3.7 Module: Reports

**Goal:** Reports on CBTP progress, internship activity, project status, and delayed work (proposal scope).

| ID | Requirement |
| --- | --- |
| FR-RPT-01 | Coordinators (and advisors for assigned scope) shall generate a **CBTP progress** report (group/site/student filters): membership, submission statuses, percent complete, delayed items. PDF **Must**; CSV **Should**. |
| FR-RPT-02 | Coordinators and internship supervisors (assigned scope) shall generate an **internship activity** report: placements, attendance summary, logbook statuses, evaluations if present. |
| FR-RPT-03 | Coordinators and advisors (assigned scope) shall generate a **project status** report: titles, similarity review flags, milestone/task completion, behind projects. |
| FR-RPT-04 | Coordinators shall generate a **delayed work** report combining CBTP, internship and project items past due, aligned with early-warning rules. |
| FR-RPT-05 | Students **Should** download their own progress pack (CBTP + internship + project summary PDF). |
| FR-RPT-06 | Closed academic periods shall be **read-only archive**, searchable by period, student, site, organization, project title. |
| FR-RPT-07 | Official PDFs include institution name, document type, period, generated timestamp. Narrative text is taken from stored fields and optional **draft** TextRank summaries clearly labelled as AI drafts if included. |
| FR-RPT-08 | Coordinator **Should** export a student record (ZIP of PDFs + metadata). |

### 3.8 Module: AI-supported assistance

**Goal:** AI-based decision support (specific objective 6). All items **Must** be implemented as working services (not UI placeholders). All outputs are advisory (Appendix C).

#### 3.8.1 Placement matching

| ID | Requirement |
| --- | --- |
| FR-AI-MATCH-01 | The system shall represent student skills/interests and opportunity requirement text using **TF-IDF** and rank by **cosine similarity**. |
| FR-AI-MATCH-02 | An authorised coordinator (and **Should** host user for their opportunities) shall request a ranked list of students for an opportunity, and a ranked list of opportunities for a student. |
| FR-AI-MATCH-03 | Each result shall include student or opportunity id, score in [0, 1], and the text fields used. Users review results; **the system shall not create a placement from a match click without an explicit human approve action** (FR-INP-05). |
| FR-AI-MATCH-04 | Matching shall use only data the caller is allowed to see. |

#### 3.8.2 Recommendations

| ID | Requirement |
| --- | --- |
| FR-AI-REC-01 | Recommendations shall combine match suitability (cosine score) with **urgency** derived from explicit opportunity close dates / remaining quota. |
| FR-AI-REC-02 | The UI shall display **reasons** where feasible (e.g. “high skill overlap; deadline in 3 days; 1 seat left”). |
| FR-AI-REC-03 | Recommendations are ordered lists, not automatic assignments. |

#### 3.8.3 Early-warning detection

| ID | Requirement |
| --- | --- |
| FR-AI-WARN-01 | Early warnings shall be **transparent rule-based** indicators, not a trained predictor. Default rules: (a) missed CBTP or logbook deadline (item past due, not approved); (b) overdue project milestone; (c) days since last student activity (login or submission) exceeding a configured threshold (default 14 days). |
| FR-AI-WARN-02 | Thresholds shall be configurable by the administrator/coordinator (FR-ADM-03). |
| FR-AI-WARN-03 | Flags appear on advisor and coordinator dashboards and **Should** notify those roles (FR-NTF-01). Students see flags on their own dashboard. |
| FR-AI-WARN-04 | The UI shall state that a flag **does not establish student failure**. |
| FR-AI-WARN-05 | Advanced predictive models (e.g. random forests on large history) are **out of scope** (proposal §2.3.1). |

#### 3.8.4 Report summarization

| ID | Requirement |
| --- | --- |
| FR-AI-SUM-01 | The system shall produce an **extractive TextRank** draft summary of a student CBTP report or internship logbook text (concatenated fields / extracted text from allowed formats). |
| FR-AI-SUM-02 | Summaries are shown to advisors and internship supervisors as **drafts to review**. They are labelled “AI draft summary”. |
| FR-AI-SUM-03 | Summaries shall not be stored as if they were the student’s own words without the label. Saving a summary to the record **Should** keep `source = textrank`. |
| FR-AI-SUM-04 | If the source text is too short, the service shall return a clear “insufficient text” message rather than a fake summary. |

#### 3.8.5 Project-title similarity

| ID | Requirement |
| --- | --- |
| FR-AI-TITLE-01 | Submitted titles shall be normalised (trim, case-fold, collapse whitespace) and compared to the existing-title corpus with **TF-IDF + cosine similarity**. |
| FR-AI-TITLE-02 | The UI shall list the top N similar titles (default 5) with scores. |
| FR-AI-TITLE-03 | Scores shall **not** be treated as a plagiarism verdict or auto-rejection (FR-TPM-03). Copy shall state this. |
| FR-AI-TITLE-04 | Corpus membership follows FR-TPM-12. |

#### 3.8.6 English FAQ chatbot

| ID | Requirement |
| --- | --- |
| FR-AI-FAQ-01 | The system shall provide an English FAQ chatbot that **retrieves** answers from the **approved** FAQ corpus using text similarity (TF-IDF + cosine or equivalent). |
| FR-AI-FAQ-02 | If the best score is below a configured threshold, the bot shall **not** invent an answer; it shall direct the user to the responsible **advisor or coordinator** and **Should** include how to message them. |
| FR-AI-FAQ-03 | The chatbot shall **not** grade students, approve submissions, or make placement decisions. |
| FR-AI-FAQ-04 | The chatbot shall not expose other students’ PII. Answers come from the published corpus only. |
| FR-AI-FAQ-05 | Students, advisors, supervisors, hosts and coordinators may use the chatbot. The administrator maintains the corpus (FR-ADM-04). |
| FR-AI-FAQ-06 | Each query **Should** be logged (user id, query, matched FAQ id, score, fallback or not) for evaluation (proposal §3.6) without storing unnecessary PII in the answer field. |

#### 3.8.7 AI platform rules

| ID | Requirement |
| --- | --- |
| FR-AI-00 | AI endpoints are part of the tested prototype. Returning hard-coded empty lists or “coming soon” does not satisfy this module. |
| FR-AI-01 | AI services receive only fields required for the task (proposal architecture). |
| FR-AI-02 | Failures in the AI process shall not crash submission workflows: title submit still stores the title and shows “similarity unavailable — review manually”; matching pages show an error. |
| FR-AI-03 | Unit tests shall cover TF-IDF cosine ranking order on a fixture, title-similarity ordering, FAQ retrieval/fallback, TextRank non-empty output on a long fixture, and early-warning rule evaluation. |

---

## 4. Non-functional requirements

### 4.1 Performance (NFR-PER)

| ID | Requirement |
| --- | --- |
| NFR-PER-01 | Interactive CRUD APIs shall respond in under **2 s** at p95 for a prototype load of about 200 students on a modest host (2 vCPU / 4 GB planning assumption). |
| NFR-PER-02 | List and dashboard aggregates shall respond in under **3 s** under the same assumption. |
| NFR-PER-03 | Matching, title similarity and FAQ retrieval for a single request shall respond in under **5 s** on the prototype corpus (hundreds of titles/FAQs, not millions). |
| NFR-PER-04 | TextRank on a single report (up to ~5,000 words of extracted text) shall respond in under **10 s**. |
| NFR-PER-05 | PDF/CSV report for one group or 200-row delayed-work list shall complete in under **15 s**. |
| NFR-PER-06 | Prototype concurrency: remain correct with at least **30** simultaneous authenticated users. |

### 4.2 Security (NFR-SEC)

| ID | Requirement |
| --- | --- |
| NFR-SEC-01 | Deployed instances use HTTPS. Refresh cookies: `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict`. |
| NFR-SEC-02 | JWT access tokens expire in 15–60 minutes; refresh tokens are rotatable and revocable. |
| NFR-SEC-03 | RBAC and IDOR checks on every module including AI (no leaking other students’ skills lists through matching if the caller is a student — students may see ranked **opportunities for themselves**, not other students’ scores). |
| NFR-SEC-04 | Uploads stored outside the web root; authorised download only; MIME/extension allow-list. |
| NFR-SEC-05 | Parameterised queries (ORM); rate-limit login (5 failures / 15 minutes / identity); no stack traces in production. |
| NFR-SEC-06 | Secrets from environment variables. |
| NFR-SEC-07 | Chatbot and summaries shall not echo private records from outside the caller’s scope. |
| NFR-SEC-08 | Security and access-control tests shall attempt authorised and unauthorised access (proposal §3.6). |

### 4.3 Usability (NFR-USE)

| ID | Requirement |
| --- | --- |
| NFR-USE-01 | Responsive web UI (proposal scope). Core student/advisor/supervisor flows **Should** work at 375 px width. |
| NFR-USE-02 | Field-level validation in English; empty states explain next actions. |
| NFR-USE-03 | Status badges use text, not colour alone. AI outputs are visually labelled “Advisory” or “AI draft”. |
| NFR-USE-04 | Destructive actions (deactivate user, cancel placement, lock evaluations, unpublish FAQ) require confirmation. |
| NFR-USE-05 | Usability testing with representative users (proposal §3.6). |
| NFR-USE-06 | Dates in a configured campus timezone (default `Africa/Addis_Ababa`). |

### 4.4 Reliability (NFR-REL)

| ID | Requirement |
| --- | --- |
| NFR-REL-01 | Expected validation errors are 400/409 with stable codes, not 500. |
| NFR-REL-02 | Versioned database migrations. Operator backup/restore documented. |
| NFR-REL-03 | Reminder job idempotent (FR-NTF-04). |
| NFR-REL-04 | Upload failures shall not mark a submission approved; transaction rolls back or status stays draft/failed. |
| NFR-REL-05 | If the AI process is down, core CBTP/internship/project CRUD remains available (FR-AI-02). |

### 4.5 Maintainability (NFR-MAI)

| ID | Requirement |
| --- | --- |
| NFR-MAI-01 | Server code organised by the modules in Section 3, matching `docs/trackbridge-folder-structure.md`. |
| NFR-MAI-02 | Shared TypeScript types for roles and statuses (`shared/`). |
| NFR-MAI-03 | Automated tests as FR-AI-03 plus auth, CBTP approve/return, placement approval, logbook return, evaluation lock, RBAC. |
| NFR-MAI-04 | Formatter + linter on JS/TS; Python tests for AI service. |

### 4.6 Portability (NFR-POR)

| ID | Requirement |
| --- | --- |
| NFR-POR-01 | Prototype runs on Linux via Docker Compose (web, api, ai, db). |
| NFR-POR-02 | No Windows-only paths. SQL dialect differences (PostgreSQL vs SQL Server) isolated in the ORM layer. |
| NFR-POR-03 | PDFs open in standard readers. |
| NFR-POR-04 | A later move to Spring Boot + SQL Server shall keep `/api/v1` resource names in this SRS so the React app can stay. |

### 4.7 AI evaluation (NFR-AI)

From proposal §3.6: review matching relevance, chatbot answer relevance, summary usefulness, and early-warning behaviour on test examples; document limitations; **do not claim production-level accuracy** without an appropriate dataset and method.

| ID | Requirement |
| --- | --- |
| NFR-AI-01 | The test report shall include fixture-based cases for each of the six AI functions. |
| NFR-AI-02 | If synthetic data is used, the report shall say so (proposal §3.3). |

---

## 5. External interface requirements

### 5.1 User interfaces (INT-UI)

| ID | Requirement |
| --- | --- |
| INT-UI-01 | SPA routes (indicative): `/login`, `/register`, `/forgot-password`, `/dashboard`, `/cbtp/sites`, `/cbtp/groups`, `/cbtp/submissions`, `/internships/opportunities`, `/internships/placements/:id`, `/internships/attendance`, `/internships/logbook`, `/projects`, `/projects/:id`, `/evaluations`, `/messages`, `/reports`, `/archive`, `/admin/users`, `/admin/roles`, `/admin/config`, `/admin/faq`, `/ai/matching`, `/ai/warnings`, `/chatbot`. Visibility follows RBAC. |
| INT-UI-02 | Chrome: working name **TrackBridge**, subtitle or about text with the official title, current user name and role, logout, notification bell, chatbot entry. |
| INT-UI-03 | Coordinator/admin tables: sort and text filter. |
| INT-UI-04 | File upload controls show allowed types and max size. |
| INT-UI-05 | Matching, recommendations, title similarity, summaries and chatbot answers show the advisory disclaimer. |

### 5.2 API (INT-API)

React is the only first-party client. Versioned REST: **`/api/v1`**. JSON UTF-8 except multipart uploads.

| ID | Requirement |
| --- | --- |
| INT-API-01 | Resource groups: `/auth`, `/users`, `/admin`, `/periods`, `/cbtp/sites`, `/cbtp/activities`, `/cbtp/groups`, `/cbtp/submissions`, `/organizations`, `/opportunities`, `/applications`, `/placements`, `/attendance`, `/logbooks`, `/projects`, `/evaluations`, `/messages`, `/notifications`, `/dashboard`, `/reports`, `/archive`, `/files`, `/ai/match`, `/ai/recommend`, `/ai/warnings`, `/ai/summarize`, `/ai/title-similarity`, `/ai/faq`. |
| INT-API-02 | Pagination: `{ items, total, page, pageSize }` (default 20, max 100). |
| INT-API-03 | Errors: `{ error: { code, message, fields? } }`. |
| INT-API-04 | `Authorization: Bearer <access_token>` on protected routes. |

The Express prototype implements this contract. A Spring Boot implementation of the same contract would satisfy the official tool list without changing the SPA.

### 5.3 Email (INT-EMAIL)

SMTP via environment (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`). Templates for FR-NTF events. Failures are logged; domain actions still commit. Inbound email is not supported.

### 5.4 PDF (INT-PDF)

Placement letter **Should**; CBTP / internship / project / delayed-work reports **Must** as in FR-RPT. Stored as `Document` rows. No PKI signature required.

### 5.5 File storage (INT-FILE)

Prototype: local `UPLOAD_DIR`. Allowed: `pdf`, `doc`, `docx`, `ppt`, `pptx`, `xls`, `xlsx`, `png`, `jpg`, `jpeg`, `txt`. Max **10 MB**. Disk names UUID + extension; original name in metadata. Downloads authorised like the parent record.

### 5.6 AI service interface (INT-AI)

| ID | Requirement |
| --- | --- |
| INT-AI-01 | The application layer calls an internal HTTP AI service (prototype: FastAPI). Internal network only; not exposed to the public internet in the default Compose file. |
| INT-AI-02 | Endpoints include: `POST /match`, `POST /recommend`, `POST /summarize`, `POST /title-similarity`, `POST /faq`. Early warnings may be computed in the main API (SQL rules) and still appear under `/api/v1/ai/warnings`. |
| INT-AI-03 | Request/response JSON includes scores, reasons, and matched ids — no model weights. |
| INT-AI-04 | The FAQ corpus is loaded from administrator-published records (or an export file generated from them), not from an unmanaged third-party LLM API. Using a hosted LLM is **not** required and **must not** replace retrieval-from-approved-FAQ (proposal method). |

### 5.7 Hardware interfaces

None beyond networked computers and a server for Node/Java, Python, a relational database, and disk.

---

## 6. Data requirements

### 6.1 Persistent store

Relational database is the system of record. Prototype: PostgreSQL via Prisma (or equivalent ORM). Official: SQL Server. Soft-delete/archive flags rather than erasing academic history.

### 6.2 Key entities

| Entity | Key fields and rules |
| --- | --- |
| **User** | id, fullName, email unique, passwordHash, role, studentId unique if student, phone, department, skillsText, interestsText, isActive, organizationId (host and internship supervisors), createdAt. |
| **Period** | id, title, startDate, endDate, config JSON (thresholds, weights, maxTeamSize, dual flags), isOpen, isArchived. |
| **Organization** | Host organisation profile. |
| **CbtpSite** | name, location, description, contact, archivedAt. |
| **CbtpActivity** | siteId, title, dates, expectations, status. |
| **CbtpGroup** | name, siteId, activityId nullable, periodId, advisorUserId. |
| **CbtpMembership** | groupId, studentId, assignedAt, assignedBy. Unique active student per period (FR-CBTP-04). |
| **CbtpSubmission** | groupId, studentId, type, fileId, body, status, submittedAt, resubmitCount. |
| **ReviewComment** | parent type/id, authorId, body, action (`comment` \| `approve` \| `return`). |
| **Opportunity** | organizationId, title, description, requirementsText, quota, dates, isOpen. |
| **Application** | studentId, opportunityId nullable, periodId, type `apply` \| `propose`, coverNote, cvFileId, status, reason. |
| **Placement** | studentId, periodId, organizationId, opportunityId, dates, status, letterDocumentId. Unique active student per period. |
| **SupervisorAssignment** | placementId, supervisorUserId, assignedAt, assignedBy, endedAt. |
| **Attendance** | placementId, date, status, studentNote, supervisorStatus, confirmedAt. |
| **LogbookWeek** / **LogbookEntry** | as internship weekly slots + entry fields + late flag. |
| **InternshipTask** | placementId, title, dueAt, status, assignedBy. |
| **Project** | periodId, title, abstract, type, mode, proposalStatus, overallStatus. |
| **ProjectMember** | projectId, userId, teamRole, acceptedAt. |
| **TitleSimilarityHit** | projectId, otherProjectId, score, rank, computedAt. |
| **ProjectTask** / **Milestone** / **Deliverable** | tasks, milestones, files. |
| **Rubric** / **Evaluation** / **FinalScore** | period-scoped criteria for CBTP, internship, project components. |
| **MessageThread** / **Message** / **Announcement** | contextual messaging. |
| **Notification** / **ReminderLog** | in-app + email audit. |
| **Document** | type, path, originalName, mime, size, uploadedBy. |
| **AuditEvent** | actorId, action, entityType, entityId, metadata, createdAt. |
| **RefreshToken** | hashed token, expiry, revokedAt. |
| **FaqEntry** | question, answer, published, version. |
| **ChatbotLog** | userId, query, faqId, score, fallback, createdAt. |
| **AiSummary** | targetType/id, text, algorithm `textrank`, createdAt. |
| **MatchRun** | **Should** store last match request metadata for coordinators (not required to persist all scores). |

### 6.3 Integrity rules

| ID | Rule |
| --- | --- |
| DAT-01 | Host internship supervisor’s `organizationId` must match the placement’s organization. |
| DAT-02 | CBTP membership student must have role `student`. Group advisor must have role `advisor` (or coordinator acting). |
| DAT-03 | Logbook/attendance belong to a placement. CBTP submissions belong to a membership/group. |
| DAT-04 | Project members are students in the same period. |
| DAT-05 | Evaluations at submit time reference the assigned advisor or internship supervisor of the matching type. |
| DAT-06 | Deactivating a user does not cascade-delete placements, submissions or documents. |
| DAT-07 | FAQ chatbot reads only `published` FAQ rows. |
| DAT-08 | Title similarity corpus excludes `draft` titles of other users. |

### 6.4 Volumes (planning)

Prototype: 1 open period, up to 200 students, ~20 advisors, ~40 internship supervisors, ~30 host orgs, ~20 CBTP sites, ~12 logbook weeks, ~5 milestones, FAQ corpus of tens to a few hundred Q&A pairs, title corpus of hundreds. Not unlimited SaaS scale.

---

## 7. Use cases

Actors: Student (STU), Academic advisor (ADV), Internship supervisor (ISV), Coordinator (COO), Host organization (HST), Administrator (ADM), System jobs (SYS).

### 7.1 Student

| ID | Name | Main flow | FRs |
| --- | --- | --- | --- |
| UC-STU-01 | Register and await approval | Submit registration; ADM/COO approves; login. | FR-AUTH-01, 02, 04 |
| UC-STU-02 | Log in / reset password | Authenticate or email reset. | FR-AUTH-04–07 |
| UC-STU-03 | View CBTP assignment | See site, group, advisor, deadlines. | FR-CBTP-05, FR-DSH-01 |
| UC-STU-04 | Submit CBTP document/report | Upload/submit; later correct if returned. | FR-CBTP-06, 08 |
| UC-STU-05 | Apply or propose internship | Apply to opportunity or propose organisation. | FR-INP-03, 04 |
| UC-STU-06 | Submit attendance and logbook | Weekly logbook + attendance dates. | FR-INP-09, 10 |
| UC-STU-07 | Submit project title | Title + abstract; see similarity hits; wait for advisor. | FR-TPM-01–03, FR-AI-TITLE |
| UC-STU-08 | Manage project work | Tasks, milestones, files. | FR-TPM-04–07 |
| UC-STU-09 | Use FAQ chatbot | Ask English FAQ; may be referred to advisor/coordinator. | FR-AI-FAQ |
| UC-STU-10 | Read feedback and reports | Feedback, published scores, optional own PDF. | FR-CBTP-12, FR-RPT-05 |
| UC-STU-11 | Message staff | Thread on group/placement/project. | FR-COM-01 |

### 7.2 Academic advisor

| ID | Name | Main flow | FRs |
| --- | --- | --- | --- |
| UC-ADV-01 | Monitor assigned groups | Dashboard of students/groups and alerts. | FR-DSH-02, FR-AI-WARN |
| UC-ADV-02 | Review CBTP submissions | Comment, approve or return. | FR-CBTP-07, 11 |
| UC-ADV-03 | Review project title and milestones | Use similarity list as support; approve/return title; accept milestones. | FR-TPM-03, 07, FR-AI-TITLE |
| UC-ADV-04 | Review draft summaries | Open TextRank draft while reading a report. | FR-AI-SUM |
| UC-ADV-05 | Record academic evaluation | Submit CBTP/project evaluation. | FR-CBTP-11, FR-TPM-11 |
| UC-ADV-06 | Message group | Thread with students and coordinator. | FR-COM-01 |

### 7.3 Internship supervisor

| ID | Name | Main flow | FRs |
| --- | --- | --- | --- |
| UC-ISV-01 | See assigned interns | Dashboard. | FR-DSH-03, FR-INP-08 |
| UC-ISV-02 | Assign internship tasks | Create/review tasks. | FR-INP-13 |
| UC-ISV-03 | Check attendance and logbooks | Confirm attendance; approve/return logbooks. | FR-INP-09–11 |
| UC-ISV-04 | Evaluate intern | Submit evaluation form. | FR-INP-14 |
| UC-ISV-05 | Use summary + chatbot | Draft logbook summary; FAQ. | FR-AI-SUM, FR-AI-FAQ |

### 7.4 Coordinator

| ID | Name | Main flow | FRs |
| --- | --- | --- | --- |
| UC-COO-01 | Register CBTP sites, activities, groups | CRUD + assign students and advisors. | FR-CBTP-01–04 |
| UC-COO-02 | Manage internships | Orgs, opportunities, applications, placements, letters. | FR-INP-01–07, 17 |
| UC-COO-03 | Assign internship supervisors | Workload visible **Should**; notify. | FR-INP-08 |
| UC-COO-04 | Use matching and recommendations | Rank students/opportunities; then human-approve placement. | FR-AI-MATCH, FR-AI-REC, FR-INP-05 |
| UC-COO-05 | Monitor delayed work | Dashboard + delayed-work report. | FR-DSH-04, FR-RPT-04, FR-AI-WARN |
| UC-COO-06 | Generate period reports | CBTP, internship, project, delayed. | FR-RPT-01–04 |
| UC-COO-07 | Announce and close period | Broadcast **Should**; archive period. | FR-NTF-05, FR-RPT-06 |

### 7.5 Host organization

| ID | Name | Main flow | FRs |
| --- | --- | --- | --- |
| UC-HST-01 | Provide placement information | Create/edit opportunities and requirements text. | FR-INP-02, FR-DSH-05 |
| UC-HST-02 | Assign supervision | Link internship supervisor to placement. | FR-INP-08 |
| UC-HST-03 | Review intern progress | Logbooks/progress where authorised. | FR-INP-12 |
| UC-HST-04 | Recommend application outcome | **Should** recommend; coordinator decides. | FR-INP-05 |
| UC-HST-05 | View matching for own posts | **Should** see ranked applicants. | FR-AI-MATCH-02 |

### 7.6 Administrator

| ID | Name | Main flow | FRs |
| --- | --- | --- | --- |
| UC-ADM-01 | Manage accounts and roles | Create, approve, deactivate, change role. | FR-ADM-01, 02, FR-AUTH-03 |
| UC-ADM-02 | Configure system | Period, thresholds, file limits. | FR-ADM-03 |
| UC-ADM-03 | Publish FAQ corpus | Edit Q&A, publish version. | FR-ADM-04, FR-AI-FAQ |
| UC-ADM-04 | Inspect audit and jobs | Audit log, reminder health. | FR-ADM-05, FR-AUD, FR-DSH-06 |

### 7.7 System

| ID | Name | FRs |
| --- | --- | --- |
| UC-SYS-01 | Daily reminders | FR-NTF-03, 04 |
| UC-SYS-02 | Recompute early-warning flags | FR-AI-WARN |
| UC-SYS-03 | Serve AI ranking/summary/FAQ | FR-AI-* |

---

## 8. Out of scope

From official **Limitation of Scope** (§2.3.1) and explicit non-goals:

1. Native Android or iOS applications; the deliverable is a **responsive web application**.
2. **Offline operation.**
3. **Advanced predictive machine-learning models** that require large, reliable historical datasets unavailable during the project (including random-forest failure prediction). Early warning stays rule-based.
4. Automatic placement, automatic approval of submissions, automatic grading, or automatic plagiarism convictions.
5. General-purpose generative AI writing of student reports, or replacing the FAQ retriever with an unmanaged open-web chatbot.
6. Integration with SIS/LMS, campus SSO, Moodle, Google Classroom, Teams, WhatsApp or Telegram.
7. Multi-university / multi-tenant operation.
8. Video conferencing, payroll/stipends, posting official grades to the university gradebook.
9. Public marketing CMS or an open job board for non-CBTP users.
10. Certified records-management / PKI-signed PDFs.
11. Host self-onboarding of a new organisation without coordinator/administrator involvement.
12. Claiming production-level AI accuracy without measured evaluation (proposal §3.6).

---

## 9. Traceability

### 9.1 Official objectives → requirements

**General objective:** Develop a secure, role-based, AI-supported web application that integrates CBTP, internship, and technical project management.  
→ Sections 1–8, Appendix A.

| Specific objective (official proposal §2.2) | Modules | Representative FRs | Use cases |
| --- | --- | --- | --- |
| Secure, role-based access for all system users | §3.1, dashboards | FR-AUTH-*, FR-ADM-* | UC-STU-01, UC-ADM-01 |
| Centralize CBTP site, activity, and student management | §3.2 | FR-CBTP-01–16 | UC-COO-01, UC-STU-03–04, UC-ADV-02 |
| Streamline internship placement, supervision, and evaluation | §3.3 | FR-INP-01–17 | UC-COO-02–03, UC-STU-05–06, UC-ISV-*, UC-HST-* |
| Support technical projects from title submission to completion | §3.4, title AI | FR-TPM-*, FR-AI-TITLE-* | UC-STU-07–08, UC-ADV-03 |
| Timely monitoring, feedback, notifications, and reporting | §3.5–3.7 | FR-NTF-*, FR-AUD-*, FR-DSH-*, FR-RPT-* | UC-COO-05–07, UC-SYS-01 |
| AI decision support: matching, early warning, summarization, FAQ | §3.8 (all six services) | FR-AI-MATCH/REC/WARN/SUM/TITLE/FAQ | UC-COO-04, UC-STU-09, UC-ADV-01, 04 |
| Test functional correctness, security, usability, and performance | §4, §3.8.7 | NFR-*, FR-AI-03, NFR-AI-* | Test plan (not a runtime use case) |

### 9.2 Official modules → SRS

| Proposal module | SRS | API / data |
| --- | --- | --- |
| User and access management | §3.1, §3.6 admin dashboard | `/auth`, `/users`, `/admin` |
| CBTP management | §3.2 | `/cbtp/*`; Site, Activity, Group, Submission |
| Internship management | §3.3 | `/opportunities`, `/placements`, `/attendance`, `/logbooks` |
| Technical project management | §3.4 | `/projects`; TitleSimilarityHit |
| Notifications, monitoring, reporting | §3.5–3.7 | `/notifications`, `/reports`, `/archive` |
| AI-supported assistance | §3.8 | `/ai/*`, FAQ corpus, FastAPI service |

### 9.3 Problem statement coverage

| Problem (proposal §1.2) | Addressed by |
| --- | --- |
| Fragmented site registration, assignment, placements, attendance, logbooks, titles, similarity, milestones, evaluations | Modules §3.2–3.4 as one system of record |
| Duplicated records, delayed feedback, missed deadlines, poor visibility, slow reporting | RBAC data model; FR-NTF; FR-AI-WARN; FR-RPT |
| Students lack one place for assignments, placements, submissions, feedback, deadlines | FR-DSH-01, student use cases |
| Advisors/supervisors cannot see who needs support | FR-DSH-02/03, FR-AI-WARN, FR-AI-SUM |
| Coordinators spend time on records and follow-up | FR-DSH-04, reports, reminders |
| Hosts struggle to communicate requirements and review progress | FR-INP-02, 12; UC-HST-* |
| Need bounded AI to find information and risks | §3.8 + Appendix C |

### 9.4 Difference from SRS v1.0 (concept note)

SRS v1.0 described **CPTP** and **four** roles and omitted CBTP sites/groups, attendance, administrator, host-organization role, and the six named AI methods. **v2.0 replaces that product description.** TrackBridge remains only the working UI name.

---

## Appendix A — Official tools and prototype stack

### A.1 Official proposal tools (§3.5)

| Area | Official technology |
| --- | --- |
| Frontend | React.js |
| Backend | Spring Boot |
| Authentication | JWT-based API authentication |
| Database | SQL Server |
| Text processing | TF-IDF, cosine similarity, TextRank |
| File storage | Local storage for development; approved cloud or server storage if available |
| Version control | Git and GitHub; GitHub Projects for task tracking |
| Testing | Postman; browser-based usability testing; plus unit/integration/security/usability/performance/AI evaluation (§3.6) |
| Interface and diagrams | Figma and Draw.io |

Methodology: Agile sprints (proposal §3.1). Architecture: three-tier (presentation, application including AI, data).

### A.2 Prototype implementation path (this SRS and folder structure)

The first implementation work and repository layout use **React + Node.js/Express + PostgreSQL**. That path remains the **prototype** specified here because:

- React.js matches the official frontend;
- PostgreSQL is an acceptable **relational substitute** when SQL Server is impractical in the lab/demo environment;
- Express can implement the same REST contract as Spring Boot for the FYP prototype;
- a **Python FastAPI** AI service realises TF-IDF, cosine similarity and TextRank with scikit-learn (proposal references [4], [6], [7], [13]) instead of leaving AI as stubs.

| Layer | Prototype choice |
| --- | --- |
| UI | React (Vite), React Router |
| API | Node.js LTS + Express, `/api/v1` |
| ORM / DB | Prisma + PostgreSQL |
| Auth | bcrypt (or Argon2) + JWT |
| AI | Python FastAPI: matching, recommend, summarize, title-similarity, faq; rules for early warning in the API |
| Email | Nodemailer or console |
| PDF | PDFKit |
| Files | Local `UPLOAD_DIR` |
| Tests | Jest + Supertest; pytest for AI; Playwright **Should**; Postman collection |
| Run | Docker Compose: `web`, `api`, `ai`, `db` |

**Explicitly not the product:** a CPTP-only four-role system; Vue/Laravel/Django as extra official stacks; hosted LLM as the FAQ implementation.

### A.3 Mapping prototype → official tools later

| Prototype | Official |
| --- | --- |
| `frontend/` React | unchanged |
| `backend/` Express | Spring Boot, same routes |
| PostgreSQL / Prisma | SQL Server / Spring Data JPA |
| `ai-service/` FastAPI | keep as application-layer component or port algorithms to Java; behaviour in §3.8 unchanged |

---

## Appendix B — Requirement identifier scheme

| Prefix | Meaning |
| --- | --- |
| FR-AUTH / FR-ADM | Access control / administrator |
| FR-CBTP | CBTP sites, groups, submissions |
| FR-INP | Internships (opportunities, placements, attendance, logbooks, evaluation) |
| FR-TPM | Technical projects |
| FR-NTF / FR-AUD / FR-COM | Notifications, audit, messages |
| FR-DSH / FR-RPT | Dashboards / reports |
| FR-AI-MATCH / REC / WARN / SUM / TITLE / FAQ | Six AI services |
| NFR-* | Non-functional |
| INT-* | Interfaces |
| DAT-* | Data rules |
| UC-STU / ADV / ISV / COO / HST / ADM / SYS | Use cases |

---

## Appendix C — AI human-oversight rules

Quoted in requirement form from proposal §3.2:

1. AI results may be incomplete or inaccurate.
2. Similarity scores do **not** prove plagiarism.
3. Early-warning flags do **not** establish student failure.
4. Placement recommendations do **not** constitute final placement decisions.
5. Advisors, coordinators and other authorised personnel review relevant outputs.
6. When the chatbot cannot find a sufficiently relevant answer, it directs the user to the responsible advisor or coordinator.
7. The chatbot will **not** grade students, approve submissions, or make final placement decisions.

UI copy for matching, recommendations, title similarity, summaries, warnings and the chatbot shall include a short advisory statement consistent with these rules.

---

*End of SRS v2.0. Companion: `docs/trackbridge-folder-structure.md`.*
