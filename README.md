# Credlytic

AI-powered credit intelligence for the Indian credit card market.

Applying for a credit card in India is mostly guesswork. Banks publish vague
eligibility criteria, comparison sites rank cards by affiliate payout, and a
rejected application leaves a hard enquiry on your credit report. Credlytic
replaces the guesswork with a model: enter your financial profile once, and get
every card ranked by how likely you are to be approved — with a clear explanation
of what drove each number.

## What it does

- **Ranks 31 Indian credit cards** by approval probability for a given profile,
  spanning 11 issuers — HDFC, ICICI, SBI, Axis, Kotak, IDFC FIRST, RBL,
  IndusInd, HSBC, Amex and AU Bank.
- **Explains every score.** Each result carries the five factors that moved it
  most, in plain language: *"Your CIBIL score of 764 is increasing your
  probability by 5.410 points."*
- **Estimates a credit limit range** from income, existing EMIs and credit score.
- **Flags the blockers** — which cards you miss on income, and which on score.

## How it works

```
Financial profile  →  feature pipeline  →  XGBoost + LightGBM ensemble  →  base approval probability
                                                     ↓                              ↓
                                          SHAP TreeExplainer              per-card threshold rules
                                                     ↓                              ↓
                                            top 5 factors        ranked cards + risk tier + limit range
```

A profile is turned into 15 features — CIBIL score, income, EMIs, age, tenure,
debt-to-income, monthly surplus, credit history length, plus one-hot employment
type and city tier. A soft-voting ensemble scores it, SHAP explains it, and a
deterministic rule layer adapts the score to each card's published income and
credit-score thresholds.

Keeping the learned and rule-based parts separate is deliberate. The training
data has no per-card outcomes, so inventing a per-card model would be dressing up
a guess. The rule layer is honest about what it is and can be swapped for a real
model once per-card approval data exists.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router), React 18, TypeScript, Tailwind |
| Backend | FastAPI, SQLAlchemy 2 (async), Pydantic v2 |
| ML | XGBoost, LightGBM, scikit-learn, SHAP |
| Data | PostgreSQL, Redis, Qdrant |
| Infra | Docker Compose, Vercel |

## The model

Trained in `ml/Notebook.ipynb`, starting from the UCI Credit Approval dataset and
layering on synthetic Indian banking features — CIBIL bands, salary bands, EMI
patterns, employment type, city tier — then resampled to 5,000 rows and split
70/15/15.

| Model | Accuracy | Precision | Recall | F1 | AUC-ROC |
|---|---|---|---|---|---|
| XGBoost | 0.992 | 0.994 | 0.987 | 0.990 | 0.999 |
| LightGBM | 0.995 | 0.994 | 0.994 | 0.994 | 0.999 |
| Ensemble | 0.992 | 0.990 | 0.990 | 0.990 | 0.999 |

These scores are high because the synthetic data separates approved and denied
profiles cleanly. It is a working pipeline, not a calibrated risk model — real
bureau data would move these numbers down and make them mean more.

Scoring runs in **6-8 ms** warm. Models load once per process and are warmed at
startup rather than on first request.

## API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/v1/health` | liveness check |
| `POST` | `/api/v1/auth/register` | create an account |
| `POST` | `/api/v1/auth/login` | issue access + refresh tokens |
| `POST` | `/api/v1/auth/logout` | end a session |
| `GET` | `/api/v1/profile/{user_id}` | fetch a financial profile |
| `PUT` | `/api/v1/profile/{user_id}` | create or update a profile |
| `GET` | `/api/v1/cards` | list the card catalogue |
| `POST` | `/api/v1/eligibility/check` | score every card for a profile |

```bash
curl -X POST http://localhost:8000/api/v1/eligibility/check \
  -H 'Content-Type: application/json' \
  -d '{"top_n": 1, "profile": {
        "age": 31, "city": "Pune", "employment_type": "salaried",
        "monthly_gross_income": 95000, "additional_income": 5000,
        "total_emi_amount": 18000, "credit_score": 764,
        "credit_history_months": 84
      }}'
```

```json
{
  "base_probability": 1.0,
  "evaluated_cards": 31,
  "latency_ms": 6.8,
  "results": [
    {
      "bank": "Kotak",
      "name": "811",
      "probability": 0.9736,
      "risk_tier": "low",
      "limit_range": { "min": 245000, "max": 410000, "currency": "INR" },
      "shap_top5": [
        {
          "feature": "cibil_score",
          "value": "764",
          "direction": "increasing",
          "explanation": "Your cibil score of 764 is increasing your probability by 5.410 points"
        }
      ],
      "meets_income_requirement": true,
      "meets_score_requirement": true
    }
  ]
}
```

## Running it

```bash
cp .env.example .env
docker compose up --build
```

Frontend on `:3000`, API on `:8000`, interactive API docs at `/docs`.

Or run the pieces directly — Python 3.9+ and Node 20.9+:

```bash
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && uvicorn app.main:app --reload

cd frontend && npm install && npm run dev
```

Trained models are not committed. Run `ml/Notebook.ipynb` end to end to generate
them, otherwise the eligibility route returns 503 while the rest of the API
serves normally.

```bash
cd backend && pytest     # 14 tests
```

## Project structure

```
backend/     FastAPI service — auth, profiles, cards, eligibility scoring
frontend/    Next.js app — landing, onboarding, eligibility, cards, advisor
ml/          training notebook and serialized model artifacts
data/        card catalogue and training datasets
docs/        product blueprint, SRS, architecture, brand kit
```

## Where it stands

The scoring engine and the API are complete and tested. The frontend is built out
across every screen but still runs on typed mock data — connecting the two is the
next piece of work.

Also on the roadmap: a RAG layer over bank policy documents and RBI circulars so
answers cite real sources, an agentic advisor that combines eligibility, card
matching and policy lookup into one conversation, and a credit report analyser.

One caveat worth stating plainly: tokens are issued but not yet verified, so the
profile routes are unauthenticated. Auth hardening and rate limiting come before
this goes anywhere near real user data.

## Brand assets

Artwork lives in `frontend/public/brand/`, all derived from `logo-master.png`:

```bash
python3 docs/brand/generate-brand-assets.py
```

Favicons and the social card are written to `frontend/app/`, where Next.js
resolves them by file convention.
