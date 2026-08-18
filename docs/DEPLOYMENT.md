# Deploying the Credlytic frontend to Vercel

The frontend deploys on its own. `backend/` (FastAPI) and `ml/` are **not** part
of this deployment and need separate hosting — see [Backend](#backend) below.

## 1. Vercel project settings

This is a monorepo, so the one setting that matters is the root directory.
Vercel will not detect Next.js at the repository root.

| Setting | Value |
|---|---|
| **Root Directory** | **`frontend`** ← required |
| Framework Preset | Next.js (auto-detected once the root is set) |
| Build Command | `npm run build` (default) |
| Install Command | `npm install` (default) |
| Output Directory | default — do not override |
| Node.js Version | resolved from `frontend/package.json` → `engines.node` (`>=20.9.0`) |

Under **Settings → Environment Variables**, leave *Automatically expose System
Environment Variables* enabled. `VERCEL_ENV` and `VERCEL_PROJECT_PRODUCTION_URL`
are read at build time for canonical URLs and robots rules.

## 2. Environment variables

**None are required.** The frontend runs entirely on typed mock data, so a
deployment with no variables set will build and work.

| Variable | When to set it | Effect |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | After attaching a custom domain | Canonical URLs, OG tags, `sitemap.xml`, `robots.txt`. Set to the full origin, e.g. `https://credlytic.com` |
| `NEXT_PUBLIC_API_BASE_URL` | Only once a real backend exists | Consumed by `lib/api.ts`, which is currently unused |

Without `NEXT_PUBLIC_SITE_URL`, URLs fall back to Vercel's production domain
(`VERCEL_PROJECT_PRODUCTION_URL`), which is correct out of the box.
`VERCEL_URL` is deliberately not used — it changes per deployment and would put
preview hostnames into canonical tags.

## 3. Deploy

Push the branch and import the repo in Vercel, or:

```bash
cd frontend
npx vercel        # preview deployment
npx vercel --prod # production
```

The CLI asks for the root directory on first run — answer `frontend` (or run it
from inside `frontend/`, as above).

## 4. Post-deploy checks

```bash
SITE=https://<your-deployment>.vercel.app

curl -sI  $SITE | grep -iE 'x-frame|x-content-type|referrer|strict-transport'
curl -s   $SITE/robots.txt
curl -s   $SITE/sitemap.xml | head
curl -sI  $SITE/opengraph-image.png | head -1
```

Expected:

- Security headers present, no `X-Powered-By`
- `robots.txt` allows `/` and disallows the product surfaces **on production**;
  preview deployments emit `Disallow: /`
- `sitemap.xml` uses your production origin, not a preview hostname
- Social card returns `200`

Paste the URL into a social card validator to confirm the OG image renders.

## What is deployed

| Route | Rendering |
|---|---|
| `/`, `/cards`, `/cards/compare`, `/login`, `/onboarding`, `/advisor`, `/reports`, `/settings` | Static |
| `/dashboard`, `/eligibility`, `/profile` | Server-rendered on demand (they read `searchParams` for state variants) |
| `/robots.txt`, `/sitemap.xml`, `/opengraph-image.png`, `/icon.png`, `/apple-icon.png` | Generated at build |

## Backend

`backend/` is a FastAPI service and does **not** run on this Vercel project.
`docker-compose.yml` at the repo root brings it up locally alongside Postgres,
Redis and Qdrant. When it is hosted, set `NEXT_PUBLIC_API_BASE_URL` on the
Vercel project and wire `lib/api.ts` into the feature modules.

## Known follow-ups

- **No Content-Security-Policy.** Next injects inline bootstrap scripts, so a
  strict CSP needs nonce plumbing through proxy/middleware. A broken policy is
  worse than none, so it is left off deliberately.
- **No auth gate.** Sign-in is a frontend prototype; `/dashboard` and the other
  product routes are reachable directly by URL. They are excluded from search
  results via `robots.txt`, but that is not access control.
- **Sample data is illustrative.** Every figure in the UI is mock data and is
  labelled as such in the interface.
