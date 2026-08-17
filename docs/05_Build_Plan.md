# Credlytic -- Build Plan (12-Week Sprint)

Version 1.0 | August 2026 | Confidential

---

## Overview

This document outlines a 12-week development sprint to build Credlytic from zero to deployed product. The plan is structured in 4 phases, each ending with a demonstrable checkpoint. Weekly deliverables are specific and measurable.

---

## Phase 1: ML Foundation (Weeks 1-3)

### Week 1: Project setup and data pipeline

**Deliverables:**
- Initialize monorepo: credlytic-platform/
  - /backend (FastAPI)
  - /frontend (Next.js)
  - /ml (training scripts)
  - /data (datasets, card database)
  - /docs (this documentation)
- Docker Compose: FastAPI + PostgreSQL + Redis containers running
- Database schema created (users, financial_profiles, credit_cards tables)
- FastAPI boilerplate: health check, CORS, error handling middleware
- Pydantic models for user profile and financial profile
- Auth endpoints: register, login, logout (JWT with refresh tokens)
- Seed credit card database: 30+ Indian cards with complete metadata
  - HDFC: Millennia, Regalia, Regalia Gold, Infinia, MoneyBack+, Diners ClubMiles
  - ICICI: Amazon Pay, Coral, Rubyx, Sapphiro, Emeralde
  - SBI: SimplyCLICK, SimplySAVE, Cashback, PRIME, Elite
  - Axis: Ace, Flipkart, My Zone, Magnus, Privilege
  - Kotak: 811, League Platinum, Royale Signature
  - Others: Amex Gold, RBL ShopRite, IndusInd Legend, IDFC FIRST Select
- Each card entry includes: fees, income requirement, score requirement, reward rates, category benefits

**Exit criteria:** FastAPI running in Docker, user registration/login working, card database seeded.

### Week 2: ML model training

**Deliverables:**
- Dataset preparation:
  - Download UCI Credit Approval dataset
  - Generate synthetic Indian banking features (salary bands, CIBIL ranges, EMI patterns)
  - Combine into training dataset (target: 5,000+ samples after augmentation)
  - Train/validation/test split (70/15/15)
- Feature engineering:
  - Calculate debt_to_income_ratio
  - Calculate monthly_surplus
  - One-hot encode: employment_type, city_tier
  - Normalize numeric features
- Model training:
  - XGBoost: grid search over max_depth (4,5,6), learning_rate (0.05, 0.1), n_estimators (100, 200)
  - LightGBM: grid search over num_leaves (15, 31), learning_rate (0.05, 0.1)
  - Ensemble: soft voting average of both models
  - Evaluate: accuracy, precision, recall, F1, AUC-ROC on test set
- SHAP integration:
  - TreeExplainer for both models
  - Per-prediction feature importance extraction
  - Human-readable explanation generator ("Your [feature] of [value] is [increasing/decreasing] your probability by [X] points")
- Save model artifacts: joblib serialization with version timestamp
- FastAPI prediction endpoint: POST /api/v1/eligibility/check
  - Input: user financial profile
  - Output: array of {card_id, probability, risk_tier, limit_range, shap_top5}
  - Response time target: under 500ms

**Exit criteria:** ML model trained with 80%+ accuracy, SHAP working, prediction API endpoint functional.

### Week 3: Frontend MVP and end-to-end integration

**Deliverables:**
- Next.js frontend:
  - Landing page with product description
  - Registration and login forms
  - Profile input form (personal, financial, spending breakdown)
  - Eligibility dashboard: ranked card list with probability bars
  - Card detail modal: full card info + SHAP waterfall chart
  - Responsive design (mobile-first)
- Integration:
  - Frontend calls backend APIs (auth, profile, eligibility)
  - Profile submission triggers ML prediction
  - Results displayed in real-time on dashboard
  - SHAP explanations rendered as visual waterfall charts
- Testing:
  - End-to-end flow: register -> fill profile -> see ranked cards with explanations
  - Test with 5 different user profiles (different income/score/employment combinations)

**Demo checkpoint 1:** User enters profile, instantly sees ranked cards with approval probabilities and SHAP explanations for each prediction.

---

## Phase 2: RAG + GenAI Layer (Weeks 4-6)

### Week 4: Document collection and RAG pipeline

**Deliverables:**
- Collect 15-20 real bank policy PDFs:
  - MITC documents for top 15 cards
  - Eligibility criteria pages from bank websites (saved as PDF)
  - RBI Master Direction on Credit Card and Debit Card (2022, amended 2024)
  - RBI Responsible Business Conduct Directions 2026
- Qdrant setup:
  - Docker container added to Compose
  - Collection created with cosine similarity, 384 dimensions
