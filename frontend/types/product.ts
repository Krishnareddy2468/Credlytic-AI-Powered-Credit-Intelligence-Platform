export type MatchStatus = "Strong match" | "Good match" | "Borderline" | "Improve first";

export type CardTone = "ink" | "blue" | "emerald" | "silver";

export interface CreditCardProduct {
  id: string;
  bank: string;
  name: string;
  network: "Visa" | "Mastercard" | "RuPay" | "Amex";
  annualFee: number;
  joiningFee: number;
  estimatedAnnualValue: number;
  match: number;
  status: MatchStatus;
  tone: CardTone;
  categories: string[];
  strengths: string[];
  watchouts: string[];
  whyItMatches: string;
  improvement: string;
  limitRange: [number, number];
  cashback: string;
  lounge: string;
  fuel: string;
  foreignMarkup: string;
  welcomeBenefit: string;
}

export interface ProfileSection {
  id: "personal" | "income" | "credit" | "obligations" | "spending" | "goals";
  label: string;
  description: string;
  complete: boolean;
}

export interface CreditInsight {
  id: string;
  level: "positive" | "attention" | "neutral";
  title: string;
  description: string;
  action: string;
}

export interface ReportFactor {
  label: string;
  value: string;
  status: "Healthy" | "Review" | "Needs action";
  detail: string;
}

export interface AdvisorSource {
  title: string;
  publisher: string;
  updated: string;
  excerpt: string;
}
