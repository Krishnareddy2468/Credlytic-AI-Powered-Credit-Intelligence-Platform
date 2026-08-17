# Credlytic -- Problem Statement and Use Cases

Version 1.0 | August 2026 | Confidential

---

## 1. The problem

India has 118+ million credit cards in circulation (March 2026, RBI) but the experience of acquiring, choosing, and optimizing a credit card remains fundamentally broken. The information asymmetry between banks and consumers creates five interconnected problems that no existing platform solves together.

---

## 2. Problem breakdown

### Problem 1: Blind applications

Users apply for credit cards without knowing their approval probability. Each rejection deposits a hard inquiry on their credit report, reducing their CIBIL score by 10-30 points. This makes subsequent applications even less likely to succeed, creating a rejection spiral.

Real case: A user in Pune with Rs 48,000 salary and 618 CIBIL score applied to HDFC, ICICI, SBI, and Axis Bank within 8 months. All four rejected him with the same vague message: "Not eligible based on internal credit assessment." Each rejection further damaged his score.

Banks compound this problem by pushing their easiest-to-approve card (HDFC MoneyBack) rather than the best-fit card for the user's spending pattern (Axis Ace at 2% cashback). The difference costs users Rs 3,000-8,000 per year in missed rewards on identical spending.

**What Credlytic solves:** Pre-application eligibility prediction across 30+ cards simultaneously, ranked by approval probability and personal fit. Users never apply blind again.

### Problem 2: CIBIL report errors

Wrong loan entries, delayed EMI updates, ghost accounts from closed loans, and incorrect DPD (Days Past Due) marks silently destroy credit scores. RBI's own grievance channels have seen steady growth in such complaints. Before 2026 rule changes, correcting an error could take months.

Real case: A user found a fake loan account from Shriram Finance on his credit report -- a loan he never took. It blocked every credit card application. His score sat at 568 until the entry was removed, after which it recovered to 762.

Users cannot read their own credit reports. They do not know which factors are hurting them, which entries are errors, or how to dispute incorrect information.

**What Credlytic solves:** AI-powered credit report analysis that identifies errors, explains each factor's impact, and generates dispute guidance based on RBI's regulatory framework.

### Problem 3: Policy opacity

Bank card policies change constantly. Income requirements shift. Annual fees get revised. Reward structures are restructured. Lounge access becomes conditional on quarterly spending. SBI revised cashback policies from April 2026. HDFC changed Regalia lounge access rules. No single source tracks all these changes across all banks.

A card that required Rs 50,000 monthly income last month might require Rs 75,000 now. A user who qualifies today might not qualify next month -- and vice versa.

**What Credlytic solves:** RAG engine over 20+ real bank policy documents that stays current. When HDFC updates Regalia terms, a single PDF update propagates through the entire system. Responses are grounded in actual policy text, not outdated blog content.

### Problem 4: No personalized guidance

"Which credit card should I get?" is the most common question on Indian finance forums. The answer depends on spending patterns, income, existing cards, credit score, location, employment type, and financial goals. Static blog articles and affiliate-driven comparison sites cannot answer this question for an individual user.

Comparison platforms like Paisabazaar rank cards by affiliate commission, not personal fit. A user spending Rs 15,000/month on Amazon sees the same generic "top 10 cards" list as a user spending Rs 50,000/month on travel.

**What Credlytic solves:** Multi-agent AI system that considers the user's complete financial profile, matches against card benefits database, validates against current bank policies, and generates personally ranked recommendations with ROI calculations.

### Problem 5: No improvement roadmap

When a user is rejected or has a low approval probability, existing platforms offer no actionable recovery path. "Improve your credit score" is not a plan.

Users need specific, time-bound guidance: "Reduce credit utilization from 68% to 30% by paying Rs 12,000 extra toward your ICICI card over the next 2 months. Close your unused store card. Wait for one CIBIL reporting cycle. Then reapply for Axis Ace -- your projected approval probability will be 84%."

**What Credlytic solves:** Financial advisor agent that synthesizes ML predictions, policy requirements, and credit report analysis into a concrete improvement plan with timelines and milestones.

---

## 3. User personas

### Persona 1: First-time applicant (Priya, 24)

**Profile:** Software developer, Rs 45,000/month, no credit history, CIBIL score NH (No History)
**Pain point:** Wants a credit card but has no idea which one to apply for. Afraid of rejection. Does not know her eligibility. Bank websites show 20+ cards with no personalization.
**Credlytic value:** Instant eligibility assessment shows she qualifies for entry-level secured cards and 2 unsecured cards with 70%+ probability. Advisor suggests building 6 months of credit history through a secured card to unlock premium options.

### Persona 2: Rejected applicant (Rahul, 28)

