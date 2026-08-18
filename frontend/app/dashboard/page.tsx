import { DashboardExperience } from "@/components/dashboard-experience";
import { ProductShell } from "@/components/product-shell";
import { dashboardMocks, type DashboardState } from "@/data/dashboard.mock";

const availableStates = new Set<DashboardState>(["ready", "first-time", "partial", "loading", "error"]);

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const params = await searchParams;
  const requestedState = params.state as DashboardState | undefined;
  const state = requestedState && availableStates.has(requestedState) ? requestedState : "ready";

  return (
    <ProductShell compactHeader subtitle="Your credit position and next best actions." title="Dashboard">
      <DashboardExperience data={dashboardMocks[state]} />
    </ProductShell>
  );
}
