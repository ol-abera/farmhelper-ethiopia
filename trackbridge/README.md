# TrackBridge

**Official project title:** AI-Driven Integrated Web Platform for CBTP Tracking, Internship Coordination, and Technical Project Management

**Working UI name:** TrackBridge  
**Institution:** Jimma University, Jimma Institute of Technology, Faculty of Computing and Informatics, Department of Information Technology  
**Program:** Community-Based Training Program (**CBTP** — not CPTP)

This repository is a **working prototype** of one product that centralises CBTP tracking, internship coordination, and technical project management, with **live AI decision support** (not placeholders).

## Official tools vs this prototype

| Proposal §3.5 (official) | This prototype (SRS Appendix A) |
| --- | --- |
| React.js | React.js (Vite) |
| Spring Boot | Node.js / Express |
| SQL Server | PostgreSQL 16 |
| JWT | JWT (access token + httpOnly refresh cookie) |
| TF-IDF, cosine similarity, TextRank | Python FastAPI `ai-service` (scikit-learn) with a TypeScript fallback if the AI process is down |

A later Spring Boot + SQL Server port should keep `frontend/`, `shared/`, `ai-service/`, and `/api/v1` routes.

## What is implemented

Six roles: **student**, **academic advisor**, **internship supervisor**, **coordinator**, **host organization**, **administrator**.

- **CBTP:** sites, activities, groups, student assignment, document submission, advisor review/return, progress.
- **Internships:** opportunities, applications, placements, supervisor assignment, attendance, logbooks, host participation.
- **Technical projects:** title submission, TF-IDF/cosine similar titles, tasks, milestones, advisor monitoring.
- **AI (advisory only):** placement matching, urgency-aware recommendations, rule-based early warnings, TextRank report summaries, title similarity, English FAQ chatbot over a published corpus.
- **Notifications, audit/approval history, reports (CBTP / internship / project / delayed work) with PDF.**

AI never auto-approves a placement, never grades, never publishes a plagiarism verdict. Authorised staff keep the decisions (SRS Appendix C).

## Seeded demo accounts

Password for every seeded account: `TrackBridge!2026`

| Role | Email |
| --- | --- |
| Administrator | `admin@trackbridge.demo` |
| Coordinator | `coordinator@trackbridge.demo` |
| Academic advisor | `advisor@trackbridge.demo` |
| Internship supervisor | `supervisor@trackbridge.demo` |
| Host organization | `host@trackbridge.demo` |
| Student | `student@trackbridge.demo` |

Additional students: `sara.hassan@trackbridge.demo`, `yonas.girma@trackbridge.demo`. Pending registration: `pending.student@trackbridge.demo`.

## Run with Docker Compose

```bash
cp .env.example .env
docker compose up --build
# in another terminal, after the API is healthy:
docker compose exec api npx prisma db push
docker compose exec api npm run prisma:seed
```

- Web: http://localhost:5173  
- API: http://localhost:3000/api/v1/health  
- AI (internal): http://localhost:8000/health  

Do not expose `ai` on a public host in production (`docker-compose.prod.yml` unpublishes it).

## Run locally (without Compose)

Requires Node 20+, Python 3.12+, PostgreSQL 16.

```bash
sudo pg_ctlcluster 16 main start   # if using the distro cluster
# create role/database trackbridge / trackbridge
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm install
npm run prisma:generate
npx --workspace backend prisma db push
npm run prisma:seed
# terminal 1
cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --port 8000
# terminal 2
npm run dev
```

`npm run dev` starts Express (3000), the FastAPI AI service (8000), and Vite (5173). Vite proxies `/api` to Express.

## Tests

```bash
npm test --workspace=backend
npm test --workspace=frontend
cd ai-service && pytest
```

Playwright specs live in `e2e/`. Postman: `backend/postman/TrackBridge.postman_collection.json`.

## Layout

Top-level `frontend/` (React SPA) and `backend/` (Express + Prisma). `shared/` holds role/status/AI DTOs. `ai-service/` is the Python TF-IDF / TextRank / FAQ service. See `docs/trackbridge-folder-structure.md` and `docs/trackbridge-srs.md`.

## Timezone

`Africa/Addis_Ababa`.
