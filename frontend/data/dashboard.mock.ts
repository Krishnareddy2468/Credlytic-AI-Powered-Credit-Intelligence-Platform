import type { CardTone, MatchStatus } from "@/types/product";

export type DashboardState = "ready" | "first-time" | "partial" | "loading" | "error";

export type DashboardMatch = {
  id: string;
  rank: number;
  bank: string;
  name: string;
  network: "Visa" | "Mastercard" | "RuPay" | "Amex";
  tone: CardTone;
  confidence: number;
  status: MatchStatus;
  annualValue: number;
  reason: string;
  actionLabel: string;
};

export type DashboardInfluence = {
  id: string;
  label: string;
  value: string;
  effect: string;
  tone: "positive" | "caution" | "context";
};

export type DashboardReadyData = {
  state: "ready";
  asOf: string;
  profile: { strength: number; standing: string; creditScore: number; utilization: number; hardInquiries: number };
  recommendation: { title: string; explanation: string; detail: string; impact: string };
  matches: DashboardMatch[];
  influences: DashboardInfluence[];
  trend: Array<{ month: string; score: number }>;
  changes: string[];
};

export type DashboardIncompleteData = {
  state: "first-time" | "partial";
  completedSections: number;
  totalSections: number;
  title: string;
  description: string;
  availableSignals: Array<{ label: string; value: string }>;
};

export type DashboardData = DashboardReadyData | DashboardIncompleteData | { state: "loading" } | { state: "error"; message: string };

const readyDashboard: DashboardReadyData = {
  state: "ready",
  asOf: "16 Aug 2026",
  profile: { strength: 89, standing: "Good standing", creditScore: 742, utilization: 38, hardInquiries: 0 },
  recommendation: {
    title: "Lower utilization below 30%",
    explanation: "Your current utilization of 38% is the main factor limiting stronger premium-card matches.",
    detail: "Pay approximately ₹12,000 before your next statement cycle.",
    impact: "High impact"
  },
  matches: [
    { id: "amazon-pay-icici", rank: 1, bank: "ICICI Bank", name: "Amazon Pay ICICI", network: "Visa", tone: "ink", confidence: 92, status: "Strong match", annualValue: 14400, reason: "Strong fit for online spending with no annual fee.", actionLabel: "View analysis" },
    { id: "axis-ace", rank: 2, bank: "Axis Bank", name: "Axis Ace", network: "Visa", tone: "blue", confidence: 84, status: "Good match", annualValue: 10600, reason: "Good utility and everyday-spend fit.", actionLabel: "View analysis" },
    { id: "hdfc-regalia-gold", rank: 3, bank: "HDFC Bank", name: "HDFC Regalia Gold", network: "Visa", tone: "silver", confidence: 67, status: "Improve first", annualValue: 18600, reason: "Strong travel value, but utilization currently weakens the match.", actionLabel: "See what to improve" }
  ],
  influences: [
    { id: "payments", label: "Payment history", value: "97% on time", effect: "Positive influence", tone: "positive" },
    { id: "utilization", label: "Credit utilization", value: "38%", effect: "Primary limiting factor", tone: "caution" },
    { id: "inquiries", label: "Hard inquiries", value: "0 recent", effect: "Positive influence", tone: "positive" },
    { id: "income", label: "Income", value: "₹85,000 / month", effect: "Supports current mid-tier matches", tone: "context" }
  ],
  trend: [
    { month: "Mar", score: 685 }, { month: "Apr", score: 701 }, { month: "May", score: 710 },
    { month: "Jun", score: 722 }, { month: "Jul", score: 731 }, { month: "Aug", score: 742 }
  ],
  changes: [
    "Credit score increased by 11 points this month.",
    "Utilization remains your primary improvement opportunity.",
    "Two card matches moved into the strong range."
  ]
};

export const dashboardMocks: Record<DashboardState, DashboardData> = {
  ready: readyDashboard,
  "first-time": { state: "first-time", completedSections: 2, totalSections: 5, title: "Complete your financial profile", description: "Add a few financial signals so Credlytic can begin evaluating card matches.", availableSignals: [] },
  partial: { state: "partial", completedSections: 3, totalSections: 5, title: "Finish the details that affect card matching", description: "Add your current obligations and spending priorities before Credlytic calculates Profile Strength and card matches.", availableSignals: [{ label: "Credit score", value: "742" }, { label: "Credit utilization", value: "38%" }] },
  loading: { state: "loading" },
  error: { state: "error", message: "We could not load your latest credit position." }
};