**Profile:** Marketing executive, Rs 60,000/month, CIBIL 680, rejected by HDFC and ICICI in the past 3 months
**Pain point:** Does not understand why he was rejected. Each application hurt his score further. Frustrated and considering giving up.
**Credlytic value:** SHAP analysis reveals credit utilization at 72% is the primary rejection factor, not income. Advisor generates a 3-month plan to reduce utilization below 30%, identifies 4 cards he currently qualifies for, and projects when premium cards become accessible.

### Persona 3: Reward optimizer (Meera, 32)

**Profile:** Product manager, Rs 1.2 lakh/month, CIBIL 780, holds 2 cards, spends Rs 60,000/month on Amazon, Swiggy, and travel
**Pain point:** Knows she is not maximizing rewards but cannot compare 50+ cards against her specific spending pattern. Blog articles give generic advice.
**Credlytic value:** Card agent calculates that switching from her current SBI SimplyCLICK to Amazon Pay ICICI saves Rs 14,400/year on Amazon alone. Adding HDFC Regalia covers her travel needs. Total annual savings: Rs 22,000 with the right 2-card portfolio.

### Persona 4: Credit rebuilder (Arjun, 35)

**Profile:** Small business owner, Rs 80,000/month, CIBIL 590, had a loan default 2 years ago
**Pain point:** Needs credit card access for business expenses but previous default keeps triggering rejections. Does not know when his score will recover or which cards accept his current profile.
**Credlytic value:** Credit report analyzer identifies the settled default and its declining impact over time. Advisor shows that after 12 more months of clean history, his projected score reaches 680+ and 3 specific cards become accessible. In the meantime, recommends a secured card from Kotak to start rebuilding.

---

## 4. Use case flows

### Use case 1: Pre-application eligibility check

1. User enters financial profile (income, employment, credit score range, existing obligations)
2. ML engine runs eligibility prediction across 30+ cards
3. Dashboard displays ranked cards with probability scores and SHAP explanations
4. User taps any card for detailed policy-grounded eligibility analysis (RAG retrieval)
5. User applies through Credlytic's referral link (affiliate revenue) or saves for later

### Use case 2: Conversational credit advisor

1. User asks: "Am I eligible for HDFC Regalia?"
2. Supervisor agent routes to policy compliance agent + credit analysis agent
3. Policy agent retrieves HDFC Regalia MITC and eligibility criteria from vector store
4. Credit agent evaluates user profile against requirements
5. Advisor agent synthesizes: "HDFC Regalia requires Rs 1 lakh monthly income. Your current income is Rs 85,000. You are Rs 15,000 short. Based on your salary growth trajectory, you may qualify in approximately 6 months. In the meantime, HDFC Millennia is accessible at 89% probability."

### Use case 3: Credit report analysis

1. User uploads CIBIL/Experian credit report PDF
2. Vision model + LLM extraction pipeline parses document
3. System identifies: score, active loans, EMI amounts, utilization per card, payment history, potential errors
4. Dashboard displays health overview with prioritized actions
5. If errors detected, system generates dispute guidance with RBI regulatory references

### Use case 4: Card recommendation by spending pattern

1. User inputs monthly spending breakdown (categories: online shopping, groceries, fuel, dining, travel, bills)
2. Card agent searches benefits database, calculates annual reward value per card against user's actual spending
3. Recommendation shows: "Based on your Rs 20,000/month Amazon spend, the Amazon Pay ICICI card returns Rs 12,000/year in cashback. No annual fee. 92% approval probability for your profile."

### Use case 5: Improvement plan generation

1. User receives low eligibility score for a desired premium card
2. Advisor agent analyzes the gap between current profile and card requirements
3. Generates time-bound action plan:
   - Month 1-2: Reduce credit utilization from 65% to 30% (specific payment amounts per card)
   - Month 3: Close unused store card to improve credit mix
   - Month 4: Wait for CIBIL update cycle to reflect changes
   - Month 5: Projected eligibility probability increases to 78%
4. User receives milestone notifications as they progress

---

## 5. Before and after

### Before Credlytic

- User searches "best credit card India 2026"
- Reads 5 blog articles with conflicting advice, all affiliate-driven
- Picks a card based on banner ads or generic ranking
- Applies without knowing eligibility
- Rejected. Score drops. Applies to another bank. Rejected again.
- Gives up or settles for a suboptimal card pushed by their existing bank
- Loses Rs 5,000-15,000/year in missed rewards
- Has no idea what to fix or when to reapply

### After Credlytic

- User enters profile once
- Sees 30+ cards ranked by personal approval probability with explanations
- Knows exactly why certain cards are not accessible and what to fix
- Applies only for cards with 80%+ probability, through Credlytic's referral link
- Gets approved on first attempt. Score preserved.
- Maximizes rewards based on actual spending patterns
- Receives notifications when new cards become accessible
- Has a concrete roadmap to unlock premium cards over time
