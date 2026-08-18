export type PolicyAlignmentStatus = "aligned" | "review" | "unknown";

export type PolicySource = {
  id: string;
  issuer: string;
  documentTitle: string;
  relevantSection: string;
  reviewedAt: string;
  sourceLabel: string;
  sourceUrl: string;
  excerpt: string;
  isDemo: true;
};

export type PolicyCriterion = {
  label: string;
  profileValue: string;
  assessment: string;
  tone: "positive" | "caution" | "context";
};

export type PolicyAlignment = {
  status: PolicyAlignmentStatus;
  label: string;
  summary: string;
  criteria: PolicyCriterion[];
  sources: PolicySource[];
};

export const policySources: Record<string, PolicySource> = {
  iciciAmazonTerms: {
    id: "icici-amazon-terms",
    issuer: "ICICI Bank",
    documentTitle: "Amazon Pay ICICI Card product terms",
    relevantSection: "Eligibility and application review",
    reviewedAt: "Aug 2026",
    sourceLabel: "Sample product-terms context",
    sourceUrl: "#sample-policy-source",
    excerpt: "Sample frontend context only. Verified issuer wording will replace this excerpt when policy ingestion is connected.",
    isDemo: true
  },
  axisAceTerms: {
    id: "axis-ace-terms",
    issuer: "Axis Bank",
    documentTitle: "Axis Ace product terms",
    relevantSection: "Application eligibility",
    reviewedAt: "Aug 2026",
    sourceLabel: "Sample product-terms context",
    sourceUrl: "#sample-policy-source",
    excerpt: "Sample frontend context only. No official income threshold is asserted in this mock assessment.",
    isDemo: true
  },
  hdfcRegaliaTerms: {
    id: "hdfc-regalia-terms",
    issuer: "HDFC Bank",
    documentTitle: "Regalia Gold product terms",
    relevantSection: "Application and issuer review",
    reviewedAt: "Aug 2026",
    sourceLabel: "Sample product-terms context",
    sourceUrl: "#sample-policy-source",
    excerpt: "Sample frontend context only. The live product will display a verified relevant section from current issuer materials.",
    isDemo: true
  },
  sbiCashbackTerms: {
    id: "sbi-cashback-terms",
    issuer: "SBI Card",
    documentTitle: "Cashback SBI Card product terms",
    relevantSection: "Application assessment",
    reviewedAt: "Aug 2026",
    sourceLabel: "Sample product-terms context",
    sourceUrl: "#sample-policy-source",
    excerpt: "Sample frontend context only. Issuer-specific application criteria are not represented as confirmed requirements here.",
    isDemo: true
  }
};
