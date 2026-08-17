"use client";

import Link from "next/link";
import { ArrowRight, Check, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductShell } from "@/components/product-shell";
import { CreditCardVisual, MatchBadge, StatusBadge, Surface } from "@/components/product-ui";
import { cardFilters, creditCards } from "@/data/mock-cards";
import { formatINR } from "@/data/mock-user";

export default function CardsPage() {
  const [filter, setFilter] = useState("All cards");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(["amazon-pay-icici", "axis-ace"]);

  const results = useMemo(() => creditCards.filter((card) => {
    const matchesFilter = filter === "All cards" || card.categories.some((category) => category.toLowerCase().includes(filter.toLowerCase().replace("zero fee", "zero")));
    const matchesSearch = `${card.bank} ${card.name} ${card.categories.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesSearch;
  }), [filter, query]);

  function toggleCard(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  }

  return (
    <ProductShell
      eyebrow="Card discovery"
      subtitle="Compare financial products by personal fit, fees and realistic value—not by promotional noise."
      title="Find the right card for you"
    >
      <Surface className="card-discovery-toolbar">
        <label className="card-search"><Search /><input aria-label="Search cards" onChange={(event) => setQuery(event.target.value)} placeholder="Search by card, bank or benefit" value={query} /></label>
        <div className="filter-scroll" aria-label="Card filters">{cardFilters.map((item) => <button className={filter === item ? "filter-active" : ""} key={item} onClick={() => setFilter(item)} type="button">{item}</button>)}</div>
        <button aria-label="More filters" className="icon-button filter-button" title="More filters" type="button"><SlidersHorizontal /></button>
      </Surface>

      <div className="discovery-meta"><p><strong>{results.length}</strong> cards match your view</p><span><Sparkles /> Sample recommendations based on Meera’s profile</span></div>

      <div className="card-product-grid">
        {results.map((card) => {
          const isSelected = selected.includes(card.id);
          return (
            <Surface as="article" className="card-product" key={card.id}>
              <div className="card-product-visual"><CreditCardVisual bank={card.bank} name={card.name} network={card.network} tone={card.tone} /><div className="fit-orbit"><strong>{card.match}%</strong><span>fit</span></div></div>
              <div className="card-product-head"><div><span>{card.bank} · {card.network}</span><h2>{card.name}</h2></div><MatchBadge status={card.status} /></div>
              <p className="card-product-reason">{card.whyItMatches}</p>
              <div className="card-value-row"><div><span>Annual fee</span><strong>{card.annualFee === 0 ? "No fee" : formatINR(card.annualFee)}</strong></div><div><span>Est. annual value</span><strong>{formatINR(card.estimatedAnnualValue)}</strong></div><div><span>Profile fit</span><strong>{card.match}%</strong></div></div>
              <div className="card-strengths">{card.strengths.slice(0, 2).map((strength) => <span key={strength}><Check />{strength}</span>)}</div>
              <div className="card-product-actions"><button aria-pressed={isSelected} className={`compare-select ${isSelected ? "compare-selected" : ""}`} onClick={() => toggleCard(card.id)} type="button">{isSelected ? <Check /> : null}{isSelected ? "Added to compare" : "Add to compare"}</button><button className="icon-button" aria-label={`View ${card.name}`} title={`View ${card.name}`} type="button"><ArrowRight /></button></div>
            </Surface>
          );
        })}
      </div>

      {results.length === 0 ? <Surface className="empty-state"><Search /><h2>No cards match those filters</h2><p>Try a broader category or search by bank name.</p><button className="button button-secondary button-app" onClick={() => { setFilter("All cards"); setQuery(""); }} type="button">Clear filters</button></Surface> : null}

      {selected.length > 0 ? <div className="compare-dock"><div><StatusBadge tone="blue">{selected.length} selected</StatusBadge><span>{selected.map((id) => creditCards.find((card) => card.id === id)?.name).join(" · ")}</span></div><div><button aria-label="Clear comparison" className="icon-button" onClick={() => setSelected([])} title="Clear comparison" type="button"><X /></button><Link className={`button button-primary button-app ${selected.length < 2 ? "button-disabled" : ""}`} href={selected.length >= 2 ? "/cards/compare" : "#"}>Compare cards<ArrowRight /></Link></div></div> : null}
    </ProductShell>
  );
}
