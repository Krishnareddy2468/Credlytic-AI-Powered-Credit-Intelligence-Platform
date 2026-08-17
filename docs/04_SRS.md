# Credlytic -- Software Requirements Specification (SRS)

Version 1.0 | August 2026 | Confidential

---

## 1. System overview

Credlytic is a web-based credit intelligence platform consisting of a Next.js frontend, FastAPI backend, PostgreSQL database, Qdrant vector store, Redis cache, Celery task queue, and LangGraph-based multi-agent AI system. The system predicts credit card eligibility using ensemble ML models, retrieves bank policy information through RAG, and orchestrates personalized financial guidance through specialized AI agents.

---

## 2. System architecture

```
Next.js Frontend
    |
    | REST API / WebSocket (streaming)
    v
FastAPI Gateway
    |-- JWT Authentication
    |-- Rate Limiting (Redis)
    |-- Input Validation (Pydantic)
    |
    v
Application Layer
    |
    +-- Eligibility Service -----> ML Engine (XGBoost + LightGBM + SHAP)
    |
    +-- Chat Service ------------> LangGraph Agent Orchestrator
    |                                  |
    |                                  +-- Credit Analysis Agent ----> ML Engine
    |                                  +-- Card Recommendation Agent -> Card DB (PostgreSQL)
    |                                  +-- Policy Compliance Agent --> Qdrant Vector Store
    |                                  +-- Financial Advisor Agent --> Aggregator
    |
    +-- Report Analysis Service -> Document Processing Pipeline
    |                                  |
    |                                  +-- PDF Parser (PyMuPDF)
    |                                  +-- Vision Model (Gemini Vision)
    |                                  +-- LLM Extraction
    |
    +-- Notification Service ----> Celery + Redis
    |
    v
Data Layer
    |-- PostgreSQL: Users, cards, profiles, applications, sessions
    |-- Qdrant: Bank policy embeddings, RBI guideline embeddings
    |-- Redis: Session cache, rate limits, Celery broker
    |-- File Storage: Uploaded credit reports (encrypted at rest)
```

---

## 3. Functional requirements

### 3.1 User management

FR-001: System shall allow user registration with email, phone, and password
FR-002: System shall authenticate users via JWT tokens with refresh token rotation
FR-003: System shall support role-based access (free user, pro user, admin)
FR-004: System shall allow users to create and update their financial profile
FR-005: System shall encrypt all PII at rest and mask sensitive fields in logs
FR-006: System shall allow users to delete their account and all associated data

### 3.2 Financial profile

FR-010: System shall accept the following profile fields:
  - Personal: age, gender, city, employment type (salaried/self-employed/business), employer name
  - Income: monthly gross income, additional income sources
  - Obligations: existing loan count, total EMI amount, credit card count, outstanding balances
  - Credit: CIBIL/credit score (self-reported or extracted), credit history age, payment history
  - Spending: monthly spending breakdown by category (online shopping, groceries, fuel, dining, travel, utilities, entertainment)
  - Goals: primary card goal (cashback, travel, fuel, dining, rewards, premium lifestyle)

FR-011: System shall validate all numeric inputs (income > 0, age 18-70, score 300-900)
FR-012: System shall calculate derived metrics: debt-to-income ratio, credit utilization, affordability index

### 3.3 ML eligibility engine

FR-020: System shall predict approval probability (0-100%) for each card in the database
FR-021: System shall classify risk tier (low / medium / high) for each prediction
FR-022: System shall estimate credit limit range (min-max) based on profile
FR-023: System shall generate SHAP feature importance for each prediction (top 5 factors)
FR-024: System shall rank cards by composite score: (approval probability * 0.6) + (personal fit * 0.4)
FR-025: System shall return predictions within 500ms for a single profile against all cards
FR-026: System shall support batch prediction for admin/API use cases
FR-027: System shall log all predictions for model retraining pipeline

