# ScholarIQ

**Track your study sessions, set goals, and see the patterns behind your progress — all in one clean dashboard.**

🔗 **Live demo:** https://scholariq-eight.vercel.app

A full-stack learning-analytics web app: secure accounts, per-user study sessions and goals, and a visual analytics dashboard. Built as a portfolio project to demonstrate end-to-end full-stack engineering — from database design to a deployed, tested, containerized app with CI/CD.

> ⏳ Note: the backend is on a free tier that sleeps when idle, so the **first** request after a while can take ~30–50s to wake up.

---

## Features

- 🔐 **Authentication** — register/login with JWT tokens and bcrypt-hashed passwords
- 📚 **Study sessions** — full CRUD, scoped so users only ever see their own data
- 🎯 **Goals** — set targets and mark them complete
- 📊 **Analytics** — total time, sessions, and a per-subject bar chart (computed with SQL aggregation)
- 🌙 **Polished dark UI** — responsive React + Tailwind interface
- ✅ **Tested & automated** — pytest suite runs in CI on every push

---

## Tech stack

**Frontend:** React · TypeScript · Vite · Tailwind CSS · React Router · Recharts
**Backend:** FastAPI · SQLAlchemy · PostgreSQL · Pydantic · JWT · bcrypt
**Infra:** Docker · GitHub Actions (CI) · Vercel (frontend) · Render (backend) · Neon (database)

---

## Architecture

```
React (Vercel)  ──HTTP/JSON──▶  FastAPI (Render)  ──SQL──▶  PostgreSQL (Neon)
```

The frontend is a static SPA that calls a REST API. The API is stateless — auth
is carried by a signed JWT on each request. All data access is scoped to the
authenticated user.

---

## Running locally

### Prerequisites
- Python 3.13+, Node 20+, and PostgreSQL running locally

### Option A — Docker (one command)
```bash
docker compose up --build
# frontend: http://localhost:5173   backend: http://localhost:8000
```

### Option B — run each part directly

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then set DATABASE_URL + JWT_SECRET
uvicorn app.main:app --reload  # http://localhost:8000  (docs at /docs)
```

**Frontend**
```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

---

## Testing

```bash
cd backend
pytest              # 16 tests: auth, CRUD, ownership, analytics
```
Tests run against an isolated database and also run automatically in GitHub
Actions on every push.

---

## Project structure

```
scholariq/
├── backend/            FastAPI app
│   ├── app/
│   │   ├── auth/       register/login/JWT + current-user dependency
│   │   ├── sessions/   study session CRUD
│   │   ├── goals/      goal CRUD
│   │   ├── analytics/  aggregation endpoint
│   │   ├── models.py   SQLAlchemy models
│   │   └── main.py     app entry + router wiring
│   └── tests/          pytest suite
├── frontend/           React + TypeScript (Vite)
│   └── src/
│       ├── pages/      landing, login, register, dashboard, goals, analytics
│       ├── components/ Layout, forms, ProtectedRoute
│       ├── auth/       AuthContext (token + user state)
│       └── lib/api.ts  typed API client
├── docker-compose.yml
└── .github/workflows/  CI pipeline
```

---

## Roadmap

- ✅ Core platform: auth, sessions, goals, analytics, tests, Docker, CI, deploy
- 🔜 **AI Study Coach** (planned) — an LLM (Claude) reads your study data and
  returns personalized, structured recommendations. Server-side only.
