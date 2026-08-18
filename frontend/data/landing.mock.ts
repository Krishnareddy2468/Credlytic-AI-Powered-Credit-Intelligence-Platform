import type { CardTone, MatchStatus } from "@/types/product";

/**
 * Landing-page mock data.
 *
 * Everything the marketing page shows is illustrative sample-profile data.
 * Keep it typed so the eventual API can replace this module without touching JSX.
 */

export interface LandingProofStat {
  value: string;
  label: string;
}

export interface LandingMatchNode {
  id: string;
  bank: string;
  name: string;
  network: "Visa" | "Mastercard" | "RuPay" | "Amex";
  tone: CardTone;
  match: number;
  status: MatchStatus;
  /** Fee shown on the card face — decision-relevant, unlike a masked card number. */
  feeNote: string;
  /** One line explaining the match, used by the eligibility preview. */
  reason: string;
}

export interface LandingIntelligencePillar {
  id: string;
  label: string;
  copy: string;
  /** The user question this pillar actually answers. */
  answers: string;
}

export interface LandingProcessStep {
  number: string;
  title: string;
  copy: string;
}

export interface LandingValueRow {
  id: string;
  name: string;
  bank: string;
  rewardValue: number;
  annualFee: number;
  netValue: number;
  driver: string;
}

export interface LandingReportFactor {
  label: string;
  value: string;
  tone: "positive" | "caution" | "neutral";
  note: string;
}

export const landingProfile = {
  creditScore: 742,
  scoreChange: 11,
  profileStrength: 89,
  standing: "Good standing",
  utilization: 38,
  monthlySpend: 58000,
  limitingFactor: "Utilization",
  recommendedAction: "Lower utilization below 30%",
  recommendedDetail: "Paying ₹12,000 before your next statement date would move utilization to 28% and improve premium-card readiness."
} as const;

export const landingProof: LandingProofStat[] = [
  { value: "34 cards", label: "tracked across 9 Indian issuers" },
  { value: "₹14,400", label: "best annual value found for this sample profile" },
  { value: "0 hard inquiries", label: "added by a Credlytic eligibility check" }
];

export const landingMatches: LandingMatchNode[] = [
  {
    id: "amazon-pay-icici",
    bank: "ICICI",
    name: "Amazon Pay",
    network: "Visa",
    tone: "ink",
    match: 92,
    status: "Strong match",
    feeNote: "No annual fee",
    reason: "Amazon spending and a clean payment history make this the strongest low-risk match."
  },
  {
    id: "axis-ace",
    bank: "Axis",
    name: "Ace",
    network: "Visa",
    tone: "blue",
    match: 84,
    status: "Good match",
    feeNote: "₹499 / year",
    reason: "Recurring utility and dining spend give this card dependable annual value."
  },
  {
    id: "hdfc-regalia-gold",
    bank: "HDFC",
    name: "Regalia Gold",
    network: "Visa",
    tone: "silver",
    match: 67,
    status: "Borderline",
    feeNote: "₹2,500 / year",
    reason: "Travel spend supports the value case, but 38% utilization weakens premium readiness."
  }
];

export const landingIntelligence: LandingIntelligencePillar[] = [
  {
    id: "eligibility",
    label: "Eligibility",
    copy: "Profile-match confidence for every card, with the factors that set it.",
    answers: "Where am I likely to be approved?"
  },
  {
    id: "value",
    label: "Card value",
    copy: "Rewards modelled against your real spending, net of joining and annual fees.",
    answers: "Which card is actually worth more to me?"
  },
  {
    id: "policy",
    label: "Policy intelligence",
    copy: "Issuer criteria explained from traceable policy context with a review date.",
    answers: "What does the bank actually require?"
  },
  {
    id: "guidance",
    label: "Personal guidance",
    copy: "The one change that moves your position most, sequenced before the rest.",
    answers: "What should I do before applying?"
  }
];

export const landingProcess: LandingProcessStep[] = [
  {
    number: "01",
    title: "Build your profile",
    copy: "Share only the financial signals needed for a useful assessment — income, obligations, spending and goals."
  },
  {
    number: "02",
    title: "Read the intelligence",
    copy: "See matches, trade-offs, expected limit ranges and the factors influencing each result."
  },
  {
    number: "03",
    title: "Choose your next move",
    copy: "Apply now, improve one factor first, or wait for a stronger application window."
  }
];

export const landingValueRows: LandingValueRow[] = [
  { id: "amazon-pay-icici", name: "Amazon Pay ICICI", bank: "ICICI Bank", rewardValue: 14400, annualFee: 0, netValue: 14400, driver: "5% back on Amazon" },
  { id: "hdfc-regalia-gold", name: "HDFC Regalia Gold", bank: "HDFC Bank", rewardValue: 18600, annualFee: 2500, netValue: 16100, driver: "Travel redemptions + lounge" },
  { id: "axis-ace", name: "Axis Ace", bank: "Axis Bank", rewardValue: 10600, annualFee: 499, netValue: 10101, driver: "Utility and dining cashback" }
];

export const landingReportFactors: LandingReportFactor[] = [
  { label: "Payment history", value: "100% on time", tone: "positive", note: "48 of 48 instalments paid on schedule." },
  { label: "Credit utilization", value: "38%", tone: "caution", note: "Above the 30% band most issuers prefer for premium cards." },
  { label: "Credit age", value: "6 yr 2 mo", tone: "positive", note: "Oldest account opened June 2020." },
  { label: "Recent inquiries", value: "2 in 6 months", tone: "caution", note: "A third inquiry would weaken near-term approval odds." }
];

export const landingAdvisorExchange = {
  question: "Why is my HDFC Regalia Gold match only 67%?",
  analysis:
    "Your travel spending supports this card's value case, but 38% utilization sits above the range HDFC prefers for premium applications, and you have two bureau inquiries in the last six months.",
  action: "Reduce utilization below 30%, then recheck before applying.",
  actionImpact: "Modelled effect: match moves to roughly 81%.",
  limitation: "Credlytic estimates confidence from published criteria and your profile. The issuer's decision is final and may use data Credlytic cannot see.",
  source: {
    title: "HDFC Bank product terms",
    detail: "Regalia Gold eligibility section · reviewed Aug 2026"
  }
} as const;

export const landingTrustPoints = [
  {
    id: "inquiry",
    title: "No hard inquiry",
    copy: "Credlytic's internal eligibility assessment never requests a bureau inquiry, so checking costs you nothing."
  },
  {
    id: "control",
    title: "Clear data control",
    copy: "Review, export or permanently delete your profile and uploaded reports from settings at any time."
  },
  {
    id: "traceable",
    title: "Traceable context",
    copy: "Every policy claim shows its source document and the date it was last reviewed."
  }
] as const;
