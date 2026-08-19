# Credlytic SEO — architecture, roadmap and templates

Phase 1 (technical foundation) is implemented. Deliverables 2–4 below are the
plan; **no content pages have been generated yet, pending review.**

---

## Deliverable 2 — SEO page map

### PRIORITY 1 — build immediately

| # | URL | Intent | Primary theme | Title | H1 | Why it exists beyond a keyword |
|---|---|---|---|---|---|---|
| 1 | `/credit-card-eligibility` | Commercial investigation | credit card eligibility India / checker | Credit Card Eligibility in India — Check Before You Apply \| Credlytic | Check your credit card eligibility before you apply | The product's core intent. Explains what issuers assess, what a soft assessment can and cannot tell you, and routes to the checker. |
| 2 | `/methodology` | Trust / verification | how Credlytic estimates eligibility | Methodology — How Credlytic Estimates Eligibility \| Credlytic | How Credlytic estimates eligibility | Mandatory YMYL trust page. Defines confidence vs. issuer approval, inputs used, value-estimate maths, review cadence, limitations. |
| 3 | `/editorial-policy` | Trust / verification | how card data is researched | Editorial Policy — How We Research & Review Card Data \| Credlytic | How we research, review and correct card information | States sourcing, review frequency, corrections, and that commercial arrangements never affect ranking. |
| 4 | `/privacy` | Legal / trust | DPDP-compliant privacy | Privacy Policy \| Credlytic | Privacy policy | Legal requirement under the DPDP Act 2023. **Needs a lawyer, not a generator.** |
| 5 | `/terms` | Legal / trust | terms of use | Terms of Use \| Credlytic | Terms of use | Legal requirement. **Needs a lawyer.** |
| 6 | `/disclaimer` | Legal / trust | not financial advice | Disclaimer \| Credlytic | Important disclaimer | Separates Credlytic estimates from issuer decisions and from regulated advice. |
| 7 | `/contact` | Navigational | contact Credlytic | Contact Credlytic \| Credlytic | Contact Credlytic | Entity signal for Google; expected of a financial site. |

Internal links for 1: → `/cards`, `/methodology`, top 4 card pages, `/guides/credit-card-rejection-reasons`. CTA: run the eligibility check.

### PRIORITY 2 — after initial indexing

| # | URL | Intent | Primary theme | Differentiation |
|---|---|---|---|---|
| 8 | `/cards/amazon-pay-icici` | Card-specific | Amazon Pay ICICI eligibility & value | Profile-based value maths on real spend, not a feature list |
| 9 | `/cards/axis-ace` | Card-specific | Axis Ace eligibility, cashback caps | Caps and waiver conditions stated plainly |
| 10 | `/cards/hdfc-regalia-gold` | Card-specific | Regalia Gold income requirement | Premium threshold vs. typical profile gap |
| 11 | `/cards/sbi-cashback` | Card-specific | SBI Cashback exclusions | Exclusion categories most pages omit |
| 12 | `/guides/credit-card-rejection-reasons` | Informational | why credit card applications are rejected | Maps each reason to the factor Credlytic scores |
| 13 | `/guides/credit-utilization-ratio` | Informational | credit utilization | Worked example of utilization → approval-odds movement |
| 14 | `/guides/credit-card-hard-inquiry` | Informational | hard inquiry impact | Directly supports the "no hard inquiry" promise |
| 15 | `/compare/amazon-pay-icici-vs-axis-ace` | Comparison | head-to-head | Net-value table at defined spend levels |

### PRIORITY 3 — long-term authority

| # | URL | Theme |
|---|---|---|
| 16 | `/guides/how-to-improve-cibil-score` | Credit health, sequenced actions |
| 17 | `/guides/credit-card-income-requirements` | Income thresholds by tier, sourced |
| 18 | `/guides/how-credit-card-approval-works` | Issuer decisioning explained |
| 19 | `/credit-report` | Report analysis intent |
| 20 | `/compare/sbi-cashback-vs-axis-ace` | Second comparison once the first performs |

**Deliberately excluded** — `/best-credit-cards-india` (duplicate intent with `/cards`),
per-salary landing pages (doorway risk, Rule 13), and `/credit-score` as a standalone
page (cannibalises `/guides/how-to-improve-cibil-score`).

---

## Deliverable 3 — first 20, ranked

Ranked by trust weight, differentiation and ability to produce verifiable content —
not assumed volume. Order is the numbering above: trust and legal pages first
because a YMYL site without them will not rank regardless of content quality,
then the eligibility hub, then card pages where Credlytic's value maths is
genuinely differentiated, then guides, then comparisons.

---

## Deliverable 4 — content templates

Each template enforces the same *evidence obligations* while leaving the argument
of every page different. No "Introduction / Benefits / Why choose / Conclusion".

### 1. Individual card page — `/cards/[slug]`
1. Card name, issuer, network, and a one-line verdict stating who it suits
2. At-a-glance: joining fee, annual fee, waiver condition, forex markup
3. **Eligibility** — stated criteria, each attributed: *"According to the currently reviewed issuer information (MITC, reviewed <month>)…"*. Omit anything unverified.
4. **Reward structure** — rates, category multipliers, and every cap
5. **Worked value example** — a named spend profile → annual value → minus fee → net
6. **Trade-offs** — what the card is bad at, in specifics
7. Who it suits / who should avoid it
8. Alternatives and comparisons (internal links)
9. Policy sources + last-reviewed date
10. CTA: check profile match
11. FAQs only where a real question exists

### 2. Comparison — `/compare/[a]-vs-[b]`
1. One-sentence verdict naming the deciding variable
2. Side-by-side table: fees, rewards, caps, lounge, fuel, forex, welcome
3. **Net value at three defined spend profiles** — the differentiator
4. Where each wins, stated as conditions not adjectives
5. Eligibility difference
6. "Best for you depends on…" → CTA to profile match
7. Sources + review date

### 3. Credit education guide — `/guides/[slug]`
1. The question, answered in the first two sentences
2. Mechanism — how the thing actually works
3. Worked numeric example
4. What it means for approval odds specifically
5. What you can change, sequenced by impact
6. Limits of the guidance / what is issuer-specific
7. Links to methodology + relevant cards
8. Review date

### 4. Eligibility guide — `/credit-card-eligibility`
1. What issuers assess and in what order
2. What a soft assessment can and cannot tell you
3. Factor-by-factor, each linked to the improvement action
4. Rejection → what it costs → what to do next
5. Explicit boundary: Credlytic estimate vs. issuer decision
6. CTA into the checker

**Every template requires:** a review date, at least one worked calculation,
at least one stated limitation, source attribution for issuer claims, and a
reason to exist if search did not.
