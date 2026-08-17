# Credlytic -- Tech Stack and AI Architecture

Version 1.0 | August 2026 | Confidential

---

## 1. Architecture overview

Credlytic is a three-tier application (frontend, backend, data) with an AI orchestration layer that coordinates machine learning inference, retrieval-augmented generation, and multi-agent reasoning. The system is containerized with Docker Compose for consistent development and deployment.

```
                    +------------------+
                    | Next.js Frontend |
                    |  (App Router + TailwindCSS) |
                    +--------+---------+
                             |
                     REST / WebSocket
                             |
                    +--------+---------+
                    |  FastAPI Gateway  |
                    |  JWT | Rate Limit |
                    +--------+---------+
                             |
          +------------------+------------------+
          |                  |                  |
  +-------+------+  +-------+------+  +-------+--------+
  | Eligibility  |  | Chat/Agent   |  | Report         |
  | Service      |  | Service      |  | Analysis       |
  +--------------+  +--------------+  +----------------+
          |                  |                  |
  +-------+------+  +-------+------+  +-------+--------+
  | ML Engine    |  | LangGraph    |  | Document       |
  | XGBoost      |  | Supervisor   |  | Processor      |
  | LightGBM     |  +------+-------+  | PyMuPDF        |
  | SHAP         |         |          | Gemini Vision  |
  +--------------+  +------+-------+  +----------------+
                    |   4 Agents   |
                    +-+----+----+--+
                      |    |    |
              +-------+  +-+---+---+  +----------+
              | ML API | | Qdrant  |  | Card DB  |
              +--------+ | (RAG)  |  | (Postgres)|
                         +---------+  +----------+
```

---

## 2. Full technology stack

### 2.1 Frontend

| Component | Technology | Purpose |
|---|---|---|
| Framework | Next.js 14+ | React framework with App Router |
| Styling | Tailwind CSS 3 | Utility-first CSS |
| State | React Context + useReducer | Global state management |
| HTTP client | Axios | API calls with interceptors |
| WebSocket | Native WebSocket API | Streaming agent responses |
| Charts | Recharts | SHAP waterfall charts, eligibility bars |
| Forms | React Hook Form + Zod | Validated profile input |
| Routing | Next.js App Router | File-based routing and layouts |
| Build | Next.js build tooling | Production build and dev server |

### 2.2 Backend

| Component | Technology | Purpose |
|---|---|---|
| Framework | FastAPI 0.110+ | Async API with auto-docs |
| Server | Uvicorn | ASGI server |
| ORM | SQLAlchemy 2.x (async) | Database operations |
| Migrations | Alembic | Schema versioning |
| Validation | Pydantic v2 | Request/response models |
| Auth | python-jose | JWT generation and verification |
| Password | bcrypt | Password hashing |
| Task queue | Celery 5.x | Background jobs (report processing, retraining) |
| Cache/broker | Redis 7.x | Session cache, rate limiting, Celery broker |
| File storage | Local filesystem (encrypted) | Credit report PDFs |
| CORS | FastAPI CORSMiddleware | Frontend origin allowlisting |

### 2.3 Database

| Component | Technology | Purpose |
|---|---|---|
| Primary DB | PostgreSQL 16 | Users, profiles, cards, sessions, checks |
| Vector store | Qdrant 1.9+ | Bank policy embeddings for RAG |
| Cache layer | Redis 7.x | Hot data, rate limit counters |

Why PostgreSQL over MongoDB: Structured financial data with strong relationships (users -> profiles -> checks) benefits from relational integrity. JSONB columns provide schema flexibility where needed (card benefits, SHAP values). SQLAlchemy async provides excellent ORM support.

Why Qdrant over Pinecone/ChromaDB: Self-hosted (Docker), no vendor lock-in, no usage-based pricing during development. Production-grade with filtering, payload indexing, and sharding. ChromaDB works for prototyping but lacks production features like clustering and snapshots.