### 3.4 Bank policy RAG engine

FR-030: System shall maintain a vector knowledge base of bank policy documents
FR-031: System shall support PDF ingestion with automatic parsing, chunking, and embedding
FR-032: System shall use hybrid search (dense + sparse) for retrieval
FR-033: System shall return source citations with every RAG-generated response
FR-034: System shall support incremental document updates without full re-indexing
FR-035: System shall cover minimum 20 banks and 50 cards at launch

Document types in scope:
  - Credit card MITC (Most Important Terms and Conditions)
  - Bank eligibility policy documents
  - Fee and charges schedules
  - Reward program terms
  - RBI Master Direction on credit and debit cards
  - RBI Responsible Business Conduct Directions 2026

### 3.5 Multi-agent AI system

FR-040: System shall implement a supervisor agent that classifies user intent and routes to specialists
FR-041: Credit analysis agent shall call the ML prediction API and interpret SHAP values
FR-042: Card recommendation agent shall search the card database and rank by personal ROI
FR-043: Policy compliance agent shall perform RAG retrieval and validate eligibility against bank rules
FR-044: Financial advisor agent shall synthesize outputs from other agents into actionable guidance
FR-045: System shall support parallel agent execution where agents are independent
FR-046: System shall stream agent responses to the frontend via WebSocket
FR-047: System shall maintain conversation context across turns within a session
FR-048: System shall log all agent interactions for debugging (LangSmith integration)

### 3.6 Credit report analyzer

FR-050: System shall accept PDF uploads of CIBIL, Experian, Equifax, and CRIF High Mark reports
FR-051: System shall extract: score, active loans, EMIs, credit utilization, payment history, account age
FR-052: System shall detect potential errors (duplicate entries, incorrect DPD, ghost accounts)
FR-053: System shall generate a credit health dashboard with prioritized action items
FR-054: System shall calculate projected score improvement for each recommended action
FR-055: Uploaded documents shall be encrypted at rest and deleted after 30 days (configurable)

### 3.7 Card database

FR-060: System shall maintain a structured database of Indian credit cards with:
  - Card name, bank, network (Visa/Mastercard/RuPay)
  - Annual fee, joining fee, waiver conditions
  - Reward rate by spending category
  - Cashback rates and caps
  - Lounge access details
  - Fuel surcharge waiver
  - Minimum income requirement
  - Minimum credit score requirement
  - Welcome benefits
  - Insurance coverage
  - Foreign transaction markup
  - EMI conversion options

FR-061: System shall support admin CRUD operations on card data
FR-062: System shall track card data freshness (last updated timestamp, next review date)

### 3.8 Notifications (Phase 2)

FR-070: System shall notify users when their profile crosses an eligibility threshold for a new card
FR-071: System shall notify users of bank policy changes affecting their eligible cards
FR-072: System shall support email and in-app notification channels
FR-073: System shall allow users to configure notification preferences

---

## 4. Non-functional requirements

### 4.1 Performance

NFR-001: API response time under 200ms for non-AI endpoints (profile CRUD, card listing)
NFR-002: ML prediction response under 500ms for full card suite
NFR-003: Agent chat response under 5 seconds for complete multi-agent orchestration
NFR-004: RAG retrieval under 1 second
NFR-005: System shall handle 100 concurrent users at launch, scalable to 10,000

### 4.2 Security

NFR-010: All API endpoints authenticated via JWT (except registration and login)
NFR-011: Passwords hashed with bcrypt (cost factor 12)
NFR-012: All PII encrypted at rest (AES-256)
NFR-013: HTTPS enforced for all communications
NFR-014: Rate limiting: 60 requests/minute for authenticated users, 10/minute for unauthenticated
NFR-015: Input sanitization on all user-facing endpoints
NFR-016: SQL injection prevention via parameterized queries (SQLAlchemy ORM)
NFR-017: CORS configured for frontend domain only
NFR-018: Sensitive data masked in application logs (credit scores, income, PAN)

