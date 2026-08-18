"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  FileText,
  Info,
  Plus,
  RefreshCw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductShell } from "@/components/product-shell";
import { CreditCardVisual, ProgressBar, Surface } from "@/components/product-ui";
import type {
  EligibilityCard,
  EligibilityData,
  EligibilityFilter,
  EligibilityReadyData,
  EligibilitySort,
  EligibilityStatus
} from "@/data/eligibility.mock";

const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0, style: "currency", currency: "INR" }).format(value);

function statusTone(status: EligibilityStatus) {
  if (status === "Strong match") return "positive";
  if (status === "Good match") return "context";
  if (status === "Not currently suitable") return "risk";
  return "caution";
}

function EligibilityStatusLabel({ status }: { status: EligibilityStatus }) {
  return <span className={`eligibility-v2-status eligibility-v2-status-${statusTone(status)}`}>{status}</span>;
}

function PolicyLabel({ card }: { card: EligibilityCard }) {
  return <span className={`eligibility-v2-policy-label eligibility-v2-policy-${card.policy.status}`}>{card.policy.label}</span>;
}

function AssessmentNotice({ status, refreshing, onRefresh }: { status: EligibilityReadyData["assessmentStatus"]; refreshing: boolean; onRefresh: () => void }) {
  if (status === "current") return null;
  const isError = status === "refresh-error";
  return (
    <div className={`eligibility-v2-notice ${isError ? "eligibility-v2-notice-error" : ""}`} role={isError ? "alert" : "status"}>
      {isError ? <CircleAlert aria-hidden="true" /> : <Clock3 aria-hidden="true" />}
      <div><strong>{isError ? "We couldn't refresh your eligibility results" : "Your profile has changed since this assessment."}</strong><p>{isError ? "Your previous results are still available. Try again when you're ready." : "Refresh before relying on the current ranking."}</p></div>
      <button className="text-action" disabled={refreshing} onClick={onRefresh} type="button"><RefreshCw className={refreshing ? "is-spinning" : ""} />{isError ? "Retry" : "Refresh eligibility"}</button>
    </div>
  );
}

function EligibilitySummary({ data }: { data: EligibilityReadyData }) {
  return (
    <dl className="eligibility-v2-summary" aria-label="Eligibility assessment summary">
      <div><dt>Cards assessed</dt><dd>{data.assessedCards}+</dd></div>
      <div><dt>Strong or good matches</dt><dd>{data.worthwhileMatches}</dd></div>
      <div><dt>Primary limiting factor</dt><dd className="eligibility-v2-caution-value">{data.primaryLimitingFactor}</dd></div>
      <div><dt>Profile Strength</dt><dd>{data.profileStrength}<small>/100</small></dd></div>
    </dl>
  );
}

function BestCurrentOption({ card, onSelect, onCompare, compared }: { card: EligibilityCard; onSelect: () => void; onCompare: () => void; compared: boolean }) {
  return (
    <Surface className="eligibility-v2-best">
      <div className="eligibility-v2-best-label"><span />Best current option</div>
      <div className="eligibility-v2-best-main">
        <CreditCardVisual bank={card.bank} compact name={card.name} network={card.network} tone={card.tone} />
        <div className="eligibility-v2-best-name"><span>{card.bank}</span><h2>{card.name}</h2><p>{card.bestOptionReason}</p></div>
        <div className="eligibility-v2-best-confidence"><span>Eligibility confidence</span><strong>{card.confidence}%</strong><EligibilityStatusLabel status={card.status} /></div>
        <div className="eligibility-v2-best-value"><span>Estimated personal value</span><strong>{card.estimatedAnnualValue === null ? "Unavailable" : `${formatINR(card.estimatedAnnualValue)} / year`}</strong><small>{card.estimatedAnnualValue === null ? "Add spending data for an estimate" : "Based on the current spending profile"}</small></div>
        <div className="eligibility-v2-best-policy"><span>Policy alignment</span><PolicyLabel card={card} /></div>
      </div>
      <div className="eligibility-v2-best-actions">
        <button className="button button-primary button-app" onClick={onSelect} type="button">View full analysis<ArrowRight aria-hidden="true" /></button>
        <button className={`button button-secondary button-app ${compared ? "eligibility-v2-compare-active" : ""}`} onClick={onCompare} type="button">{compared ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}{compared ? "Added to compare" : "Add to compare"}</button>
      </div>
    </Surface>
  );
}