### 2.4 Machine learning

| Component | Technology | Purpose |
|---|---|---|
| Training framework | Scikit-learn ecosystem | Data preprocessing, metrics |
| Primary model | XGBoost | Gradient boosted trees (fast, accurate) |
| Secondary model | LightGBM | Leaf-wise boosting (complementary to XGBoost) |
| Ensemble method | Soft voting (probability average) | Combined prediction |
| Explainability | SHAP (TreeExplainer) | Per-prediction feature importance |
| Hyperparameter tuning | Optuna | Bayesian optimization |
| Serialization | Joblib | Model artifact storage |
| Feature store | PostgreSQL (profile snapshots) | Training data management |

Why XGBoost + LightGBM over neural networks: Credit scoring is a structured tabular data problem. Gradient boosted trees consistently outperform deep learning on tabular data (see benchmarks). SHAP TreeExplainer provides exact, fast explanations for tree models. Neural network explanations (LIME, integrated gradients) are approximate and slower.

Why SHAP over LIME: TreeSHAP is exact (not approximate), consistent (satisfies efficiency, symmetry, dummy, additivity axioms), and computationally efficient for tree models. LIME generates local approximations that can be inconsistent across similar inputs.

### 2.5 Generative AI and RAG

| Component | Technology | Purpose |
|---|---|---|
| RAG framework | LangChain 0.2+ | Document loading, splitting, retrieval chains |
| Text splitter | RecursiveCharacterTextSplitter | Semantic-aware chunking |
| Embedding model | sentence-transformers/all-MiniLM-L6-v2 | 384-dim embeddings, fast, CPU-friendly |
| Vector search | Qdrant hybrid (dense + sparse) | Retrieval with score fusion |
| LLM (development) | Google Gemini 1.5 Flash | Free tier, fast, good quality |
| LLM (production) | Llama 3.1 8B via Groq | Cost-effective, fast inference |
| PDF parsing | PyMuPDF (fitz) | Text extraction with layout |
| Vision model | Gemini 1.5 Vision | Credit report table extraction |
| Prompt engineering | LangChain prompt templates | Consistent system prompts |

Why Gemini Flash for development: Google's free tier provides sufficient quota for development and testing. Gemini Flash is fast (sub-second responses for short prompts) and capable enough for RAG-grounded responses.

Why Llama 3.1 via Groq for production: Groq's inference speed (500+ tokens/second) matches or exceeds cloud LLM APIs. Llama 3.1 8B is open-source with no per-token cost for self-hosted, or very low cost via Groq's API. Eliminates dependency on proprietary LLM providers.

Why MiniLM-L6 for embeddings: Runs on CPU (no GPU required for development). 384 dimensions is sufficient for policy document retrieval. 5x faster than larger models (e.g., all-mpnet-base-v2) with marginal quality difference for domain-specific documents.

### 2.6 Agentic AI system

| Component | Technology | Purpose |
|---|---|---|
| Orchestration | LangGraph 0.1+ | State machine agent coordination |
| State management | TypedDict (Python) | Typed agent state schema |
| Agent tools | LangChain tool decorators | Function calling for each agent |
| Supervisor routing | LLM-based intent classification | Query routing to specialists |
| Parallel execution | LangGraph parallel branches | Independent agents run concurrently |
| Tracing | LangSmith | Full agent execution traces |
| Conversation memory | PostgreSQL (session-based) | Multi-turn context |

Why LangGraph over plain LangChain chains: LangGraph provides explicit state machines with typed state, conditional routing, parallel branches, and cycle support. Plain chains are linear and cannot express the conditional multi-agent orchestration Credlytic requires. LangGraph also provides built-in visualization of the agent graph, which is valuable for debugging and demos.

Why LangGraph over CrewAI/AutoGen: LangGraph gives full control over agent execution order, state sharing, and error handling. CrewAI and AutoGen are higher-level abstractions that trade control for convenience. For a production financial product, explicit control over agent behavior is essential. LangGraph's typed state also prevents the "agent telephone" problem where information degrades through agent-to-agent communication.