### 4.3 Reliability

NFR-020: System uptime target: 99.5%
NFR-021: Database backups: daily automated, 30-day retention
NFR-022: Graceful degradation: if ML engine is down, show cached predictions; if RAG is down, fall back to structured card data

### 4.4 Scalability

NFR-030: Stateless API design for horizontal scaling
NFR-031: Database connection pooling (SQLAlchemy async)
NFR-032: Celery workers independently scalable
NFR-033: Qdrant collection sharding for document growth

### 4.5 Compliance

NFR-040: Digital Personal Data Protection (DPDP) Act 2023 compliance
NFR-041: User data export on request (right to portability)
NFR-042: User data deletion on request (right to erasure)
NFR-043: Clear data usage consent during registration
NFR-044: No sharing of individual user data with third parties

---

## 5. API specification (key endpoints)

### 5.1 Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### 5.2 User profile

```
GET    /api/v1/profile
PUT    /api/v1/profile
PATCH  /api/v1/profile/financial
PATCH  /api/v1/profile/spending
DELETE /api/v1/profile
```

### 5.3 Eligibility

```
POST   /api/v1/eligibility/check          -- Run full eligibility check
GET    /api/v1/eligibility/results         -- Get latest results
GET    /api/v1/eligibility/card/{card_id}  -- Detailed eligibility for one card
GET    /api/v1/eligibility/history         -- Past eligibility checks
```

### 5.4 Cards

```
GET    /api/v1/cards                       -- List all cards (filterable)
GET    /api/v1/cards/{card_id}             -- Card details
GET    /api/v1/cards/recommended           -- Personalized recommendations
GET    /api/v1/cards/compare?ids=1,2,3     -- Side-by-side comparison
```

### 5.5 Chat (Agent system)

```
POST   /api/v1/chat/message               -- Send message, get agent response
GET    /api/v1/chat/sessions               -- List chat sessions
GET    /api/v1/chat/sessions/{session_id}  -- Get session history
WS     /api/v1/chat/stream                 -- WebSocket for streaming responses
```

### 5.6 Reports

```
POST   /api/v1/reports/upload              -- Upload credit report PDF
GET    /api/v1/reports/{report_id}/analysis -- Get analysis results
GET    /api/v1/reports/{report_id}/actions  -- Get recommended actions
DELETE /api/v1/reports/{report_id}          -- Delete uploaded report
```

### 5.7 Admin

```
POST   /api/v1/admin/cards                 -- Create card
PUT    /api/v1/admin/cards/{card_id}       -- Update card
POST   /api/v1/admin/policies/ingest       -- Ingest new policy document
GET    /api/v1/admin/metrics               -- System metrics
POST   /api/v1/admin/ml/retrain            -- Trigger model retraining
```

---

## 6. Database schema (core tables)

### users
- id (UUID, PK)
- email (VARCHAR, unique)
- phone (VARCHAR, unique)
- password_hash (VARCHAR)
- role (ENUM: free, pro, admin)
- created_at, updated_at

### financial_profiles
- id (UUID, PK)
- user_id (UUID, FK -> users)
- age (INT)
- city (VARCHAR)
- employment_type (ENUM: salaried, self_employed, business)
- monthly_income (DECIMAL)
- existing_loans (INT)
- total_emi (DECIMAL)
- credit_score (INT, nullable)
- credit_score_source (ENUM: self_reported, extracted)
- credit_history_months (INT)
- credit_utilization_pct (DECIMAL)
- updated_at

### spending_profiles
- id (UUID, PK)
- user_id (UUID, FK -> users)
- online_shopping (DECIMAL)
- groceries (DECIMAL)
- fuel (DECIMAL)
- dining (DECIMAL)
- travel (DECIMAL)
- utilities (DECIMAL)
- entertainment (DECIMAL)
- other (DECIMAL)
- primary_goal (ENUM: cashback, travel, fuel, dining, rewards, premium)
- updated_at

