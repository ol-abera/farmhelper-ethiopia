# Deployment

Prototype: Docker Compose (`db`, `api`, `ai`, `web`). PostgreSQL substitutes for SQL Server. Timezone `Africa/Addis_Ababa`.

1. Copy `.env.example` → `.env`. Set JWT secrets.
2. `docker compose up --build`
3. `prisma db push` + `prisma:seed` inside `api`
4. Production compose does not publish the AI port.

Uploads stay on local disk (`UPLOAD_DIR`). SMTP in development logs to the console if host is empty.
