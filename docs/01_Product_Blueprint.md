# Credlytic -- Product Blueprint

Version 1.0 | August 2026 | Confidential

---

## 1. Company overview

Credlytic is an AI-powered credit intelligence platform built for the Indian consumer market. The platform combines machine learning prediction, retrieval-augmented generation over bank policy documents, and multi-agent AI orchestration to help users understand their credit eligibility, discover the right credit cards, and improve their financial standing -- before they apply and risk rejection.

**Domain:** credlytic.in
**Tagline:** Credit analytics, powered by AI.
**One-liner:** Know which cards you will get -- before you apply.

---

## 2. Vision and mission

**Vision:** Become India's most trusted credit intelligence layer -- the platform every Indian consults before making a credit decision.

**Mission:** Eliminate blind credit card applications in India by giving every consumer access to AI-powered eligibility prediction, real-time bank policy intelligence, and personalized financial guidance.

---

## 3. Market opportunity

### 3.1 Market size

The Indian credit card market reached USD 20.1 billion in 2025, projected to reach USD 38.3 billion by 2034 at a 7.41% CAGR (IMARC Group). Total credit cards in circulation crossed 118.63 million as of March 2026 (RBI data), with active credit cards growing 5x from 2.1 crore to 10.7 crore in the past decade. Outstanding card balances rose 8.3x from Rs 0.4 lakh crore to Rs 3.1 lakh crore.

### 3.2 Penetration gap

Credit card penetration in India stands at just 25% of credit-active consumers (TransUnion CIBIL, July 2026). UK sits at 70%, Colombia at 62%, Hong Kong at 98%. Approximately 15+ crore credit-active consumers in India do not yet hold a credit card. This low penetration combined with rapid growth represents a massive addressable market.

### 3.3 Demographic tailwind

Half of new-to-credit-card consumers are aged 30 or below as of March 2026, up from 43% in 2022. 46% of new cardholders come from semi-urban and rural markets. This is a digital-first demographic that expects intelligent recommendations, not static comparison tables.

### 3.4 Regulatory tailwind (RBI 2026)

- Weekly CIBIL reporting (previously monthly) -- faster score updates, more data for prediction
- Mandatory transparent fee disclosure -- more structured policy data for RAG ingestion
- Written rejection reasons required -- validates the exact problem Credlytic solves
- 3-day grace period before late fees -- compliance monitoring opportunity
- Consent required for credit limit increases -- additional advisory touchpoint
- Ban on unsolicited card issuance -- users need guidance more than ever
- Responsible Business Conduct Directions (June 2026) -- bans dark patterns, pre-ticked boxes

---

## 4. Product architecture

Credlytic operates as three integrated layers:

### Layer 1: ML eligibility engine

Multi-output prediction model that assesses credit card eligibility across 30+ Indian bank cards simultaneously.

Outputs per card:
- Approval probability (0-100%)
- Risk tier (low / medium / high)
- Estimated credit limit range
- SHAP feature importance ("Your debt-to-income ratio of 42% is the primary risk factor")

### Layer 2: Bank policy RAG engine

Vector knowledge base of real bank policy documents, MITC PDFs, terms and conditions, and RBI guidelines. When policies change (income thresholds, fees, reward structures, lounge access), the system updates by ingesting new documents with zero code changes.

This is Credlytic's competitive moat. Every other platform hardcodes rules or relies on blog content. Credlytic retrieves actual policy text and generates grounded, cited responses.

### Layer 3: Multi-agent AI orchestration (LangGraph)

Four specialized agents coordinated by a supervisor:

- Credit analysis agent: Calls ML model, interprets SHAP, generates risk narrative
- Card recommendation agent: Matches spending patterns to benefits, ranks by personal ROI
- Policy compliance agent: RAG retrieval, validates eligibility against current bank rules
- Financial advisor agent: Synthesizes all outputs, builds actionable improvement roadmap

Single query triggers parallel agent execution with unified response synthesis.

---

## 5. Revenue model

### 5.1 Affiliate commissions (primary)

Free platform for users. Banks pay Rs 500-3,000 per approved application through Credlytic referral links. This is the Credit Karma model (acquired by Intuit for USD 7.1 billion).

### 5.2 Premium tier -- Credlytic Pro (secondary)

Rs 99/month: Unlimited checks, credit report analysis, improvement roadmap, priority notifications, detailed SHAP explanations. Target 5% conversion of MAU.

### 5.3 B2B API (tertiary)

Banks and fintechs integrate Credlytic's eligibility engine. Per-API-call pricing: Rs 2-5 per check.

---

## 6. Expansion roadmap

Phase 1 (2026-2027): India -- 20+ banks, 50+ cards, Hindi + English, CIBIL analysis
Phase 2 (2027-2028): Product expansion -- loans, insurance, investments, full financial wellness
Phase 3 (2028-2029): Southeast Asia -- Singapore, Malaysia, Indonesia
Phase 4 (2029+): Global -- US, UK/EU market entry

---

## 7. Key metrics

Growth: MAU, profile completion rate, daily eligibility checks, chat queries per session
Revenue: Affiliate CTR, application conversion rate, revenue per user, Pro conversion rate
Product: ML accuracy, RAG relevance score, agent latency (target under 3 seconds), NPS
Engagement: 7-day and 30-day retention, notification open rate, return visit frequency

---

## 8. Risks and mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Policy data accuracy | High | Quarterly audit cycle, user error reporting |
| ML model drift | Medium | Monthly retraining, A/B testing |
| Regulatory changes | Medium | Rapid RAG document ingestion pipeline |
| Competitor entry | Medium | First-mover in AI-native intelligence, RAG depth moat |
| Data privacy | High | Encryption, PII masking, DPDP Act compliance |
| LLM hallucination | High | RAG grounding with citations, SHAP explanations, disclaimers |