function FilterBar({ filter, sort, onFilter, onSort, compareCount, compareHref }: { filter: EligibilityFilter; sort: EligibilitySort; onFilter: (filter: EligibilityFilter) => void; onSort: (sort: EligibilitySort) => void; compareCount: number; compareHref: string }) {
  const filters: Array<{ id: EligibilityFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "strong", label: "Strong matches" },
    { id: "good", label: "Good matches" },
    { id: "improve", label: "Improve first" }
  ];
  return (
    <div className="eligibility-v2-toolbar">
      <div className="eligibility-v2-filters" aria-label="Filter eligibility results">
        {filters.map((item) => <button aria-pressed={filter === item.id} key={item.id} onClick={() => onFilter(item.id)} type="button">{item.label}</button>)}
      </div>
      <label className="eligibility-v2-sort"><span>Sort</span><select onChange={(event) => onSort(event.target.value as EligibilitySort)} value={sort}><option value="best-fit">Best fit</option><option value="confidence">Highest confidence</option><option value="value">Highest estimated value</option></select><ChevronDown aria-hidden="true" /></label>
      {compareCount >= 2 ? <Link className="eligibility-v2-compare-link" href={compareHref}><Scale aria-hidden="true" />Compare {compareCount} cards<ArrowRight aria-hidden="true" /></Link> : null}
    </div>
  );
}

function ResultRow({ card, selected, compared, onSelect, onCompare }: { card: EligibilityCard; selected: boolean; compared: boolean; onSelect: () => void; onCompare: () => void }) {
  return (
    <article className={`eligibility-v2-row ${selected ? "eligibility-v2-row-selected" : ""}`}>
      <button aria-label={`View analysis for ${card.name}`} className="eligibility-v2-row-main" onClick={onSelect} type="button">
        <span className="eligibility-v2-rank">{String(card.rank).padStart(2, "0")}</span>
        <span className="eligibility-v2-card-cell"><CreditCardVisual bank={card.bank} compact name={card.name} network={card.network} tone={card.tone} /><span><small>{card.bank}</small><strong>{card.name}</strong><em>{card.reason}</em></span></span>
        <span className="eligibility-v2-confidence-cell"><strong>{card.confidence}%</strong><small>Eligibility confidence</small><ProgressBar label={`${card.name} eligibility confidence`} tone={card.confidence >= 88 ? "success" : card.confidence < 70 ? "warning" : "blue"} value={card.confidence} /></span>
        <span className="eligibility-v2-value-cell"><strong>{card.estimatedAnnualValue === null ? "Unavailable" : formatINR(card.estimatedAnnualValue)}</strong><small>{card.estimatedAnnualValue === null ? "Value estimate" : "Estimated / year"}</small></span>
        <PolicyLabel card={card} />
        <EligibilityStatusLabel status={card.status} />
        <ArrowRight className="eligibility-v2-row-arrow" aria-hidden="true" />
      </button>
      <button aria-label={`${compared ? "Remove" : "Add"} ${card.name} ${compared ? "from" : "to"} comparison`} aria-pressed={compared} className="eligibility-v2-row-compare" onClick={onCompare} type="button">{compared ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}<span>{compared ? "Added" : "Compare"}</span></button>
    </article>
  );
}

function InfluenceRows({ factors }: { factors: EligibilityCard["positiveFactors"] }) {
  return <div className="eligibility-v2-influence-list">{factors.map((factor) => <div className={`eligibility-v2-influence eligibility-v2-influence-${factor.tone}`} key={factor.id}><span>{factor.tone === "positive" ? <Check aria-hidden="true" /> : factor.tone === "caution" ? <CircleAlert aria-hidden="true" /> : <Info aria-hidden="true" />}</span><div><strong>{factor.label}</strong><small>{factor.interpretation}</small></div><b>{factor.value}</b></div>)}</div>;
}

