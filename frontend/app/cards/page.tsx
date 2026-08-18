"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ChevronUp, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ProductShell } from "@/components/product-shell";
import { CreditCardVisual, MatchBadge, StatusBadge, Surface } from "@/components/product-ui";
import { cardDiscoveryDetails, cardsDiscoveryCategories, creditCards, savedSpendingProfile } from "@/data/mock-cards";
import { formatINR } from "@/data/mock-user";

const banks = ["HDFC Bank", "ICICI Bank", "Axis Bank", "SBI Card"];
const benefits = ["Cashback", "Travel", "Lounge", "Fuel", "Dining", "Online"];
const networks = ["Visa", "Mastercard", "RuPay", "Amex"];
const matchFilters = ["Strong match", "Good match", "Show all"];

type SortOption = "Best for you" | "Highest estimated value" | "Highest profile match" | "Lowest annual fee";
type FeeFilter = "All fees" | "No annual fee" | "Under ₹500" | "₹500–₹1,500" | "Premium";

const feeFilters: FeeFilter[] = ["All fees", "No annual fee", "Under ₹500", "₹500–₹1,500", "Premium"];
const subscribeToStaticUrl = () => () => undefined;

function categoryMatches(cardId: string, category: string) {
  const card = creditCards.find((item) => item.id === cardId);
  if (!card || category === "For you") return true;
  if (category === "Everyday spend") return card.categories.some((item) => ["Everyday", "Utilities", "Dining"].includes(item));
  if (category === "No annual fee") return card.annualFee === 0;
  return card.categories.some((item) => item.toLowerCase().includes(category.toLowerCase()));
}

