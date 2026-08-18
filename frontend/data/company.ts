/**
 * Company and product facts, sourced from the Credlytic product blueprint and
 * investor brochure (August 2026).
 */

export const company = {
  name: "Credlytic",
  tagline: "Credit analytics, powered by AI.",
  oneLiner: "Know which cards you'll get — before you apply.",
  legalEntity: "SimNex Technologies",
  registration: "MSME Registered",
  domain: "credlytic.in",
  founded: "2026",
  market: "India",
  mission:
    "Eliminate blind credit-card applications in India by giving every consumer access to eligibility intelligence, current issuer policy, and personalised guidance — before they apply.",
  vision: "Become India's most trusted credit intelligence layer."
} as const;

/**
 * Public contact details.
 *
 * Empty fields are not rendered. This is deliberate: a fintech site must never
 * publish an address or inbox that nobody monitors, so unfilled entries
 * disappear rather than shipping a fabricated contact route.
 */
export const contact = {
  email: "contact@credlytic.in",
  press: "",
  phone: "",
  address: "",
  linkedin: ""
} as const;

export interface AboutStat {
  value: string;
  label: string;
  source: string;
}

/** Market figures. Every number carries its source — the same standard the product applies to issuer policy. */
export const marketStats: AboutStat[] = [
  { value: "$20.1B", label: "India credit-card market, 2025", source: "IMARC Group" },
  { value: "$38.3B", label: "Projected market by 2034", source: "IMARC Group" },
  { value: "118M+", label: "Cards in circulation, March 2026", source: "RBI" },
  { value: "25%", label: "Penetration of credit-active consumers", source: "TransUnion CIBIL, 2026" }
];

export const penetrationGap = [
  { market: "India", value: 25 },
  { market: "Colombia", value: 62 },
  { market: "United Kingdom", value: 70 },
  { market: "Hong Kong", value: 98 }
];

export interface AboutProblem {
  number: string;
  title: string;
  copy: string;
}

export const problems: AboutProblem[] = [
  {
    number: "01",
    title: "Blind applications",
    copy: "People apply without knowing their odds. Every rejection leaves a hard inquiry and costs 10–30 CIBIL points, making the next application harder."
  },
  {
    number: "02",
    title: "Credit-report errors",
    copy: "Wrong loan entries, ghost accounts and delayed updates suppress scores quietly, and most people cannot read their own report well enough to spot them."
  },
  {
    number: "03",
    title: "Policy opacity",
    copy: "Income thresholds, fees and reward structures change without notice, buried inside 40-page MITC documents nobody reads."
  },
  {
    number: "04",
    title: "Guidance that isn't neutral",
    copy: "Comparison sites rank by affiliate commission rather than personal fit, so the same list is shown to every visitor."
  },
  {
    number: "05",
    title: "No path forward",
    copy: "After a rejection, people are told to \"improve your credit score\" — which is not a plan, a timeline, or an action."
  }
];

export interface AboutLayer {
  index: string;
  title: string;
  copy: string;
  detail: string;
}

export const layers: AboutLayer[] = [
  {
    index: "Layer 1",
    title: "Eligibility engine",
    copy: "A gradient-boosted ensemble estimates approval confidence, risk tier and an expected limit range across the card set at once.",
    detail: "XGBoost + LightGBM, explained per prediction with SHAP"
  },
  {
    index: "Layer 2",
    title: "Policy retrieval",
    copy: "Issuer criteria are read from the actual source documents, so a policy change propagates by re-ingesting a PDF rather than editing code.",
    detail: "Vector retrieval over MITC, eligibility and RBI documents"
  },
  {
    index: "Layer 3",
    title: "Advisory agents",
    copy: "Specialised agents cover credit analysis, card value, policy compliance and guidance, then reconcile into one accountable answer.",
    detail: "Supervisor-routed agents with cited, traceable output"
  }
];

export interface AboutPhase {
  phase: string;
  window: string;
  title: string;
  points: string[];
  current?: boolean;
}

export const roadmap: AboutPhase[] = [
  {
    phase: "Phase 1",
    window: "2026–2027",
    title: "India launch",
    points: ["20+ issuers, 50+ cards", "Eligibility scoring with per-factor explanations", "Policy retrieval engine", "Hindi and English"],
    current: true
  },
  {
    phase: "Phase 2",
    window: "2027–2028",
    title: "Product expansion",
    points: ["Personal-loan advisory", "Insurance recommendations", "Bureau API integration"]
  },
  {
    phase: "Phase 3",
    window: "2028–2029",
    title: "Regional expansion",
    points: ["Singapore, Malaysia, Indonesia", "Local regulator policy retrieval", "Middle East markets"]
  },
  {
    phase: "Phase 4",
    window: "2029+",
    title: "Global",
    points: ["United States", "United Kingdom and EU", "FICO / VantageScore models"]
  }
];

export interface AboutPrinciple {
  title: string;
  copy: string;
}

export const principles: AboutPrinciple[] = [
  {
    title: "Ranked by fit, never by commission",
    copy: "Results are ordered by approval confidence and what a card is worth against your spending. Commercial arrangements never move a card up the list."
  },
  {
    title: "Every claim carries its source",
    copy: "Statements about issuer criteria cite the document they came from and the date it was reviewed, so you can check the reasoning rather than trust it."
  },
  {
    title: "Checking costs you nothing",
    copy: "Assessing eligibility with Credlytic does not request a bureau inquiry and does not affect your credit score."
  },
  {
    title: "We do not promise approval",
    copy: "Credlytic estimates confidence from published criteria and the profile you provide. The issuer decides, and may use data we cannot see."
  }
];