function DetailPane({ card, mobileOpen, sourceOpen, onClose, onSourceToggle }: { card: EligibilityCard; mobileOpen: boolean; sourceOpen: string | null; onClose: () => void; onSourceToggle: (id: string) => void }) {
  return (
    <>
      {mobileOpen ? <button aria-label="Close selected-card analysis" className="eligibility-v2-detail-scrim" onClick={onClose} type="button" /> : null}
      <aside aria-label={`${card.name} eligibility analysis`} className={`eligibility-v2-detail ${mobileOpen ? "eligibility-v2-detail-open" : ""}`}>
        <header className="eligibility-v2-detail-head"><button aria-label="Back to eligibility results" className="eligibility-v2-detail-back" onClick={onClose} type="button"><ArrowLeft /></button><div><span>{card.bank}</span><h2>{card.name}</h2></div><button aria-label="Close analysis" className="eligibility-v2-detail-close" onClick={onClose} type="button"><X /></button></header>

        <div className="eligibility-v2-detail-scroll">
          <section className="eligibility-v2-current-match"><div><span>Eligibility confidence</span><strong>{card.confidence}%</strong></div><EligibilityStatusLabel status={card.status} /><ProgressBar label={`${card.name} eligibility confidence`} tone={card.confidence >= 88 ? "success" : card.confidence < 70 ? "warning" : "blue"} value={card.confidence} /><p>Based on your current financial profile and available issuer criteria.</p></section>

          <section className="eligibility-v2-detail-section"><div className="eligibility-v2-detail-title"><span>01</span><h3>What is helping</h3></div><InfluenceRows factors={card.positiveFactors} /></section>
          <section className="eligibility-v2-detail-section"><div className="eligibility-v2-detail-title"><span>02</span><h3>What is limiting</h3></div><InfluenceRows factors={card.limitingFactors} /></section>

          <section className="eligibility-v2-detail-section"><div className="eligibility-v2-detail-title"><span>03</span><h3>Policy context</h3></div><PolicyLabel card={card} /><p className="eligibility-v2-policy-summary">{card.policy.summary}</p><div className="eligibility-v2-criteria">{card.policy.criteria.map((criterion) => <div key={criterion.label}><span><strong>{criterion.label}</strong><small>Current profile: {criterion.profileValue}</small></span><b className={`eligibility-v2-criterion-${criterion.tone}`}>{criterion.assessment}</b></div>)}</div>
            <div className="eligibility-v2-sources">{card.policy.sources.map((source) => { const expanded = sourceOpen === source.id; return <article key={source.id}><button aria-expanded={expanded} onClick={() => onSourceToggle(source.id)} type="button"><FileText aria-hidden="true" /><span><strong>{source.documentTitle}</strong><small>{source.issuer} · Reviewed {source.reviewedAt}</small></span><ChevronDown className={expanded ? "is-rotated" : ""} aria-hidden="true" /></button>{expanded ? <div className="eligibility-v2-source-detail"><span>{source.sourceLabel}</span><dl><div><dt>Relevant section</dt><dd>{source.relevantSection}</dd></div><div><dt>Review date</dt><dd>{source.reviewedAt}</dd></div></dl><p>{source.excerpt}</p></div> : null}</article>; })}</div>
          </section>

          {(card.estimatedAnnualValue !== null || card.estimatedLimit !== null) ? <section className="eligibility-v2-detail-section"><div className="eligibility-v2-detail-title"><span>04</span><h3>Decision context</h3></div><dl className="eligibility-v2-decision-values">{card.estimatedAnnualValue !== null ? <div><dt>Estimated personal value</dt><dd>{formatINR(card.estimatedAnnualValue)} <small>/ year</small></dd><span>Based on the current spending profile</span></div> : null}{card.estimatedLimit !== null ? <div><dt>Estimated limit range</dt><dd>{formatINR(card.estimatedLimit[0])} – {formatINR(card.estimatedLimit[1])}</dd><span>Indicative estimate, not an issuer-approved limit</span></div> : null}</dl></section> : null}

          <section className="eligibility-v2-next-move"><div className="eligibility-v2-detail-title"><span>05</span><h3>Next move</h3></div><SlidersHorizontal aria-hidden="true" /><h4>{card.recommendedAction.title}</h4><p>{card.recommendedAction.explanation}</p><Link className="text-action" href={card.recommendedAction.href}>{card.recommendedAction.actionLabel}<ArrowRight aria-hidden="true" /></Link></section>
        </div>
      </aside>
    </>
  );
}