export default function CardsPage() {
  const [category, setCategory] = useState("For you");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("Best for you");
  const [selected, setSelected] = useState<string[]>(["amazon-pay-icici", "axis-ace"]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [feeFilter, setFeeFilter] = useState<FeeFilter>("All fees");
  const [matchFilter, setMatchFilter] = useState("Show all");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const hasSpendingProfile = useSyncExternalStore(
    subscribeToStaticUrl,
    () => new URLSearchParams(window.location.search).get("spending") !== "missing",
    () => true
  );

  const activeFilterCount = selectedBanks.length + selectedBenefits.length + selectedNetworks.length + Number(feeFilter !== "All fees") + Number(matchFilter !== "Show all");

  const results = useMemo(() => {
    const filtered = creditCards.filter((card) => {
      const text = `${card.bank} ${card.name} ${card.network} ${card.categories.join(" ")} ${cardDiscoveryDetails[card.id].bestFor}`.toLowerCase();
      const feeMatches = feeFilter === "All fees"
        || (feeFilter === "No annual fee" && card.annualFee === 0)
        || (feeFilter === "Under ₹500" && card.annualFee > 0 && card.annualFee < 500)
        || (feeFilter === "₹500–₹1,500" && card.annualFee >= 500 && card.annualFee <= 1500)
        || (feeFilter === "Premium" && card.annualFee > 1500);
      const fitMatches = matchFilter === "Show all"
        || (matchFilter === "Strong match" && card.status === "Strong match")
        || (matchFilter === "Good match" && ["Strong match", "Good match"].includes(card.status));
      return categoryMatches(card.id, category)
        && text.includes(query.trim().toLowerCase())
        && (selectedBanks.length === 0 || selectedBanks.includes(card.bank))
        && (selectedBenefits.length === 0 || selectedBenefits.some((benefit) => text.includes(benefit.toLowerCase())))
        && (selectedNetworks.length === 0 || selectedNetworks.includes(card.network))
        && feeMatches
        && fitMatches;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Highest estimated value") return b.estimatedAnnualValue - a.estimatedAnnualValue;
      if (sort === "Highest profile match") return b.match - a.match;
      if (sort === "Lowest annual fee") return a.annualFee - b.annualFee;
      return b.match - a.match;
    });
  }, [category, feeFilter, matchFilter, query, selectedBanks, selectedBenefits, selectedNetworks, sort]);

  function toggleListValue(value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function toggleCard(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  }

  function clearFilters() {
    setCategory("For you");
    setQuery("");
    setSelectedBanks([]);
    setSelectedBenefits([]);
    setSelectedNetworks([]);
    setFeeFilter("All fees");
    setMatchFilter("Show all");
  }

  return (
    <ProductShell
      advisorContext={{ pageId: "cards", label: "Card discovery context", subject: "Personal card value", starter: "Which card fits my spending best?", suggestions: ["Which card fits my spending best?", "Why is Amazon Pay ICICI ranked first?", "Which option has the best value after fees?", "Compare Axis Ace and SBI Cashback"], metadata: { monthlySpend: hasSpendingProfile ? savedSpendingProfile.monthlyTotal : "not provided" } }}
      searchPlaceholder="Search cards or ask Credlytic"
      subtitle="Explore cards by personal value, benefits, fees, and current profile fit."
      title="Cards"
    >
      <section className={`cards-spending-context ${hasSpendingProfile ? "" : "cards-spending-missing"}`}>
        {hasSpendingProfile ? <div><p>Based on <strong>{formatINR(savedSpendingProfile.monthlyTotal)}/month</strong> in saved spending</p><span>{savedSpendingProfile.breakdown.map((item) => `${item.label} ${item.shortValue}`).join(" · ")}</span></div> : <div><p><strong>Add spending to estimate your value</strong></p><span>The card catalogue and profile match remain available.</span></div>}
        <Link className="cards-context-action" href="/profile#spending">{hasSpendingProfile ? "Edit spending profile" : "Add spending"}<ArrowRight /></Link>
      </section>

      <nav className="cards-category-nav" aria-label="Card discovery categories">
        {cardsDiscoveryCategories.map((item) => <button aria-pressed={category === item} className={category === item ? "cards-category-active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}</button>)}
      </nav>

      <Surface className="cards-controls">
        <label className="cards-search"><Search aria-hidden="true" /><input aria-label="Search cards" onChange={(event) => setQuery(event.target.value)} placeholder="Search cards" value={query} /></label>
        <button className={`cards-filter-trigger ${activeFilterCount ? "cards-filter-trigger-active" : ""}`} onClick={() => setDrawerOpen(true)} type="button"><SlidersHorizontal />Filters{activeFilterCount ? <span>{activeFilterCount}</span> : null}</button>
        <label className="cards-sort"><span>Sort</span><select aria-label="Sort cards" onChange={(event) => setSort(event.target.value as SortOption)} value={sort}><option>Best for you</option><option>Highest estimated value</option><option>Highest profile match</option><option>Lowest annual fee</option></select></label>
      </Surface>

      <div className="cards-results-meta"><p><strong>{results.length}</strong> cards</p><span>{sort === "Best for you" ? "Ranked by profile fit and personal value" : `Sorted by ${sort.toLowerCase()}`}</span></div>

      <div className="cards-result-list">
        {results.map((card, index) => {
          const details = cardDiscoveryDetails[card.id];
          const isSelected = selected.includes(card.id);
          const isExpanded = expandedCard === card.id;
          return (
            <Surface as="article" className="cards-result" key={card.id}>
              <div className="cards-result-rank">{String(index + 1).padStart(2, "0")}</div>
              <div className="cards-result-identity"><CreditCardVisual bank={card.bank} compact name={card.name} network={card.network} tone={card.tone} /><div><span>{card.bank} · {card.network}</span><h2>{card.name}</h2>{details.recommendation ? <small>{details.recommendation}</small> : null}</div></div>
              <div className="cards-result-case"><p>{details.summary}</p><dl><div><dt>Best for</dt><dd>{details.bestFor}</dd></div><div><dt>Trade-off</dt><dd>{details.tradeoff}</dd></div></dl><div className="cards-benefit-signals">{details.benefitSignals.map((benefit) => <span key={benefit}>{benefit}</span>)}</div></div>
              <div className="cards-result-metrics">
                <div className="cards-value-metric"><span>Estimated personal value</span><strong>{hasSpendingProfile ? `${formatINR(card.estimatedAnnualValue)}/year` : "Unavailable"}</strong><small>{hasSpendingProfile ? "Based on your spending" : "Add spending to estimate"}</small></div>
                <div><span>Annual fee</span><strong>{card.annualFee === 0 ? "₹0" : `${formatINR(card.annualFee)}/year`}</strong><small>{details.feeNote}</small></div>
                <div><span>Profile match</span><strong>{card.match}%</strong><MatchBadge status={card.status} /></div>
              </div>
              <div className="cards-result-actions"><button aria-expanded={isExpanded} className="cards-view-action" onClick={() => setExpandedCard(isExpanded ? null : card.id)} type="button">View card{isExpanded ? <ChevronUp /> : <ChevronDown />}</button><button aria-pressed={isSelected} className={`compare-select ${isSelected ? "compare-selected" : ""}`} onClick={() => toggleCard(card.id)} type="button">{isSelected ? <Check /> : null}{isSelected ? "Added to compare" : "Compare"}</button></div>
              {isExpanded ? <div className="cards-result-detail"><span><strong>Joining fee</strong>{card.joiningFee === 0 ? "₹0" : formatINR(card.joiningFee)}</span><span><strong>Useful benefits</strong>{card.strengths.slice(0, 2).join(" · ")}</span><span><strong>Card details reviewed</strong>{details.lastVerifiedAt}</span><Link href={`/eligibility?card=${card.id}`}>View eligibility analysis<ArrowRight /></Link></div> : null}
            </Surface>
          );
        })}
      </div>

      {results.length === 0 ? <Surface className="empty-state"><Search /><h2>No cards match these filters</h2><p>Try removing one or more filters.</p><button className="button button-secondary button-app" onClick={clearFilters} type="button">Clear filters</button></Surface> : null}

      {drawerOpen ? <div className="cards-filter-layer" role="presentation"><button aria-label="Close filters" className="cards-filter-scrim" onClick={() => setDrawerOpen(false)} type="button" /><aside aria-labelledby="cards-filter-title" aria-modal="true" className="cards-filter-drawer" role="dialog"><header><div><p>Refine results</p><h2 id="cards-filter-title">Filters</h2></div><button aria-label="Close filters" className="icon-button" onClick={() => setDrawerOpen(false)} type="button"><X /></button></header><div className="cards-filter-body"><fieldset><legend>Bank</legend>{banks.map((item) => <label key={item}><input checked={selectedBanks.includes(item)} onChange={() => toggleListValue(item, setSelectedBanks)} type="checkbox" /><span>{item}</span></label>)}</fieldset><fieldset><legend>Annual fee</legend>{feeFilters.map((item) => <label key={item}><input checked={feeFilter === item} name="annual-fee" onChange={() => setFeeFilter(item)} type="radio" /><span>{item}</span></label>)}</fieldset><fieldset><legend>Benefits</legend>{benefits.map((item) => <label key={item}><input checked={selectedBenefits.includes(item)} onChange={() => toggleListValue(item, setSelectedBenefits)} type="checkbox" /><span>{item}</span></label>)}</fieldset><fieldset><legend>Card network</legend>{networks.map((item) => <label key={item}><input checked={selectedNetworks.includes(item)} onChange={() => toggleListValue(item, setSelectedNetworks)} type="checkbox" /><span>{item}</span></label>)}</fieldset><fieldset><legend>Profile fit</legend>{matchFilters.map((item) => <label key={item}><input checked={matchFilter === item} name="profile-fit" onChange={() => setMatchFilter(item)} type="radio" /><span>{item}</span></label>)}</fieldset></div><footer><button className="button button-secondary button-app" onClick={clearFilters} type="button">Clear all</button><button className="button button-primary button-app" onClick={() => setDrawerOpen(false)} type="button">Show {results.length} cards</button></footer></aside></div> : null}

      {selected.length >= 2 ? <div className="compare-dock cards-compare-dock"><div><StatusBadge tone="blue">{selected.length} selected</StatusBadge><span>{selected.map((id) => creditCards.find((card) => card.id === id)?.name).join(" · ")}</span></div><div><button className="cards-clear-compare" onClick={() => setSelected([])} type="button">Clear</button><Link className="button button-primary button-app" href="/cards/compare">Compare cards<ArrowRight /></Link></div></div> : null}
    </ProductShell>
  );
}
