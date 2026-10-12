import { EligibilityPageExperience, LiveEligibilityExperience } from "@/components/eligibility-experience";
import { eligibilityMocks, type EligibilityMockState } from "@/data/eligibility.mock";
import "./eligibility.css";

const availableStates = new Set<EligibilityMockState>(["ready", "missing-spending", "incomplete", "stale", "loading", "error"]);

export default async function EligibilityPage({ searchParams }: { searchParams: Promise<{ state?: string; card?: string }> }) {
  const params = await searchParams;
  const requestedState = params.state as EligibilityMockState | undefined;
  const state = requestedState && availableStates.has(requestedState) ? requestedState : null;

  return state ? <EligibilityPageExperience data={eligibilityMocks[state]} initialSelectedId={params.card} /> : <LiveEligibilityExperience initialSelectedId={params.card} />;
}