function EligibilityLoading() {
  return <div className="eligibility-v2-state"><Surface className="eligibility-v2-loading"><div className="eligibility-v2-loading-signal" /><p className="eyebrow">Eligibility assessment</p><h1>Assessing your current card matches…</h1><div className="eligibility-v2-loading-steps"><span><i />Checking profile signals</span><span><i />Comparing known issuer criteria</span><span><i />Estimating card value</span></div></Surface><div className="eligibility-v2-skeleton-list">{[1, 2, 3].map((item) => <div key={item}><span /><span /><span /><span /></div>)}</div></div>;
}

function EligibilityIncomplete({ data }: { data: Extract<EligibilityData, { state: "incomplete" }> }) {
  return (
    <div className="eligibility-v2-state eligibility-v2-incomplete">
      <Surface><ShieldCheck aria-hidden="true" /><p className="eyebrow">Profile required</p><h1>Complete your profile to see eligibility results</h1><p>Credlytic needs a few financial signals before it can evaluate card matches.</p><div className="eligibility-v2-completion"><span><strong>{data.completedSections} of {data.totalSections}</strong> sections complete</span><ProgressBar label="Financial profile completion" value={Math.round((data.completedSections / data.totalSections) * 100)} /></div><Link className="button button-primary button-app" href="/profile">Complete profile<ArrowRight aria-hidden="true" /></Link></Surface>
      <section className="eligibility-v2-missing"><p className="eyebrow">Missing sections</p>{data.missingSections.map((section) => <div key={section.label}><span><CircleAlert aria-hidden="true" /><strong>{section.label}</strong></span><p>{section.explanation}</p><b>Missing</b></div>)}</section>
    </div>
  );
}

function ReadyEligibility({ data, selectedId, onSelectedIdChange }: { data: EligibilityReadyData; selectedId: string; onSelectedIdChange: (cardId: string) => void }) {
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [filter, setFilter] = useState<EligibilityFilter>("all");
  const [sort, setSort] = useState<EligibilitySort>("best-fit");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [sourceOpen, setSourceOpen] = useState<string | null>(null);
  const [assessmentStatus, setAssessmentStatus] = useState(data.assessmentStatus);
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedCard = data.cards.find((card) => card.id === selectedId) ?? data.cards[0];

  useEffect(() => () => { if (refreshTimer.current) clearTimeout(refreshTimer.current); }, []);

  const visibleCards = useMemo(() => {
    const filtered = data.cards.filter((card) => {
      if (filter === "strong") return card.status === "Strong match";
      if (filter === "good") return card.status === "Good match";
      if (filter === "improve") return card.status === "Improve first" || card.status === "Borderline" || card.status === "Not currently suitable";
      return true;
    });
    return [...filtered].sort((a, b) => sort === "value" ? (b.estimatedAnnualValue ?? -1) - (a.estimatedAnnualValue ?? -1) : sort === "confidence" ? b.confidence - a.confidence : a.rank - b.rank);
  }, [data.cards, filter, sort]);

  function selectCard(cardId: string) { onSelectedIdChange(cardId); setSourceOpen(null); setMobileDetailOpen(true); }
  function toggleCompare(cardId: string) { setCompareIds((current) => current.includes(cardId) ? current.filter((id) => id !== cardId) : current.length < 3 ? [...current, cardId] : current); }
  function refreshAssessment() { setRefreshing(true); refreshTimer.current = setTimeout(() => { setRefreshing(false); setAssessmentStatus("current"); refreshTimer.current = null; }, 900); }

  return (
    <div className="eligibility-v2">
      <header className="eligibility-v2-heading"><div><p className="eyebrow">Pre-application intelligence</p><h1>Eligibility</h1><p>See how your current profile aligns with available credit cards before deciding where to apply.</p><span>{data.profileUpdatedLabel} · {data.assessedCards}+ cards assessed</span></div><button className="button button-secondary button-app" disabled={refreshing} onClick={refreshAssessment} type="button"><RefreshCw className={refreshing ? "is-spinning" : ""} />{refreshing ? "Refreshing…" : "Refresh assessment"}</button></header>
      <AssessmentNotice onRefresh={refreshAssessment} refreshing={refreshing} status={assessmentStatus} />
      {!data.valueEstimatesAvailable ? <div className="eligibility-v2-value-notice"><Info aria-hidden="true" /><p><strong>Card-value estimates are unavailable</strong><span>Add spending information to compare personal value. Eligibility confidence remains available.</span></p><Link className="text-action" href="/profile?edit=spending">Add spending<ArrowRight /></Link></div> : null}
      <EligibilitySummary data={data} />
      <BestCurrentOption card={data.cards[0]} compared={compareIds.includes(data.cards[0].id)} onCompare={() => toggleCompare(data.cards[0].id)} onSelect={() => selectCard(data.cards[0].id)} />

      <section className="eligibility-v2-results-heading"><div><p className="eyebrow">All card matches</p><h2>Cards worth considering now</h2><p>Ranked by current profile fit. Estimated value remains a separate decision factor.</p></div><span>Showing {visibleCards.length} current results</span></section>
      <FilterBar compareCount={compareIds.length} compareHref={`/cards/compare?cards=${compareIds.join(",")}`} filter={filter} onFilter={setFilter} onSort={setSort} sort={sort} />

      <div className="eligibility-v2-workspace">
        <Surface className="eligibility-v2-list">
          <div className="eligibility-v2-list-head" aria-hidden="true"><span>Ranked card</span><span>Confidence</span><span>Estimated value</span><span>Policy alignment</span><span>Status</span><span /><span>Compare</span></div>
          <div className="eligibility-v2-list-body">{visibleCards.map((card) => <ResultRow card={card} compared={compareIds.includes(card.id)} key={card.id} onCompare={() => toggleCompare(card.id)} onSelect={() => selectCard(card.id)} selected={selectedCard.id === card.id} />)}</div>
          {visibleCards.length === 0 ? <div className="eligibility-v2-filter-empty"><strong>No matches in this view</strong><p>Choose another status filter to review the remaining results.</p><button className="text-action" onClick={() => setFilter("all")} type="button">Show all matches<ArrowRight /></button></div> : null}
        </Surface>
        <DetailPane card={selectedCard} mobileOpen={mobileDetailOpen} onClose={() => setMobileDetailOpen(false)} onSourceToggle={(id) => setSourceOpen((current) => current === id ? null : id)} sourceOpen={sourceOpen} />
      </div>

      <p className="eligibility-v2-disclaimer"><Info aria-hidden="true" />Eligibility confidence is an estimate. Final approval is determined by the card issuer.</p>
    </div>
  );
}

