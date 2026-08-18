"use client";

import { useRef, useState } from "react";
import { Check, ShieldCheck, TrendingUp, TriangleAlert } from "lucide-react";
import { CreditCardVisual, ProgressBar } from "@/components/product-ui";
import { formatINR } from "@/lib/format";
import { landingMatches, landingProfile, landingReportFactors, landingValueRows } from "@/data/landing.mock";

const tabs = [
  { id: "eligibility", label: "Eligibility" },
  { id: "value", label: "Card value" },
  { id: "report", label: "Report health" }
] as const;

type TabId = (typeof tabs)[number]["id"];

/** Highest net value in the sample set — deliberately not the recommended card. */
const highestValueId = landingValueRows.reduce((best, row) => (row.netValue > best.netValue ? row : best)).id;
/** Credlytic recommends on confidence, not on the largest number. */
const bestForYouId = landingMatches[0].id;

/**
 * Interactive product preview.
 *
 * Three panels because the landing page previously showed only a single static
 * dashboard image, leaving eligibility reasoning and value maths — the two
 * things a user actually decides on — unrepresented.
 */
export function LandingProductPreview() {
  const [active, setActive] = useState<TabId>("eligibility");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : event.key === "Home" ? -index : event.key === "End" ? tabs.length - 1 - index : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="product-preview">
      <div className="preview-chrome">
        <span className="preview-chrome-title">
          <i aria-hidden="true" /> Credlytic workspace
        </span>
        <small>Sample profile</small>
      </div>

      <div aria-label="Product preview sections" className="preview-tabs" role="tablist">
        {tabs.map((tab, index) => (
          <button
            aria-controls={`preview-panel-${tab.id}`}
            aria-selected={active === tab.id}
            className="preview-tab"
            data-active={active === tab.id ? "true" : "false"}
            id={`preview-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            role="tab"
            tabIndex={active === tab.id ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "eligibility" ? (
        <div aria-labelledby="preview-tab-eligibility" className="preview-panel" id="preview-panel-eligibility" role="tabpanel" tabIndex={0}>
          <div className="preview-summary">
            <div className="preview-score">
              <span>Credit score</span>
              <strong>{landingProfile.creditScore}</strong>
              <small>+{landingProfile.scoreChange} this month</small>
            </div>
            <div className="preview-action">
              <span>Recommended next action</span>
              <strong>{landingProfile.recommendedAction}</strong>
              <p>{landingProfile.recommendedDetail}</p>
              <div className="preview-limiting">
                <span>
                  <b>Limiting factor</b>
                  <strong>
                    {landingProfile.limitingFactor} · {landingProfile.utilization}%
                  </strong>
                </span>
                <ProgressBar label="Sample credit utilization" tone="warning" value={landingProfile.utilization} />
              </div>
            </div>
          </div>

          <ul className="preview-matches">
            {landingMatches.map((match) => (
              <li key={match.id}>
                <CreditCardVisual bank={match.bank} name={match.name} network={match.network} tone={match.tone} />
                <div className="preview-match-identity">
                  <strong>
                    {match.bank} {match.name}
                  </strong>
                  <small>{match.reason}</small>
                </div>
                <div className="preview-match-score">
                  <span>
                    <b>{match.match}%</b>
                    <i>{match.status}</i>
                  </span>
                  <ProgressBar label={`${match.name} profile match`} tone={match.match >= 80 ? "success" : "warning"} value={match.match} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {active === "value" ? (
        <div aria-labelledby="preview-tab-value" className="preview-panel" id="preview-panel-value" role="tabpanel" tabIndex={0}>
          <p className="preview-panel-lede">
            Annual value modelled on {formatINR(landingProfile.monthlySpend)} of monthly sample spending, net of joining and annual fees.
          </p>
          <div className="preview-table-scroll">
            <table className="preview-value-table">
              <caption className="sr-only">Estimated annual value by card for the sample profile</caption>
              <thead>
                <tr>
                  <th scope="col">Card</th>
                  <th scope="col">Est. rewards</th>
                  <th scope="col">Annual fee</th>
                  <th scope="col">Net value</th>
                </tr>
              </thead>
              <tbody>
                {[...landingValueRows]
                  .sort((a, b) => b.netValue - a.netValue)
                  .map((row) => (
                    <tr data-recommended={row.id === bestForYouId ? "true" : "false"} key={row.id}>
                      <th scope="row">
                        <strong>{row.name}</strong>
                        <small>{row.driver}</small>
                        {row.id === bestForYouId ? (
                          <span className="status-badge status-success">
                            <ShieldCheck aria-hidden="true" /> Best for you
                          </span>
                        ) : row.id === highestValueId ? (
                          <span className="status-badge status-muted">Highest value · weaker match</span>
                        ) : null}
                      </th>
                      <td>{formatINR(row.rewardValue)}</td>
                      <td>{row.annualFee === 0 ? "None" : formatINR(row.annualFee)}</td>
                      <td className="preview-net-value">{formatINR(row.netValue)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="preview-panel-foot">
            The highest net value is not automatically the right card. Credlytic ranks on approval confidence first, then value.
          </p>
        </div>
      ) : null}

      {active === "report" ? (
        <div aria-labelledby="preview-tab-report" className="preview-panel" id="preview-panel-report" role="tabpanel" tabIndex={0}>
          <p className="preview-panel-lede">Four factors decide most of your position. Credlytic ranks them by how much movement each one buys you.</p>
          <ul className="preview-factors">
            {landingReportFactors.map((factor) => (
              <li data-tone={factor.tone} key={factor.label}>
                <span className="preview-factor-icon" aria-hidden="true">
                  {factor.tone === "positive" ? <Check /> : <TriangleAlert />}
                </span>
                <div>
                  <span className="preview-factor-label">{factor.label}</span>
                  <strong>{factor.value}</strong>
                  <small>{factor.note}</small>
                </div>
              </li>
            ))}
          </ul>
          <div className="preview-priority">
            <TrendingUp aria-hidden="true" />
            <div>
              <span>Priority 1 of 3</span>
              <strong>{landingProfile.recommendedAction}</strong>
              <small>{landingProfile.recommendedDetail}</small>
            </div>
          </div>
          <p className="preview-panel-foot">Uploaded reports are processed for analysis only, and can be deleted from settings at any time.</p>
        </div>
      ) : null}
    </div>
  );
}
