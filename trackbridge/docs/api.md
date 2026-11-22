# API (`/api/v1`)

JSON REST. Access JWT in `Authorization: Bearer`. Refresh cookie `tb_refresh` (httpOnly).

Health: `GET /health`, `GET /api/v1/health`.

See SRS §5 and folder-structure §4.5 for the full map. Mounts:

- `/auth` FR-AUTH
- `/admin` FR-ADM + FAQ publish
- `/cbtp/sites|groups|submissions` FR-CBTP
- `/organizations`, `/opportunities`, `/applications`, `/placements`, `/attendance`, `/logbooks` FR-INP
- `/projects` FR-TPM
- `/evaluations`
- `/messages`, `/notifications`
- `/dashboard`, `/reports`, `/archive`
- `/files`
- `/ai/match`, `/ai/recommend`, `/ai/warnings`, `/ai/summarize`, `/ai/title-similarity`, `/ai/faq`

If `ai-service` is down, Express uses an in-process TF-IDF/TextRank/FAQ fallback (FR-AI-02). Core CRUD still works.