### 2.7 Infrastructure and DevOps

| Component | Technology | Purpose |
|---|---|---|
| Containerization | Docker + Docker Compose | Consistent dev/prod environments |
| Reverse proxy | Nginx | HTTPS termination, static file serving |
| SSL | Let's Encrypt (certbot) | Free SSL certificates |
| CI/CD | GitHub Actions | Automated testing and deployment |
| Cloud hosting | AWS EC2 (t3.large) or GCP Cloud Run | Production deployment |
| Monitoring | Structured logging (JSON) | Application observability |
| Agent tracing | LangSmith | AI system debugging |
| Version control | Git + GitHub | Source code management |

---

## 3. Agentic AI architecture detail

### 3.1 Agent graph structure

```
User Message
     |
     v
[Supervisor Agent]
     |
     | (intent classification + routing)
     |
     +---> [Credit Analysis Agent] (if eligibility/risk query)
     |         |
     |         +-- Tool: predict_eligibility(profile)
     |         +-- Tool: get_shap_explanation(prediction)
     |
     +---> [Card Recommendation Agent] (if card selection query)
     |         |
     |         +-- Tool: search_cards(filters)
     |         +-- Tool: calculate_reward_value(card, spending)
     |         +-- Tool: compare_cards(card_ids)
     |
     +---> [Policy Compliance Agent] (if policy/eligibility query)
     |         |
     |         +-- Tool: retrieve_policy(bank, card, query)
     |         +-- Tool: check_eligibility_rule(card, profile)
     |
     +---> [Financial Advisor Agent] (synthesis, always last)
               |
               +-- Tool: generate_improvement_plan(profile, target)
               +-- Tool: project_score_change(actions)
               |
               +-- Reads outputs from all other agents
               |
               v
          [Final Response]
```

### 3.2 Agent execution patterns

**Pattern 1: Simple query (single agent)**
User: "What is the annual fee for HDFC Regalia?"
Supervisor -> Policy Agent -> Response
Latency target: under 2 seconds

**Pattern 2: Eligibility check (two agents, parallel)**
User: "Am I eligible for SBI PRIME?"
Supervisor -> [Credit Agent + Policy Agent] (parallel) -> Advisor -> Response
Latency target: under 4 seconds

**Pattern 3: Full recommendation (all agents)**
User: "I earn 80K and spend 15K on Amazon. Which premium card should I get?"
Supervisor -> [Credit Agent + Card Agent + Policy Agent] (parallel) -> Advisor -> Response
Latency target: under 5 seconds

**Pattern 4: Improvement plan (sequential)**
User: "I want HDFC Infinia but I only earn 1.5L. What should I do?"
Supervisor -> Credit Agent -> Policy Agent -> Advisor (synthesize plan) -> Response
Latency target: under 5 seconds

### 3.3 Agent system prompts

**Supervisor:**
"You are the Credlytic supervisor agent. Classify the user's intent into one of: eligibility_check, card_recommendation, policy_question, improvement_plan, general_question, complex_query. Based on the intent, determine which specialist agents are needed. Route the query accordingly."

**Credit analysis agent:**
"You are a credit risk analyst at Credlytic. You analyze user financial profiles using ML predictions and SHAP explanations. Present findings in plain language that a non-financial user can understand. Always cite specific numbers from the prediction (probability percentage, risk tier, top SHAP factors). Never invent data -- use only what the ML model returns."

**Card recommendation agent:**
"You are a credit card specialist at Credlytic. You match user spending patterns to card benefits and calculate the real annual value in rupees. Rank recommendations by personal ROI, not by popularity or fees. Always explain why a specific card is recommended using the user's actual spending data. Never recommend a card the user is unlikely to be approved for."