export function EligibilityPageExperience({ data, initialSelectedId }: { data: EligibilityData; initialSelectedId?: string }) {
  const initialCardId = data.state === "ready" && data.cards.some((card) => card.id === initialSelectedId) ? initialSelectedId! : data.state === "ready" ? data.cards[0].id : "";
  const [selectedId, setSelectedId] = useState(initialCardId);
  const selectedCard = data.state === "ready" ? data.cards.find((card) => card.id === selectedId) ?? data.cards[0] : null;
  const advisorContext = {
    pageId: "eligibility" as const,
    label: "Eligibility context",
    subject: selectedCard ? `${selectedCard.name} · ${selectedCard.confidence}% match` : "Eligibility assessment",
    starter: selectedCard ? `Why is ${selectedCard.name} a ${selectedCard.confidence}% match?` : "What affects eligibility confidence?",
    suggestions: selectedCard ? [`Why is ${selectedCard.name} only a ${selectedCard.confidence}% match?`, "Which strong match has the best value?", "What should I improve before applying?", "Why is utilization affecting me?"] : ["How is eligibility confidence calculated?", "What information is still needed?", "Does checking affect my score?"],
    metadata: selectedCard ? { card: selectedCard.name, match: selectedCard.confidence } : undefined
  };

  return (
    <ProductShell advisorContext={advisorContext} compactHeader profileCompletion={data.state === "incomplete" ? Math.round((data.completedSections / data.totalSections) * 100) : 100} searchPlaceholder="Search cards or ask Credlytic" subtitle="Current profile alignment, policy context, and next actions." title="Eligibility">
      {data.state === "loading" ? <EligibilityLoading /> : data.state === "incomplete" ? <EligibilityIncomplete data={data} /> : <ReadyEligibility data={data} onSelectedIdChange={setSelectedId} selectedId={selectedId} />}
    </ProductShell>
  );
}
