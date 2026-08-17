"use client";

import Link from "next/link";
import { ArrowRight, CircleDollarSign, Clock3, Gauge, ShieldCheck, Sparkles, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ProductShell } from "@/components/product-shell";
import { CreditCardVisual, InsightIcon, MatchBadge, MetricCard, ProgressBar, SectionHeader, Surface } from "@/components/product-ui";
import { creditCards } from "@/data/mock-cards";
import { creditInsights, creditTrend, formatINR, mockUser } from "@/data/mock-user";

export default function DashboardPage() {
  return (
    <ProductShell
      actions={<Link className="button button-primary button-app" href="/eligibility">Check eligibility<ArrowRight /></Link>}
      eyebrow="Your credit position"
      subtitle="The signals shaping your card access and the most useful action to take next."
      title={`Good evening, ${mockUser.firstName}`}
    >
      <div className="dashboard-grid">
        <Surface className="score-overview">
          <div className="score-ring" style={{ "--score-progress": "82%" } as React.CSSProperties}>
            <div><span>Credit score</span><strong>{mockUser.creditScore}</strong><small>Good</small></div>
          </div>
          <div className="score-copy">
            <span className="positive-change">+11 points this month</span>
            <h2>Your profile is moving in the right direction.</h2>
            <p>Payment history is strong. Utilization is the clearest opportunity to improve premium-card access.</p>
            <div className="score-meta"><span><b>Updated</b> 16 Aug 2026</span><span><b>Next refresh</b> 14 days</span></div>
          </div>
        </Surface>

        <Surface className="next-action-panel">
          <div className="action-panel-icon"><TrendingDown /></div>
          <p className="eyebrow">Recommended next action</p>
          <h2>Bring utilization below 30%</h2>
          <p>Pay approximately <strong>₹12,000</strong> before the next statement to strengthen premium-card readiness.</p>
          <div className="action-impact"><span>Potential readiness</span><b>89% → 97%</b></div>
          <Link className="text-action" href="/profile">Review balances<ArrowRight /></Link>
        </Surface>
      </div>

      <div className="metric-grid">
        <MetricCard detail="8 points above preferred range" icon={Gauge} label="Utilization" trend="Action" value={`${mockUser.utilization}%`} />
        <MetricCard detail="No missed payment in 18 months" icon={ShieldCheck} label="Payment health" trend="Strong" value={`${mockUser.paymentHealth}%`} />
        <MetricCard detail="Across 3 active cards" icon={CircleDollarSign} label="Monthly income" value={formatINR(mockUser.monthlyIncome)} />
        <MetricCard detail="Two inquiries still visible" icon={Clock3} label="Recent inquiries" trend="Watch" value={`${mockUser.recentInquiries}`} />
      </div>

      <div className="content-grid-main">
        <Surface className="recommendations-panel">
          <SectionHeader action={<Link className="text-action" href="/eligibility">View all matches<ArrowRight /></Link>} description="A short list ranked by approval confidence and personal value." title="Best current matches" />
          <div className="recommendation-list">
            {creditCards.slice(0, 3).map((card) => (
              <article className="recommendation-row" key={card.id}>
                <CreditCardVisual bank={card.bank} compact name={card.name} network={card.network} tone={card.tone} />
                <div className="recommendation-name"><span>{card.bank}</span><h3>{card.name}</h3><p>{card.categories.slice(0, 2).join(" · ")}</p></div>
                <div className="match-cell"><span><b>{card.match}%</b> profile match</span><ProgressBar label={`${card.name} match`} tone={card.match > 80 ? "success" : "warning"} value={card.match} /></div>
                <div className="value-cell"><span>Est. annual value</span><strong>{formatINR(card.estimatedAnnualValue)}</strong></div>
                <MatchBadge status={card.status} />
              </article>
            ))}
          </div>
        </Surface>

        <Surface className="trend-panel">
          <SectionHeader description="Six-month bureau score movement." title="Credit trend" />
          <div className="chart-frame">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={creditTrend} margin={{ bottom: 0, left: -24, right: 8, top: 12 }}>
                <defs><linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#32b8ff" stopOpacity={0.34} /><stop offset="100%" stopColor="#32b8ff" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                <XAxis axisLine={false} dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} tickLine={false} />
                <YAxis axisLine={false} domain={[660, 770]} tick={{ fill: "var(--text-muted)", fontSize: 12 }} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0c1729", border: "1px solid #24344d", borderRadius: 8 }} />
                <Area dataKey="score" fill="url(#scoreFill)" stroke="#32b8ff" strokeWidth={2.5} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Surface>
      </div>

      <Surface className="insights-panel">
        <SectionHeader description="What the current profile signals mean in practical terms." title="Credit intelligence" />
        <div className="insight-grid">
          {creditInsights.map((insight) => (
            <article key={insight.id}><InsightIcon level={insight.level} /><div><h3>{insight.title}</h3><p>{insight.description}</p><Link href="/profile">{insight.action}<ArrowRight /></Link></div></article>
          ))}
        </div>
      </Surface>
      <p className="product-disclaimer"><Sparkles /> This workspace uses realistic sample data for frontend evaluation. It is not a live credit assessment.</p>
    </ProductShell>
  );
}
