"use client";

import Link from "next/link";
import { ArrowRight, Check, CircleAlert, IndianRupee, Minus, RefreshCw, ShieldCheck, TrendingDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CreditCardVisual, MatchBadge, ProgressBar, SectionHeader, Surface } from "@/components/product-ui";
import type { DashboardData, DashboardInfluence, DashboardReadyData } from "@/data/dashboard.mock";

const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0, style: "currency", currency: "INR" }).format(value);

function PositionWorkspace({ data }: { data: DashboardReadyData }) {
  return (
    <Surface className="credit-position-workspace">
      <section className="credit-position-summary" aria-labelledby="credit-position-title">
        <div className="dashboard-section-label"><span />Current position</div>
        <div className="profile-strength-line">
          <div><p>Profile Strength</p><strong>{data.profile.strength}<small>/100</small></strong></div>
          <span className="dashboard-standing"><Check aria-hidden="true" />{data.profile.standing}</span>
        </div>
        <p className="profile-strength-explainer" id="credit-position-title">Profile Strength combines the financial signals Credlytic uses to understand your current card-readiness. It is separate from your bureau credit score.</p>
        <dl className="position-signals">
          <div><dt>Credit score</dt><dd>{data.profile.creditScore}</dd><small>Bureau score</small></div>
          <div><dt>Credit utilization</dt><dd className="signal-caution">{data.profile.utilization}%</dd><small>8 points above preferred</small></div>
          <div><dt>Recent hard inquiries</dt><dd>{data.profile.hardInquiries}</dd><small>No recent applications</small></div>
        </dl>
      </section>

      <section className="recommended-action" aria-labelledby="recommended-action-title">
        <div className="dashboard-section-label dashboard-section-label-caution"><span />Recommended next action</div>
        <div className="recommended-action-heading">
          <span className="action-line-icon"><TrendingDown aria-hidden="true" /></span>
          <span className="status-badge status-warning">{data.recommendation.impact}</span>
        </div>
        <h2 id="recommended-action-title">{data.recommendation.title}</h2>
        <p>{data.recommendation.explanation}</p>
        <div className="recommended-action-detail"><IndianRupee aria-hidden="true" /><strong>{data.recommendation.detail}</strong></div>
        <Link className="text-action" href="/profile?focus=utilization">See improvement plan<ArrowRight aria-hidden="true" /></Link>
      </section>
    </Surface>
  );
}

function BestMatches({ data }: { data: DashboardReadyData }) {
  return (
    <Surface className="dashboard-matches">
      <SectionHeader description="Based on your current profile and estimated card value." title="Best matches for you" />
      <div className="dashboard-match-head" aria-hidden="true"><span>Ranked card</span><span>Eligibility confidence</span><span>Estimated value</span><span>Status</span><span /></div>
      <div className="dashboard-match-list">
        {data.matches.map((card) => (
          <article className="dashboard-match-row" key={card.id}>
            <span className="match-rank">{String(card.rank).padStart(2, "0")}</span>
            <CreditCardVisual bank={card.bank} compact name={card.name} network={card.network} tone={card.tone} />
            <div className="dashboard-match-name"><span>{card.bank}</span><h3>{card.name}</h3><p>{card.reason}</p></div>
            <div className="dashboard-confidence"><span><strong>{card.confidence}%</strong> profile match</span><ProgressBar label={`${card.name} eligibility confidence`} tone={card.confidence >= 85 ? "success" : card.confidence < 70 ? "warning" : "blue"} value={card.confidence} /></div>
            <div className="dashboard-value"><span>Estimated value</span><strong>{formatINR(card.annualValue)} <small>/ year</small></strong></div>
            <MatchBadge status={card.status} />
            <Link aria-label={`${card.actionLabel} for ${card.name}`} className="dashboard-row-action" href={`/eligibility?card=${card.id}`}>{card.actionLabel}<ArrowRight aria-hidden="true" /></Link>
          </article>
        ))}
      </div>
      <Link className="dashboard-list-footer" href="/eligibility">View all eligibility results<ArrowRight aria-hidden="true" /></Link>
    </Surface>
  );
}

function InfluenceIcon({ item }: { item: DashboardInfluence }) {
  if (item.tone === "positive") return <Check aria-hidden="true" />;
  if (item.tone === "caution") return <CircleAlert aria-hidden="true" />;
  return <Minus aria-hidden="true" />;
}

