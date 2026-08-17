import type { ReportFactor } from "@/types/product";

export const reportFactors: ReportFactor[] = [
  { label: "Payment health", value: "97%", status: "Healthy", detail: "No missed payment reported in the last 18 months." },
  { label: "Credit utilization", value: "38%", status: "Needs action", detail: "Lowering balances below 30% may improve premium-card readiness." },
  { label: "Active accounts", value: "4", status: "Healthy", detail: "Three cards and one personal loan are currently active." },
  { label: "Duplicate entry", value: "1 found", status: "Review", detail: "A closed consumer loan may still be reported as active." }
];

export const reportSteps = ["Upload", "Processing", "Analysis", "Insights", "Actions"];