### credit_cards
- id (UUID, PK)
- name (VARCHAR)
- bank (VARCHAR)
- network (ENUM: visa, mastercard, rupay, amex, diners)
- card_type (ENUM: entry, mid, premium, super_premium)
- annual_fee (DECIMAL)
- joining_fee (DECIMAL)
- fee_waiver_condition (TEXT)
- min_income_required (DECIMAL)
- min_credit_score (INT)
- reward_rate_general (DECIMAL)
- cashback_rate_general (DECIMAL)
- lounge_access (JSONB)
- fuel_surcharge_waiver (BOOLEAN)
- foreign_txn_markup_pct (DECIMAL)
- benefits_json (JSONB)
- category_rewards_json (JSONB)
- is_active (BOOLEAN)
- last_verified_at (TIMESTAMP)
- policy_doc_ref (VARCHAR)
- created_at, updated_at

### eligibility_checks
- id (UUID, PK)
- user_id (UUID, FK -> users)
- results_json (JSONB) -- array of {card_id, probability, risk_tier, limit_range, shap_values}
- profile_snapshot_json (JSONB)
- model_version (VARCHAR)
- created_at

### chat_sessions
- id (UUID, PK)
- user_id (UUID, FK -> users)
- messages_json (JSONB) -- array of {role, content, timestamp, agent_trace}
- created_at, updated_at

### credit_reports
- id (UUID, PK)
- user_id (UUID, FK -> users)
- file_path_encrypted (VARCHAR)
- analysis_json (JSONB)
- score_extracted (INT)
- errors_found (INT)
- expires_at (TIMESTAMP)
- created_at

### policy_documents
- id (UUID, PK)
- bank (VARCHAR)
- document_type (ENUM: mitc, eligibility, fees, rewards, rbi_guideline)
- file_path (VARCHAR)
- chunk_count (INT)
- embedding_model (VARCHAR)
- ingested_at (TIMESTAMP)
- status (ENUM: active, superseded)

---

## 7. Agent architecture detail

### 7.1 State schema (LangGraph TypedDict)

```python
class CredlyticState(TypedDict):
    user_id: str
    user_profile: dict
    user_message: str
    intent: str                    # classified by supervisor
    agents_needed: list[str]       # which agents to invoke
    credit_analysis: dict          # output from credit agent
    card_recommendations: list     # output from card agent
    policy_findings: dict          # output from policy agent
    advisor_synthesis: str         # final advisor output
    citations: list[dict]          # RAG source citations
    conversation_history: list     # prior turns
    final_response: str            # rendered response to user
```

### 7.2 Agent tools

Credit analysis agent:
- predict_eligibility(profile) -> {card_id, probability, risk_tier, shap_values}
- get_shap_explanation(prediction) -> human-readable explanation string

Card recommendation agent:
- search_cards(filters) -> list of matching cards
- calculate_reward_value(card, spending_profile) -> annual reward value in rupees
- compare_cards(card_ids) -> side-by-side comparison

Policy compliance agent:
- retrieve_policy(bank, card_name, query) -> relevant policy chunks with citations
- check_eligibility_rule(card_id, profile) -> {eligible: bool, gaps: list, source: str}

Financial advisor agent:
- generate_improvement_plan(current_profile, target_card) -> action plan with timeline
- project_score_change(actions) -> projected score after actions

### 7.3 Supervisor routing logic

```
Intent classification:
- eligibility_check -> credit_agent + policy_agent
- card_recommendation -> card_agent + policy_agent
- policy_question -> policy_agent
- improvement_plan -> credit_agent + advisor_agent
- general_question -> advisor_agent
- complex_query -> all agents
```

---

## 8. ML model specification

### 8.1 Training data