- Ingestion pipeline:
  - PyMuPDF text extraction with layout preservation
  - RecursiveCharacterTextSplitter (chunk_size=512, overlap=64)
  - sentence-transformers/all-MiniLM-L6-v2 embedding generation
  - Metadata attached: bank, card_name, document_type, page_number
  - Admin endpoint: POST /api/v1/admin/policies/ingest
- Retrieval pipeline:
  - Query embedding with same model
  - Qdrant similarity search (top-k=5)
  - Response includes chunk text + metadata for citations

**Exit criteria:** 15+ documents ingested, retrieval returning relevant chunks for test queries.

### Week 5: RAG chat interface

**Deliverables:**
- LLM integration:
  - Gemini Flash API connection (development)
  - System prompt: grounded responses, citation required, no hallucination on financial data
  - Context window: retrieved chunks + user profile + conversation history
- Chat API:
  - POST /api/v1/chat/message
  - WebSocket endpoint for streaming responses
  - Session management (store conversation history in PostgreSQL)
- Test queries and validate responses:
  - "Am I eligible for HDFC Regalia?" -- should retrieve Regalia MITC, compare income threshold
  - "Which card gives best cashback on Amazon?" -- should retrieve Amazon Pay ICICI terms
  - "What are the new RBI credit card rules?" -- should retrieve 2026 guidelines
  - "Compare HDFC Millennia vs ICICI Amazon Pay" -- should retrieve both MITCs
- Policy update workflow:
  - Upload new PDF via admin endpoint
  - System automatically chunks, embeds, and indexes
  - New information immediately available in chat responses

**Exit criteria:** Chat interface answering credit card questions with policy-grounded, cited responses.

### Week 6: Chat UI and RAG refinement

**Deliverables:**
- Frontend chat interface:
  - Chat window with message history
  - Streaming response display (token-by-token)
  - Citation links (expandable to show source text)
  - Suggested quick questions ("Am I eligible for...", "Compare...", "How to improve...")
- RAG quality improvements:
  - Test retrieval relevance on 20+ query variations
  - Tune chunk_size if needed (test 256, 512, 1024)
  - Add query expansion for better recall
  - Handle edge cases: ambiguous bank names, card name variations, Hindi queries
- Integration with eligibility engine:
  - Chat can reference user's profile: "Based on your income of Rs 60,000..."
  - Chat can trigger eligibility check: "Let me check your eligibility for that card..."

**Demo checkpoint 2:** User asks any credit card question in natural language. AI responds with policy-grounded answers citing actual bank documents.

---

## Phase 3: Agentic AI System (Weeks 7-9)

### Week 7: LangGraph setup and agent definitions

**Deliverables:**
- LangGraph installation and state schema definition (CredlyticState TypedDict)
- Supervisor agent:
  - Intent classifier (LLM-based): eligibility_check, card_recommendation, policy_question, improvement_plan, general_question, complex_query
  - Router: maps intent to required agents
- Credit analysis agent:
  - Tools: predict_eligibility(), get_shap_explanation()
  - System prompt: financial analyst persona, interprets ML outputs for users
- Agent graph definition:
  - Supervisor -> conditional routing -> parallel agent nodes -> response synthesis
- LangSmith integration:
  - Trace all agent invocations
  - Log input/output for each agent
  - Latency tracking per agent

**Exit criteria:** LangGraph graph compiled, supervisor classifying intents correctly, credit agent calling ML model.

### Week 8: Remaining agents and orchestration

**Deliverables:**
- Card recommendation agent:
  - Tools: search_cards(), calculate_reward_value(), compare_cards()
  - Matches user spending profile to card benefits
  - Calculates annual reward value in rupees per card
  - Ranks by: (reward_value * 0.5) + (approval_probability * 0.3) + (user_goal_match * 0.2)
- Policy compliance agent:
  - Tools: retrieve_policy(), check_eligibility_rule()
  - RAG retrieval with bank and card name filters
  - Returns eligibility status with specific policy citations
- Financial advisor agent:
  - Tools: generate_improvement_plan(), project_score_change()
  - Synthesizes outputs from credit + card + policy agents
  - Generates time-bound action plans with milestones
- Multi-agent orchestration:
  - Parallel execution for independent agents
  - Sequential execution where output depends on prior agent
  - Response aggregation: advisor combines all outputs into unified response

**Exit criteria:** All 4 agents functional, multi-agent flow executing for complex queries.

### Week 9: End-to-end agent testing and optimization

**Deliverables:**
- Test 25+ complex user scenarios:
  - "Should I apply for a premium card?" (triggers all agents)
  - "I was rejected by HDFC. What happened and what should I do?" (credit + policy + advisor)
  - "I spend 20K on Amazon and 10K on Swiggy monthly. Best card?" (card + policy)
  - "How can I improve my score from 650 to 750?" (credit + advisor)
  - "Compare SBI Cashback vs Axis Ace for daily spending" (card + policy)
