import type { CardTone } from "@/types/product";
import { policySources, type PolicyAlignment } from "@/data/policy.mock";

export type EligibilityStatus = "Strong match" | "Good match" | "Borderline" | "Improve first" | "Not currently suitable";
export type EligibilityFilter = "all" | "strong" | "good" | "improve";
export type EligibilitySort = "best-fit" | "confidence" | "value";
export type EligibilityMockState = "ready" | "missing-spending" | "incomplete" | "stale" | "loading" | "error";

export type EligibilityFactor = {
  id: string;
  label: string;
  value: string;
  interpretation: string;
  tone: "positive" | "caution" | "context";
};

export type EligibilityCard = {
  id: string;
  rank: number;
  bank: string;
  name: string;
  network: "Visa" | "Mastercard" | "RuPay" | "Amex";
  tone: CardTone;
  confidence: number;
  status: EligibilityStatus;
  estimatedAnnualValue: number | null;
  estimatedLimit: [number, number] | null;
  reason: string;
  bestOptionReason?: string;
  positiveFactors: EligibilityFactor[];
  limitingFactors: EligibilityFactor[];
  policy: PolicyAlignment;
  recommendedAction: {
    title: string;
    explanation: string;
    href: string;
    actionLabel: string;
  };
};

export type EligibilityReadyData = {
  state: "ready";
  assessmentStatus: "current" | "stale" | "refresh-error";
  profileUpdatedLabel: string;
  assessedCards: number;
  worthwhileMatches: number;
  profileStrength: number;
  primaryLimitingFactor: string;
  valueEstimatesAvailable: boolean;
  cards: EligibilityCard[];
};

export type EligibilityIncompleteData = {
  state: "incomplete";
  completedSections: number;
  totalSections: number;
  missingSections: Array<{ label: string; explanation: string }>;
};

export type EligibilityData = EligibilityReadyData | EligibilityIncompleteData | { state: "loading" };

