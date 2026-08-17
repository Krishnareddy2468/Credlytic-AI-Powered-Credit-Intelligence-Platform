import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Clock3, Info, RefreshCw, ShieldCheck, TrendingUp } from "lucide-react";
import { ProductShell } from "@/components/product-shell";
import { CreditCardVisual, MatchBadge, ProgressBar, SectionHeader, StatusBadge, Surface } from "@/components/product-ui";
import { creditCards } from "@/data/mock-cards";
import { formatINR } from "@/data/mock-user";

export default function EligibilityPage() {
  return (
    <ProductShell
      actions={<Link className="button button-secondary button-app" href="/profile"><RefreshCw />Update profile</Link>}
      eyebrow="Pre-application intelligence"
      subtitle="Understand confidence, value and the factors behind each match before choosing where to apply."
      title="Your eligibility matches"
    >
      <Surface className="eligibility-summary">
        <div className="eligibility-gauge"><div><span>Readiness</span><strong>89%</strong><small>Good standing</small></div></div>
        <div className="eligibility-summary-copy"><StatusBadge tone="success"><ShieldCheck /> No credit-score impact</StatusBadge><h2>You have two strong matches today.</h2><p>Your payment history and income support everyday cashback cards. Lower utilization before considering premium travel cards.</p><div><span><Check /> 2 strong matches</span><span><TrendingUp /> 1 high-value opportunity</span><span><Clock3 /> Recheck in 14 days</span></div></div>
        <div className="eligibility-factor-list"><p className="eyebrow">Main factors</p><div><span>Payment history</span><b className="factor-positive">Strong</b></div><div><span>Income stability</span><b className="factor-positive">Strong</b></div><div><span>Utilization</span><b className="factor-warning">Needs work</b></div><div><span>Recent inquiries</span><b>Neutral</b></div></div>
      </Surface>

      <div className="eligibility-results-head"><SectionHeader description="Ranked for this sample profile. Issuers make the final approval decision." title="Cards worth considering" /><div className="result-legend"><span><i className="legend-strong" />80–100 strong</span><span><i className="legend-good" />65–79 borderline</span><span><i className="legend-watch" />Below 65 improve first</span></div></div>

      <div className="eligibility-card-list">
        {creditCards.map((card, index) => (
          <Surface as="article" className="eligibility-result" key={card.id}>
            <div className="eligibility-rank">{String(index + 1).padStart(2, "0")}</div>
            <div className="eligibility-product"><CreditCardVisual bank={card.bank} name={card.name} network={card.network} tone={card.tone} /><div><span>{card.bank} · {card.network}</span><h2>{card.name}</h2><div className="category-tags">{card.categories.map((category) => <span key={category}>{category}</span>)}</div></div></div>
            <div className="eligibility-confidence"><div><span>Profile match</span><strong>{card.match}%</strong></div><ProgressBar label={`${card.name} profile match`} tone={card.match >= 80 ? "success" : card.match >= 65 ? "warning" : "blue"} value={card.match} /><MatchBadge status={card.status} /><small>Expected limit {formatINR(card.limitRange[0])}–{formatINR(card.limitRange[1])}</small></div>
            <div className="eligibility-reason"><div><span className="reason-icon reason-positive"><Check /></span><div><h3>Why it matches</h3><p>{card.whyItMatches}</p></div></div><div><span className="reason-icon reason-warning"><CircleAlert /></span><div><h3>What improves the match</h3><p>{card.improvement}</p></div></div></div>
            <div className="eligibility-actions"><Link className="button button-secondary button-app" href={`/cards/compare?card=${card.id}`}>Compare card</Link><button className="button button-primary button-app" type="button">Review details<ArrowRight /></button></div>
          </Surface>
        ))}
      </div>
      <div className="eligibility-disclaimer"><Info /><p><strong>What this score means</strong><span>Profile match is an explanatory estimate based on sample information and public product context. It is not a guarantee, pre-approval or bank decision.</span></p></div>
    </ProductShell>
  );
}