Primary: UCI Credit Approval dataset (690 instances, 15 features)
Augmented: Synthetic Indian banking features generated to match real-world distributions:
- Income bands matching Indian salary distributions by city and employment type
- CIBIL score distributions (300-900, weighted toward 650-750)
- Indian loan patterns (home loan, personal loan, education loan, auto loan)
- Credit utilization patterns
- Indian bank-specific eligibility thresholds

### 8.2 Model architecture

Ensemble: XGBoost + LightGBM with soft voting
- XGBoost: 200 estimators, max_depth 6, learning_rate 0.1
- LightGBM: 200 estimators, num_leaves 31, learning_rate 0.1
- Output: probability (average of both models), risk tier (thresholded)

### 8.3 Features (input)

Numeric: age, monthly_income, total_emi, credit_score, credit_utilization_pct, credit_history_months, existing_loans, debt_to_income_ratio, monthly_surplus (income - emi - estimated_expenses)

Categorical (one-hot): employment_type, city_tier (metro/tier1/tier2/tier3), primary_goal

### 8.4 Outputs (per card)

- approval_probability: float (0.0 - 1.0)
- risk_tier: enum (low/medium/high)
- estimated_limit_min: int
- estimated_limit_max: int
- shap_values: dict (feature -> contribution)

### 8.5 Explainability

SHAP TreeExplainer generates per-prediction feature attributions. Top 5 features displayed to user with direction and magnitude: "Credit utilization (68%) is pushing your probability down by 23 points. Reducing to 30% would increase probability by approximately 18 points."

### 8.6 Retraining

Schedule: Monthly, or when prediction accuracy drops below 85% on validation set
Process: Automated pipeline via Celery scheduled task
Versioning: Model files versioned with timestamp, A/B rollout capability

---

## 9. RAG pipeline specification

### 9.1 Document ingestion

1. Upload PDF to admin endpoint
2. PyMuPDF extracts text with layout preservation
3. LangChain RecursiveCharacterTextSplitter: chunk_size=512, chunk_overlap=64
4. sentence-transformers/all-MiniLM-L6-v2 generates embeddings (384 dimensions)
5. Chunks stored in Qdrant collection with metadata (bank, card, document_type, page_number)

### 9.2 Retrieval

1. User query embedded with same model
2. Hybrid search: dense (cosine similarity) + sparse (BM25) with score fusion
3. Top-k=5 chunks retrieved
4. Reranking pass (cross-encoder if latency budget allows, otherwise skip)
5. Retrieved chunks passed to LLM as context

### 9.3 Generation

System prompt enforces:
- Answer must be grounded in retrieved context
- Every claim must cite source document and section
- If information is not in the context, say so explicitly
- Never invent eligibility criteria or fee amounts

LLM: Gemini 1.5 Flash (development) / Llama 3.1 8B via Groq (production cost control)

---

## 10. Technology stack summary

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js | 14.x+ |
| UI framework | Tailwind CSS | 3.x |
| Backend | FastAPI | 0.110+ |
| Database | PostgreSQL | 16 |
| ORM | SQLAlchemy (async) | 2.x |
| Vector store | Qdrant | 1.9+ |
| Cache / broker | Redis | 7.x |
| Task queue | Celery | 5.x |
| ML training | XGBoost, LightGBM | latest |
| Explainability | SHAP | 0.44+ |
| Embeddings | sentence-transformers (MiniLM-L6-v2) | latest |
| RAG framework | LangChain | 0.2+ |
| Agent orchestration | LangGraph | 0.1+ |
| LLM (dev) | Google Gemini Flash | 1.5 |
| LLM (prod) | Llama 3.1 8B via Groq | latest |
| PDF processing | PyMuPDF | latest |
| Vision model | Gemini Vision | 1.5 |
| Auth | python-jose (JWT) | latest |
| Tracing | LangSmith | latest |
| Containerization | Docker + Docker Compose | latest |
| CI/CD | GitHub Actions | -- |