**Policy compliance agent:**
"You are a bank policy analyst at Credlytic. You retrieve and interpret real bank policy documents. Every statement about eligibility criteria, fees, or benefits must cite the source document. If the information is not in the retrieved documents, say so explicitly. Never invent or assume policy details."

**Financial advisor agent:**
"You are a financial advisor at Credlytic. You synthesize insights from the credit analyst, card specialist, and policy analyst into a coherent, actionable recommendation. Provide specific, time-bound action plans when improvement is needed. Be encouraging but honest about timelines and limitations. Always remind users that this is informational guidance, not certified financial advice."

---

## 4. Data flow diagrams

### 4.1 Eligibility check flow

```
User Profile (frontend form)
     |
     v
FastAPI: /api/v1/eligibility/check
     |
     v
Pydantic validation + derived metrics calculation
     |
     v
ML Engine: XGBoost + LightGBM ensemble
     |
     v
SHAP TreeExplainer: per-card feature importance
     |
     v
Results ranked by composite score
     |
     v
PostgreSQL: save eligibility_check record
     |
     v
Response: [{card_id, name, probability, risk_tier, limit_range, shap_top5}, ...]
```

### 4.2 RAG retrieval flow

```
User query: "Am I eligible for HDFC Regalia?"
     |
     v
Query embedding: MiniLM-L6-v2 (384 dimensions)
     |
     v
Qdrant hybrid search (dense + sparse, top-k=5)
     |
     v
Retrieved chunks with metadata (bank, card, doc_type, page)
     |
     v
LLM prompt: system_prompt + user_profile + retrieved_chunks + query
     |
     v
Gemini Flash / Llama 3.1 generation
     |
     v
Response with citations: "Per HDFC's MITC (Section 3, page 2), Regalia requires..."
```

### 4.3 Multi-agent orchestration flow

```
User: "Should I apply for a premium card?"
     |
     v
Supervisor: intent=complex_query, agents=[credit, card, policy, advisor]
     |
     +---> Credit Agent: predict_eligibility(profile)
     |     Output: {probabilities per card, risk factors}
     |
     +---> Card Agent: search_cards(type=premium, spending=profile.spending)
     |     Output: {ranked premium cards with reward values}
     |
     +---> Policy Agent: retrieve_policy(premium cards, eligibility)
     |     Output: {policy requirements, current thresholds, citations}
     |
     v (all three complete)
     |
     +---> Advisor Agent: synthesize(credit_output, card_output, policy_output)
           Output: "Based on your profile (credit agent), the top premium cards
                    for your spending are X and Y (card agent). Per current bank
                    policies (policy agent), you qualify for X at 82% but Y
                    requires Rs 1L income. Here is your plan to unlock Y..."
     |
     v
Final response streamed to user via WebSocket
```

---

## 5. Development environment setup

### 5.1 Prerequisites

- Python 3.11+
- Node.js 20+ (LTS)
- Docker and Docker Compose
- Git

### 5.2 Docker Compose services

```yaml
services:
  api:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql+asyncpg://credlytic:password@db:5432/credlytic
      - REDIS_URL=redis://redis:6379/0
      - QDRANT_URL=http://qdrant:6333
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
    depends_on: [db, redis, qdrant]

  frontend:
    build: ./frontend
    ports: ["3000:3000"]

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=credlytic
      - POSTGRES_USER=credlytic
      - POSTGRES_PASSWORD=password
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    volumes: ["redisdata:/data"]

  qdrant:
    image: qdrant/qdrant:v1.9.0
    volumes: ["qdrantdata:/qdrant/storage"]

  celery_worker:
    build: ./backend
    command: celery -A app.celery_app worker -l info
    depends_on: [redis, db]

volumes:
  pgdata:
  redisdata:
  qdrantdata:
```

### 5.3 Project structure

