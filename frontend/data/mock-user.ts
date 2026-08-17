import type { CreditInsight, ProfileSection } from "@/types/product";

export const mockUser = {
  name: "Meera Shah",
  firstName: "Meera",
  initials: "MS",
  city: "Mumbai",
  age: 32,
  employment: "Salaried",
  role: "Product manager",
  monthlyIncome: 85000,
  additionalIncome: 12000,
  creditScore: 742,
  utilization: 38,
  paymentHealth: 97,
  historyYears: 6.4,
  activeCards: 3,
  recentInquiries: 2,
  activeLoans: 1,
  emiAmount: 18500,
  outstandingBalance: 74000,
  profileStrength: 86
};

export const profileSections: ProfileSection[] = [
  { id: "personal", label: "Personal", description: "Identity, city and employment", complete: true },
  { id: "income", label: "Income", description: "Salary and additional income", complete: true },
  { id: "credit", label: "Credit", description: "Score, history and utilization", complete: true },
  { id: "obligations", label: "Obligations", description: "Loans, EMIs and balances", complete: true },
  { id: "spending", label: "Spending", description: "Monthly category pattern", complete: false },
  { id: "goals", label: "Goals", description: "What your next card should do", complete: true }
];

export const creditTrend = [
  { month: "Mar", score: 688 },
  { month: "Apr", score: 704 },
  { month: "May", score: 713 },
  { month: "Jun", score: 724 },
  { month: "Jul", score: 735 },
  { month: "Aug", score: 742 }
];

export const spending = [
  { category: "Shopping", amount: 20000 },
  { category: "Travel", amount: 14000 },
  { category: "Dining", amount: 9000 },
  { category: "Utilities", amount: 8500 },
  { category: "Fuel", amount: 6500 }
];

export const creditInsights: CreditInsight[] = [
  {
    id: "utilization",
    level: "attention",
    title: "Utilization is limiting premium-card access",
    description: "Your 38% utilization is healthy enough for everyday cards but above the preferred premium range.",
    action: "Pay down ₹12,000 before the next statement"
  },
  {
    id: "history",
    level: "positive",
    title: "Payment history is a strong signal",
    description: "A 97% on-time payment rate supports high-confidence matches with established issuers.",
    action: "Keep all upcoming payments on time"
  },
  {
    id: "inquiries",
    level: "neutral",
    title: "Give recent inquiries time to age",
    description: "Two recent applications are still visible. A short pause can improve confidence on borderline cards.",
    action: "Avoid new applications for 60 days"
  }
];

export const roadmap = [
  { title: "Lower utilization", detail: "Pay ₹12,000 toward revolving balances", timing: "Before 28 Aug", impact: "+8 readiness" },
  { title: "Protect inquiry history", detail: "Pause new applications while inquiries age", timing: "Next 60 days", impact: "+5 readiness" },
  { title: "Recheck premium cards", detail: "Review HDFC and Axis premium eligibility", timing: "After bureau refresh", impact: "Better limits" }
];

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export function formatCompactINR(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return formatINR(value);
}