function SupportingSignals({ data }: { data: DashboardReadyData }) {
  return (
    <div className="dashboard-support-grid">
      <Surface className="dashboard-influences">
        <SectionHeader description="Each signal includes its current effect on card-readiness." title="What is influencing your profile" />
        <div className="influence-list">
          {data.influences.map((item) => (
            <article className={`influence-row influence-${item.tone}`} key={item.id}>
              <span className="influence-icon"><InfluenceIcon item={item} /></span>
              <div><h3>{item.label}</h3><p>{item.effect}</p></div>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </Surface>

      <Surface className="dashboard-trend">
        <SectionHeader description="Bureau score · Mar–Aug 2026" title="Credit trend" />
        <div className="dashboard-chart" aria-label="Credit score increased from 685 in March to 742 in August" role="img">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={data.trend} margin={{ bottom: 0, left: -26, right: 8, top: 18 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis axisLine={false} dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} />
              <YAxis axisLine={false} domain={[670, 750]} tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} ticks={[680, 700, 720, 740]} />
              <Tooltip contentStyle={{ background: "#0c1727", border: "1px solid rgba(182,204,232,.22)", borderRadius: 6, fontSize: 12 }} cursor={{ stroke: "rgba(50,198,212,.24)" }} />
              <Line activeDot={{ fill: "#32c6d4", r: 4, strokeWidth: 0 }} dataKey="score" dot={false} stroke="var(--cyan)" strokeWidth={2} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-change-list"><p className="eyebrow">What changed</p>{data.changes.map((change) => <p key={change}>{change}</p>)}</div>
      </Surface>
    </div>
  );
}

function DashboardLoading() {
  return <div aria-busy="true" aria-label="Loading dashboard" className="dashboard-loading"><div className="dashboard-skeleton dashboard-skeleton-large" /><div className="dashboard-skeleton" /><div className="dashboard-skeleton dashboard-skeleton-split" /></div>;
}

function DashboardError({ message }: { message: string }) {
  return <Surface className="dashboard-state dashboard-state-error"><CircleAlert aria-hidden="true" /><h1>Dashboard unavailable</h1><p>{message} Your saved profile has not been changed.</p><Link className="button button-secondary button-app" href="/dashboard"><RefreshCw aria-hidden="true" />Try again</Link></Surface>;
}

function DashboardIncomplete({ data }: { data: Extract<DashboardData, { state: "first-time" | "partial" }> }) {
  const progress = Math.round((data.completedSections / data.totalSections) * 100);
  return (
    <div className="dashboard-incomplete-layout">
      <Surface className="dashboard-state dashboard-state-incomplete">
        <ShieldCheck aria-hidden="true" /><p className="eyebrow">Profile required</p><h1>{data.title}</h1><p>{data.description}</p>
        <div className="profile-state-progress"><span><strong>{data.completedSections} of {data.totalSections}</strong> sections complete</span><ProgressBar label="Profile completion" value={progress} /></div>
        <Link className="button button-primary button-app" href="/profile">Continue profile<ArrowRight aria-hidden="true" /></Link>
      </Surface>
      {data.availableSignals.length > 0 ? <section className="available-signal-list"><p className="eyebrow">Available information</p>{data.availableSignals.map((signal) => <div key={signal.label}><span>{signal.label}</span><strong>{signal.value}</strong></div>)}</section> : null}
      <section className="dashboard-disabled-results" data-disabled="true"><h2>Card matches will appear here</h2><p>Credlytic needs the remaining profile details before it can calculate eligibility confidence or personal value.</p></section>
    </div>
  );
}

export function DashboardExperience({ data }: { data: DashboardData }) {
  if (data.state === "loading") return <DashboardLoading />;
  if (data.state === "error") return <DashboardError message={data.message} />;
  if (data.state !== "ready") return <DashboardIncomplete data={data} />;
  return <div className="dashboard-v2"><PositionWorkspace data={data} /><BestMatches data={data} /><SupportingSignals data={data} /><p className="dashboard-data-note">Sample workspace · Position updated {data.asOf} · Eligibility confidence is not an approval guarantee.</p></div>;
}
