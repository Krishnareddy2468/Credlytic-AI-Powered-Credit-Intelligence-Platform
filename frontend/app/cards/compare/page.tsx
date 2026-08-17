import Link from "next/link";
import { ArrowLeft, Check, Minus, ShieldCheck, Sparkles } from "lucide-react";
import { ProductShell } from "@/components/product-shell";
import { CreditCardVisual, MatchBadge, StatusBadge, Surface } from "@/components/product-ui";
import { creditCards } from "@/data/mock-cards";
import { formatINR } from "@/data/mock-user";

const compared = creditCards.slice(0, 3);

export default function ComparePage() {
  const rows = [
    { label: "Annual fee", values: compared.map((card) => card.annualFee === 0 ? "No annual fee" : formatINR(card.annualFee)) },
    { label: "Joining fee", values: compared.map((card) => card.joiningFee === 0 ? "No joining fee" : formatINR(card.joiningFee)) },
    { label: "Estimated annual value", values: compared.map((card) => formatINR(card.estimatedAnnualValue)), emphasis: true },
    { label: "Cashback / rewards", values: compared.map((card) => card.cashback) },
    { label: "Lounge access", values: compared.map((card) => card.lounge) },
    { label: "Fuel benefit", values: compared.map((card) => card.fuel) },
    { label: "Foreign markup", values: compared.map((card) => card.foreignMarkup) },
    { label: "Welcome benefit", values: compared.map((card) => card.welcomeBenefit) }
  ];

  return (
    <ProductShell
      actions={<Link className="button button-secondary button-app" href="/cards"><ArrowLeft />Back to cards</Link>}
      eyebrow="Side-by-side analysis"
      subtitle="Compare cost, value and personal fit without reducing the decision to a generic winner."
      title="Compare cards"
    >
      <div className="comparison-note"><Sparkles /><p><strong>Best for your current profile</strong><span>Amazon Pay ICICI offers the strongest combination of confidence, useful value and no annual fee. Axis Ace becomes competitive if utilities remain a major category.</span></p></div>

      <Surface className="comparison-surface">
        <div className="comparison-grid comparison-products">
          <div className="comparison-label"><span>Comparing</span><strong>{compared.length} products</strong><small>Sample profile · Aug 2026</small></div>
          {compared.map((card, index) => <article key={card.id}>{index === 0 ? <StatusBadge tone="success"><ShieldCheck /> Best for you</StatusBadge> : <MatchBadge status={card.status} />}<CreditCardVisual bank={card.bank} compact name={card.name} network={card.network} tone={card.tone} /><span>{card.bank}</span><h2>{card.name}</h2><div className="comparison-fit"><strong>{card.match}%</strong><span>profile fit</span></div></article>)}
        </div>

        <div className="comparison-table">
          {rows.map((row) => <div className={`comparison-grid comparison-row ${row.emphasis ? "comparison-row-emphasis" : ""}`} key={row.label}><strong>{row.label}</strong>{row.values.map((value, index) => <span data-label={compared[index].name} key={`${row.label}-${compared[index].id}`}>{value}</span>)}</div>)}
        </div>

        <div className="comparison-details">
          <div className="comparison-detail-label"><strong>Trade-offs</strong><span>The important differences for you</span></div>
          {compared.map((card) => <div key={card.id}><h3>Strengths</h3>{card.strengths.slice(0, 2).map((item) => <p className="comparison-positive" key={item}><Check />{item}</p>)}<h3>Consider</h3>{card.watchouts.slice(0, 2).map((item) => <p key={item}><Minus />{item}</p>)}</div>)}
        </div>

        <div className="comparison-grid comparison-actions"><span /><div><button className="button button-primary button-app" type="button">Review recommendation</button></div><div><button className="button button-secondary button-app" type="button">View details</button></div><div><button className="button button-secondary button-app" type="button">Improve match first</button></div></div>
      </Surface>

      <p className="product-disclaimer"><ShieldCheck /> Comparisons use prototype values and public product information. Verify current issuer terms before applying.</p>
    </ProductShell>
  );
}