- Optimize agent latency:
  - Target: complete multi-agent response under 5 seconds
  - Identify bottlenecks (LLM calls, RAG retrieval, ML prediction)
  - Implement caching for repeated policy retrievals
- Error handling:
  - Agent timeout handling (individual agent fails gracefully)
  - Fallback responses when RAG has no relevant documents
  - Disambiguation prompts for vague queries
- Update chat UI for agent transparency:
  - Show which agents are working (subtle loading indicators)
  - Display citations from policy agent
  - Show SHAP chart when credit agent contributes

**Demo checkpoint 3:** Single user query triggers multi-agent orchestration. Response is personalized, policy-grounded, and includes actionable advice. Full agent trace visible in LangSmith.

---

## Phase 4: Production Hardening (Weeks 10-12)

### Week 10: Credit report analyzer

**Deliverables:**
- PDF upload endpoint with file validation (size limit, format check)
- Document processing pipeline:
  - PyMuPDF text extraction
  - Gemini Vision for table/structured data extraction (score, loans, EMIs)
  - LLM extraction: structured output (JSON) from unstructured report text
- Analysis output:
  - Credit score and rating
  - Active loans list with EMI, outstanding balance, tenure remaining
  - Credit utilization per card
  - Payment history summary (on-time percentage, late payment count)
  - Potential errors detected (with confidence score)
  - Prioritized action items
- Frontend credit health dashboard:
  - Score display with rating (excellent/good/fair/poor)
  - Utilization gauge
  - Loan breakdown table
  - Action items checklist
- Security:
  - Uploaded files encrypted at rest
  - Auto-deletion after 30 days
  - PII stripped from application logs

**Exit criteria:** Credit report upload and analysis working end-to-end with dashboard visualization.

### Week 11: Security, auth hardening, and testing

**Deliverables:**
- Security audit:
  - JWT token refresh rotation
  - Rate limiting on all endpoints (Redis-backed)
  - Input validation review (all Pydantic models)
  - SQL injection testing
  - CORS configuration tightened to production domain
  - Environment variables for all secrets (no hardcoded keys)
- Role-based access:
  - Free user: 3 eligibility checks/month, 10 chat messages/day
  - Pro user: unlimited checks, unlimited chat, report analysis
  - Admin: card management, policy ingestion, metrics dashboard
- Error handling:
  - Global exception handler with structured error responses
  - Graceful degradation (ML down -> show cached results, RAG down -> show card database)
- Testing:
  - Unit tests for ML prediction pipeline
  - Integration tests for API endpoints
  - Agent flow tests (mock LLM responses)
  - Load testing: 50 concurrent users

**Exit criteria:** All security requirements met, role-based access working, test suite passing.

### Week 12: Deployment, monitoring, and documentation

**Deliverables:**
- Docker Compose production configuration:
  - FastAPI (Uvicorn, multiple workers)
  - PostgreSQL (with daily backup script)
  - Qdrant (persistent volume)
  - Redis (persistent volume)
  - Nginx reverse proxy (HTTPS termination)
- Deployment:
  - AWS EC2 (t3.large minimum) or GCP Cloud Run
  - SSL certificate (Let's Encrypt)
  - Domain configuration: credlytic.in
  - Environment-specific configs (dev/staging/production)
- Monitoring:
  - Application logging (structured JSON)
  - LangSmith agent tracing (production)
  - Basic health check endpoint with component status
  - Error alerting (email on critical failures)
- Documentation:
  - API documentation (auto-generated from FastAPI)
  - README.md with setup instructions
  - Architecture diagram
  - Demo video (2-3 minutes showing full user flow)

**Demo checkpoint 4 (final):** Production deployment on credlytic.in. Full user flow working: register, fill profile, see eligibility, chat with AI advisor, upload credit report, get improvement plan. System monitored and traced.

---

## Summary timeline

| Week | Phase | Key delivery |
|---|---|---|
| 1 | ML Foundation | Project setup, Docker, auth, card database (30+ cards) |
| 2 | ML Foundation | XGBoost + LightGBM training, SHAP, prediction API |
| 3 | ML Foundation | Next.js frontend, eligibility dashboard, end-to-end flow |
| 4 | RAG + GenAI | Policy document collection, Qdrant, ingestion pipeline |
| 5 | RAG + GenAI | LLM integration, chat API, policy-grounded responses |
| 6 | RAG + GenAI | Chat UI, RAG refinement, profile-aware responses |
| 7 | Agentic AI | LangGraph setup, supervisor, credit agent, LangSmith |
| 8 | Agentic AI | Card + policy + advisor agents, multi-agent orchestration |
| 9 | Agentic AI | 25+ scenario testing, latency optimization, error handling |
| 10 | Production | Credit report analyzer, health dashboard |
| 11 | Production | Security hardening, role-based access, testing |
| 12 | Production | Docker deploy, monitoring, documentation, demo video |
