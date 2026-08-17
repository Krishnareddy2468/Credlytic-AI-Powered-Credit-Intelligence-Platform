import { ArrowRight, BarChart3, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { StatusPill } from "@/components/status-pill";

async function getApiStatus() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
    const response = await fetch(`${baseUrl}/api/v1/health`, {
      cache: "no-store"
    });
    return response.ok;
  } catch {
    return false;
  }
}

const cards = [
  { bank: "HDFC", name: "Regalia Gold", probability: 84, fit: "Travel" },
  { bank: "ICICI", name: "Amazon Pay", probability: 91, fit: "Cashback" },
  { bank: "Axis", name: "Ace", probability: 78, fit: "Utilities" }
];

export default async function Home() {
  const apiHealthy = await getApiStatus();

  return (
    <main className="min-h-screen bg-mist">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6">
        <header className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-ink text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Credlytic</h1>
              <p className="text-sm text-slate-500">Credit analytics, powered by AI</p>
            </div>
          </div>
          <StatusPill healthy={apiHealthy} />
        </header>

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-signal">Eligibility intelligence</p>
            <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-normal text-ink md:text-5xl">
              Know which cards you can get before you apply.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Rank Indian credit cards by approval probability, personal reward fit, and policy constraints without a hard CIBIL inquiry.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex h-11 items-center gap-2 rounded bg-signal px-4 text-sm font-semibold text-white">
                Start profile
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex h-11 items-center gap-2 rounded border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800">
                View cards
              </button>
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Eligibility snapshot</h3>
                <p className="text-sm text-slate-500">Seeded from backend card data</p>
              </div>
              <BarChart3 className="h-5 w-5 text-signal" />
            </div>
            <div className="space-y-3">
              {cards.map((card) => (
                <div key={card.name} className="rounded border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{card.bank} {card.name}</p>
                      <p className="text-xs text-slate-500">{card.fit} fit</p>
                    </div>
                    <span className="text-sm font-semibold text-mint">{card.probability}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded bg-slate-100">
                    <div className="h-2 rounded bg-mint" style={{ width: `${card.probability}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-slate-200 p-3">
                <ShieldCheck className="mb-2 h-5 w-5 text-mint" />
                <p className="text-sm font-semibold">Zero hard inquiry</p>
                <p className="text-xs leading-5 text-slate-500">Profile-based estimates before bank application.</p>
              </div>
              <div className="rounded border border-slate-200 p-3">
                <Sparkles className="mb-2 h-5 w-5 text-coral" />
                <p className="text-sm font-semibold">Explainable ranking</p>
                <p className="text-xs leading-5 text-slate-500">Built for ML, RAG, and agent guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
