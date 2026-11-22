# Sequence sketches

1. **Login:** SPA → `POST /auth/login` → JWT + refresh cookie → dashboards.
2. **Placement matching:** SPA → `GET /ai/match` → Express `aiClient` → FastAPI `/match` (TF-IDF cosine) → ranked list with reasons. Coordinator still approves via `/applications/:id/decision`.
3. **Title similarity:** student submits title → Express stores hits from FastAPI `/title-similarity` → advisor reviews.
4. **FAQ:** chatbot → `POST /ai/faq` → published corpus only; fallback copy names advisor/coordinator.
