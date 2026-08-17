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
