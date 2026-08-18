export type ProfileSectionId = "personal" | "income" | "credit" | "obligations" | "spending" | "goals";
export type ProfileMockState = "complete" | "partial" | "missing-credit" | "missing-spending" | "validation-error" | "save-failure";
export type CardGoal = "Cashback" | "Travel" | "Fuel" | "Dining" | "Rewards" | "Premium lifestyle";

export type FinancialProfile = {
  completion: number;
  completedSections: number;
  totalSections: number;
  updatedLabel: string;
  personal: { age: number; city: string; employment: string; employer: string };
  income: { monthlyGross: number; additionalMonthly: number; additionalIncomeType: string };
  credit: { score: number | null; source: "Self-reported" | "From uploaded report"; historyYears: number; historyMonths: number; paymentHistory: number; utilization: number };
  obligations: { activeLoans: number; monthlyEmi: number; cardsHeld: number; outstandingBalance: number };
  spending: null | { onlineShopping: number; groceries: number; fuel: number; dining: number; travel: number; utilities: number; entertainment: number; other: number };
  goals: { primary: CardGoal; secondary: CardGoal };
};

export const profileSectionMeta: Array<{ id: ProfileSectionId; label: string; summary: string }> = [
  { id: "personal", label: "Personal", summary: "Age, city and employment" },
  { id: "income", label: "Income", summary: "Monthly gross and additional income" },
  { id: "credit", label: "Credit", summary: "Score, history and utilization" },
  { id: "obligations", label: "Obligations", summary: "Loans, EMIs and card balances" },
  { id: "spending", label: "Spending", summary: "Monthly category preferences" },
  { id: "goals", label: "Primary goal", summary: "How card value is prioritized" }
];

const completeProfile: FinancialProfile = {
  completion: 100,
  completedSections: 6,
  totalSections: 6,
  updatedLabel: "Updated today",
  personal: { age: 32, city: "Mumbai", employment: "Salaried", employer: "Product Manager · Example Technologies" },
  income: { monthlyGross: 85000, additionalMonthly: 0, additionalIncomeType: "None" },
  credit: { score: 742, source: "Self-reported", historyYears: 5, historyMonths: 4, paymentHistory: 97, utilization: 38 },
  obligations: { activeLoans: 2, monthlyEmi: 18500, cardsHeld: 2, outstandingBalance: 42000 },
  spending: { onlineShopping: 20000, groceries: 8000, fuel: 4000, dining: 6000, travel: 10000, utilities: 5000, entertainment: 3000, other: 2000 },
  goals: { primary: "Cashback", secondary: "Travel" }
};

function withMissingSpending(): FinancialProfile {
  return { ...completeProfile, completion: 86, completedSections: 5, spending: null };
}

export const profileMocks: Record<ProfileMockState, FinancialProfile> = {
  complete: completeProfile,
  partial: withMissingSpending(),
  "missing-spending": withMissingSpending(),
  "missing-credit": { ...completeProfile, completion: 86, completedSections: 5, credit: { ...completeProfile.credit, score: null } },
  "validation-error": completeProfile,
  "save-failure": completeProfile
};
