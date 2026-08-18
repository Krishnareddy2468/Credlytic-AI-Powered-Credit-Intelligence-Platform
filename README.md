# Credlytic

AI-powered credit intelligence platform for Indian credit card eligibility, policy retrieval, and financial guidance.

## Plan

- Frontend tech stack: Next.js

## Project setup

This repository is initialized as a monorepo:

- `backend/` - FastAPI API service with auth, profile, and card catalogue routes
- `frontend/` - Next.js App Router frontend
- `data/` - seed data and future model datasets
- `ml/` - training workspace and model artifacts
- `docs/` - product, SRS, build plan, and architecture documents

## Run with Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Qdrant: `http://localhost:6333`

## Backend quick start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend quick start

```bash
cd frontend
npm install
npm run dev
```

Checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

The frontend deploys to Vercel with **Root Directory set to `frontend`**, and
needs no environment variables — it runs on typed mock data. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Brand assets

Every logo asset (mark, wordmark, lockup, favicons, social card) is generated
from `Credlytic Logo1.png`:

```bash
python3 docs/brand/generate-brand-assets.py
```

See [docs/brand/README.md](docs/brand/README.md).
