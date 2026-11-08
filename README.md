# FarmHelper Ethiopia

**Better farming decisions, one step at a time.**

Agricultural farm management web application for smallholder farmers in Ethiopia (initial focus: Oromia, maize).

## Stack

- **Frontend:** React + Vite + Tailwind CSS + React Router + Axios + React Hook Form
- **Backend:** Django + Django REST Framework + SimpleJWT
- **Database:** SQLite (dev) / PostgreSQL (production-ready config)

## Features (Phase 1–3 foundation)

- Public landing page with agricultural design system
- Registration & login (JWT)
- Farmer profile with region / zone / woreda / kebele
- Farm record CRUD (create, list, search, detail, edit, delete)
- Dashboard summary (farms, area, expenses, sales, estimated profit)
- Crop model with Maize seed data
- Owner-only permissions on all farm data

## Project structure

```
farmhelper-ethiopia/
├── backend/          # Django project
│   ├── accounts/
│   ├── crops/
│   ├── farms/
│   ├── expenses/
│   ├── harvests/
│   ├── sales/
│   ├── dashboard/
│   ├── locations/
│   └── config/
├── frontend/         # React + Vite
│   └── src/
└── README.md
```

## Setup (Windows PowerShell)

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### Backend

```powershell
cd farmhelper-ethiopia\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Optional: copy .env.example to .env and edit
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser
python manage.py runserver
```

API: http://127.0.0.1:8000/api/  
Admin: http://127.0.0.1:8000/admin/

### Frontend

```powershell
cd farmhelper-ethiopia\frontend
npm install
npm run dev
```

App: http://localhost:5173/

### Default flow

1. Open http://localhost:5173/
2. Click **Get Started** → register
3. Add a farm record
4. View dashboard summary

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/login/` | Login |
| GET | `/api/auth/me/` | Current user |
| GET/POST | `/api/farms/` | List / create farms |
| GET/PATCH/DELETE | `/api/farms/{id}/` | Detail / update / delete |
| GET | `/api/crops/` | List crops |
| GET | `/api/dashboard/summary/` | Dashboard stats |
| GET/POST | `/api/expenses/` | Expenses |
| GET/POST | `/api/harvests/` | Harvests |
| GET/POST | `/api/sales/` | Sales |

## Design system

- Deep forest `#173F35`
- Primary green `#2F7655`
- Fresh green `#75A96B`
- Cream `#F7F5EC`
- Beige `#EAE5D8`
- Charcoal `#202B27`
- Muted `#77847D`
- Amber `#D99B45`

## Known limitations (current phase)

- Offline / PWA sync not fully wired yet (architecture prepared)
- Full i18n (Afaan Oromoo / Amharic) files not complete
- Expense / harvest / sales UI pages are backend-ready; frontend pages for them come next
- Charts (Recharts) not yet on dashboard
- SQLite used for local dev; switch to PostgreSQL for production

## Next steps

1. Expense / harvest / sales frontend pages
2. Recharts on dashboard
3. i18next language switcher + translation files
4. PWA + Dexie offline queue + sync endpoint
5. Tests (pytest + React Testing Library)
6. Deployment (e.g. Railway / Render + Vercel)

## License

Portfolio project — use and adapt freely with attribution.
