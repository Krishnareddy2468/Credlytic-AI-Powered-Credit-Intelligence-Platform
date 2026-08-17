# Credlytic Backend

FastAPI service for authentication, financial profiles, and credit card catalogue APIs.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API starts on `http://localhost:8000`.

## Implemented endpoints

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/profile/{user_id}`
- `PUT /api/v1/profile/{user_id}`
- `GET /api/v1/cards`
