# Credlytic Backend

FastAPI service for authentication, financial profiles, the credit card
catalogue, and ML-backed eligibility scoring.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API starts on `http://localhost:8000`, with interactive docs at `/docs`.
SQLite is the default store and the card catalogue seeds itself on first start.

## Implemented endpoints

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/profile/{user_id}`
- `PUT /api/v1/profile/{user_id}`
- `GET /api/v1/cards`
- `POST /api/v1/eligibility/check`

## Eligibility scoring

`POST /api/v1/eligibility/check` takes an inline `profile` or a `user_id`, and
returns every catalogue card ranked by approval probability with a `risk_tier`,
an estimated `limit_range`, and the top five SHAP factors behind the score.

Model artifacts are read from `<repo>/ml/artifacts`, overridable with
`ML_ARTIFACTS_DIR`. They load once per process and are warmed during startup, so
warm requests complete in roughly 6-8 ms.

`ml/artifacts/` is gitignored. On a fresh clone the route returns 503 until
`ml/Notebook.ipynb` has been run to regenerate the models — the rest of the API
keeps serving normally in the meantime.

Scoring is split in two deliberately: the model contributes a card-agnostic
approval propensity, and a deterministic rule layer built from each card's
published income and credit-score thresholds damps it per card. See the module
docstring in `app/services/eligibility.py`.

## Tests

```bash
pytest
```

14 tests covering the health check, the eligibility response contract, ranking,
`top_n`, the latency target, validation and not-found paths, the feature
contract, and the scoring helpers.