```
credlytic-platform/
|-- backend/
|   |-- app/
|   |   |-- __init__.py
|   |   |-- main.py                 # FastAPI app
|   |   |-- config.py               # Settings (env vars)
|   |   |-- database.py             # SQLAlchemy async engine
|   |   |-- models/                 # SQLAlchemy models
|   |   |   |-- user.py
|   |   |   |-- profile.py
|   |   |   |-- card.py
|   |   |   |-- eligibility.py
|   |   |   |-- chat.py
|   |   |   |-- report.py
|   |   |-- schemas/                # Pydantic models
|   |   |-- routers/                # API route handlers
|   |   |   |-- auth.py
|   |   |   |-- profile.py
|   |   |   |-- eligibility.py
|   |   |   |-- cards.py
|   |   |   |-- chat.py
|   |   |   |-- reports.py
|   |   |   |-- admin.py
|   |   |-- services/               # Business logic
|   |   |-- ml/                     # ML model loading and prediction
|   |   |   |-- predictor.py
|   |   |   |-- explainer.py
|   |   |   |-- models/             # Serialized model files
|   |   |-- rag/                    # RAG pipeline
|   |   |   |-- ingestion.py
|   |   |   |-- retrieval.py
|   |   |   |-- generation.py
|   |   |-- agents/                 # LangGraph agents
|   |   |   |-- supervisor.py
|   |   |   |-- credit_agent.py
|   |   |   |-- card_agent.py
|   |   |   |-- policy_agent.py
|   |   |   |-- advisor_agent.py
|   |   |   |-- graph.py            # LangGraph graph definition
|   |   |   |-- state.py            # State schema
|   |   |   |-- tools.py            # Agent tool definitions
|   |   |-- middleware/              # Auth, rate limiting, logging
|   |   |-- celery_app.py
|   |-- tests/
|   |-- alembic/                    # Database migrations
|   |-- requirements.txt
|   |-- Dockerfile
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- hooks/
|   |   |-- services/               # API client
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |-- package.json
|   |-- Dockerfile
|
|-- ml/
|   |-- notebooks/                  # Jupyter notebooks for exploration
|   |-- train.py                    # Training script
|   |-- evaluate.py                 # Evaluation script
|   |-- data/                       # Datasets
|   |-- models/                     # Trained model artifacts
|
|-- data/
|   |-- cards/                      # Card database seed (JSON)
|   |-- policies/                   # Bank policy PDFs
|
|-- docs/                           # This documentation
|
|-- docker-compose.yml
|-- docker-compose.prod.yml
|-- .env.example
|-- .gitignore
|-- README.md
```

---

## 6. AI tools and services summary

| Tool | Role in Credlytic | Why this tool |
|---|---|---|
| XGBoost | Primary prediction model | Best-in-class for tabular credit scoring |
| LightGBM | Secondary prediction model | Complementary leaf-wise approach, ensemble improves accuracy |
| SHAP | Model explainability | Exact feature attributions for tree models, builds user trust |
| LangGraph | Agent orchestration | Explicit state machines, typed state, parallel execution, graph visualization |
| LangChain | RAG pipeline framework | Document loading, splitting, embedding, retrieval chains |
| Qdrant | Vector storage and search | Self-hosted, hybrid search, production-grade, Docker-native |
| Gemini Flash | LLM (development) | Free tier, fast, sufficient for RAG-grounded responses |
| Llama 3.1 (Groq) | LLM (production) | Open-source, fast inference via Groq, cost-effective |
| Gemini Vision | Document understanding | Credit report table extraction, structured data from PDFs |
| sentence-transformers | Text embeddings | MiniLM-L6 is fast, CPU-friendly, 384-dim is sufficient for policy docs |
| LangSmith | Agent tracing and debugging | Full execution traces, latency tracking, production monitoring |
| Celery | Background task processing | Report analysis, model retraining, notification dispatch |
| Optuna | Hyperparameter optimization | Bayesian optimization for XGBoost/LightGBM tuning |
| PyMuPDF | PDF text extraction | Fast, layout-preserving extraction from policy documents |