const cards: EligibilityCard[] = [
  {
    id: "amazon-pay-icici",
    rank: 1,
    bank: "ICICI Bank",
    name: "Amazon Pay ICICI",
    network: "Visa",
    tone: "ink",
    confidence: 92,
    status: "Strong match",
    estimatedAnnualValue: 14400,
    estimatedLimit: [90000, 220000],
    reason: "Strong online-spend fit and the current profile clears the known major criteria in this sample assessment.",
    bestOptionReason: "Your income and online-spending profile align well, with no annual fee reducing the cost of ownership.",
    positiveFactors: [
      { id: "payment-history", label: "Payment history", value: "97% on time", interpretation: "Positive", tone: "positive" },
      { id: "income", label: "Income", value: "₹85,000 / month", interpretation: "Supports this card tier", tone: "positive" },
      { id: "inquiries", label: "Recent hard inquiries", value: "0", interpretation: "Positive application window", tone: "positive" }
    ],
    limitingFactors: [
      { id: "utilization", label: "Credit utilization", value: "38%", interpretation: "Worth reducing, but not the main constraint for this match", tone: "caution" }
    ],
    policy: {
      status: "aligned",
      label: "Known major criteria appear aligned",
      summary: "The current profile appears consistent with the major criteria represented in this sample policy context.",
      criteria: [
        { label: "Income context", profileValue: "₹85,000 / month", assessment: "Appears aligned", tone: "positive" },
        { label: "Credit history", profileValue: "5 years 4 months", assessment: "Supportive", tone: "positive" }
      ],
      sources: [policySources.iciciAmazonTerms]
    },
    recommendedAction: { title: "Consider this card first", explanation: "It currently combines the strongest eligibility confidence with useful estimated value and low ownership cost.", href: "/cards/amazon-pay-icici", actionLabel: "Review card details" }
  },
  {
    id: "axis-ace",
    rank: 2,
    bank: "Axis Bank",
    name: "Axis Ace",
    network: "Visa",
    tone: "blue",
    confidence: 84,
    status: "Good match",
    estimatedAnnualValue: 10600,
    estimatedLimit: [110000, 260000],
    reason: "Income and credit history support this card, with dependable value for utilities and everyday spending.",
    positiveFactors: [
      { id: "income", label: "Income", value: "₹85,000 / month", interpretation: "Supports this card tier", tone: "positive" },
      { id: "payment-history", label: "Payment history", value: "97% on time", interpretation: "Positive", tone: "positive" },
      { id: "spending", label: "Utility spending", value: "₹5,000 / month", interpretation: "Supports estimated value", tone: "context" }
    ],
    limitingFactors: [
      { id: "utilization", label: "Credit utilization", value: "38%", interpretation: "Primary adjustable limitation", tone: "caution" }
    ],
    policy: {
      status: "aligned",
      label: "Known major criteria appear aligned",
      summary: "No major conflict is visible in the policy context currently represented by this mock assessment.",
      criteria: [
        { label: "Income context", profileValue: "₹85,000 / month", assessment: "Appears aligned", tone: "positive" },
        { label: "Recent inquiries", profileValue: "0", assessment: "Positive", tone: "positive" }
      ],
      sources: [policySources.axisAceTerms]
    },
    recommendedAction: { title: "Compare against your top match", explanation: "Choose Axis Ace when utility and everyday-spend value matter more than a zero annual fee.", href: "/cards/axis-ace", actionLabel: "Review card details" }
  },
  {
    id: "hdfc-regalia-gold",
    rank: 3,
    bank: "HDFC Bank",
    name: "HDFC Regalia Gold",
    network: "Visa",
    tone: "silver",
    confidence: 67,
    status: "Improve first",
    estimatedAnnualValue: 18600,
    estimatedLimit: [180000, 420000],
    reason: "Travel value is strong, but utilization is currently weakening this premium-card match.",
    positiveFactors: [
      { id: "payment-history", label: "Payment history", value: "97% on time", interpretation: "Positive", tone: "positive" },
      { id: "income", label: "Income", value: "₹85,000 / month", interpretation: "Close to the assessed tier", tone: "context" },
      { id: "inquiries", label: "Recent hard inquiries", value: "0", interpretation: "Positive", tone: "positive" }
    ],
    limitingFactors: [
      { id: "utilization", label: "Credit utilization", value: "38%", interpretation: "Primary limiting factor", tone: "caution" }
    ],
    policy: {
      status: "review",
      label: "Review needed",
      summary: "The profile is close, but the sample policy context does not support treating the major criteria as clearly aligned.",
      criteria: [
        { label: "Income context", profileValue: "₹85,000 / month", assessment: "Close to assessed tier", tone: "caution" },
        { label: "Credit utilization", profileValue: "38%", assessment: "Weakens current position", tone: "caution" }
      ],
      sources: [policySources.hdfcRegaliaTerms]
    },
    recommendedAction: { title: "Lower utilization below 30%", explanation: "This is currently the strongest improvement opportunity for this match. Recheck after the next bureau reporting cycle.", href: "/profile?edit=credit", actionLabel: "See improvement plan" }
  },
  {
    id: "sbi-cashback",
    rank: 4,
    bank: "SBI Card",
    name: "SBI Cashback",
    network: "Mastercard",
    tone: "emerald",
    confidence: 61,
    status: "Borderline",
    estimatedAnnualValue: 11800,
    estimatedLimit: null,
    reason: "Online-spend value is relevant, but current profile signals create a weaker application window.",
    positiveFactors: [
      { id: "spending", label: "Online spending", value: "₹20,000 / month", interpretation: "Strong value fit", tone: "positive" },
      { id: "payment-history", label: "Payment history", value: "97% on time", interpretation: "Positive", tone: "positive" }
    ],
    limitingFactors: [
      { id: "application-window", label: "Application window", value: "Mixed", interpretation: "Wait before making another application", tone: "caution" },
      { id: "utilization", label: "Credit utilization", value: "38%", interpretation: "Weakens this match", tone: "caution" }
    ],
    policy: {
      status: "unknown",
      label: "Limited verified context",
      summary: "The current mock source does not provide enough verified issuer criteria for a stronger policy-alignment statement.",
      criteria: [
        { label: "Available issuer context", profileValue: "Limited", assessment: "Treat cautiously", tone: "context" }
      ],
      sources: [policySources.sbiCashbackTerms]
    },
    recommendedAction: { title: "Strengthen the application window", explanation: "Reduce utilization and avoid a new application until the next profile refresh.", href: "/profile?edit=credit", actionLabel: "See improvement plan" }
  }
];

const ready: EligibilityReadyData = {
  state: "ready",
  assessmentStatus: "current",
  profileUpdatedLabel: "Profile updated today",
  assessedCards: 32,
  worthwhileMatches: 8,
  profileStrength: 89,
  primaryLimitingFactor: "Utilization 38%",
  valueEstimatesAvailable: true,
  cards
};

export const eligibilityMocks: Record<EligibilityMockState, EligibilityData> = {
  ready,
  "missing-spending": { ...ready, valueEstimatesAvailable: false, cards: cards.map((card) => ({ ...card, estimatedAnnualValue: null })) },
  stale: { ...ready, assessmentStatus: "stale", profileUpdatedLabel: "Profile updated after this assessment" },
  error: { ...ready, assessmentStatus: "refresh-error" },
  incomplete: {
    state: "incomplete",
    completedSections: 4,
    totalSections: 6,
    missingSections: [
      { label: "Income", explanation: "Needed to assess which card tiers may fit." },
      { label: "Credit", explanation: "Needed to estimate match confidence responsibly." }
    ]
  },
  loading: { state: "loading" }
};

export function findEligibilityCard(data: EligibilityData, cardId?: string) {
  if (data.state !== "ready") return null;
  return data.cards.find((card) => card.id === cardId) ?? data.cards[0];
}
