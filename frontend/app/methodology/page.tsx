import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert, Info } from "lucide-react";
import { ContentShell } from "@/components/content/content-shell";
import { buildMetadata } from "@/lib/seo";
import { formatINR } from "@/lib/format";
import { landingProfile, landingValueRows } from "@/data/landing.mock";
import "../landing.css";
import "../content.css";

export const metadata: Metadata = buildMetadata({
  description:
    "How Credlytic estimates card eligibility: what a profile match means, which inputs are used, how annual value is calculated, how issuer policy is reviewed, and the limits of the estimate.",
  path: "/methodology",
  title: "Methodology — How Credlytic Estimates Eligibility"
});

export default function MethodologyPage() {
  const sorted = [...landingValueRows].sort((a, b) => b.netValue - a.netValue);

  return (
    <ContentShell
      breadcrumb={[
        { name: "Home", path: "/" },
        { name: "Methodology", path: "/methodology" }
      ]}
      kicker="Methodology"
      lede="Credlytic produces two numbers for every card: how likely your profile is to clear the issuer's stated criteria, and what the card is plausibly worth against your spending. This page defines both, and states what neither can tell you."
      reviewed="August 2026"
      title="How Credlytic estimates eligibility."
    >
      <section>
        <h2>What a profile match is</h2>
        <p>
          A profile match is a <strong>modelled estimate of fit</strong> — how closely the profile you entered aligns with
          the criteria an issuer publishes for a card. It is expressed as a percentage because fit is a matter of degree:
          income can clear a threshold while utilization sits outside the preferred band.
        </p>
        <p>
          It is <strong>not</strong> an approval probability quoted by the bank, not a pre-approval, and not an offer. No
          issuer sees your profile when Credlytic produces this number.
        </p>
        <div className="content-note" data-tone="caution">
          <CircleAlert aria-hidden="true" />
          <p>
            A 92% match does not mean a 92% chance of approval. It means the profile clears almost everything the issuer
            states publicly. Issuers also use internal data — existing relationship, employer category, address history,
            bureau detail beyond the score — that Credlytic cannot see and does not model.
          </p>
        </div>
      </section>

      <section>
        <h2>What the estimate uses</h2>
        <p>Only what you enter. There is no bureau pull, so nothing is fetched on your behalf and no hard inquiry is created.</p>
        <dl className="content-defs">
          <div>
            <dt>Income</dt>
            <dd>Monthly gross income and any additional income, compared against the issuer&apos;s stated minimum.</dd>
          </div>
          <div>
            <dt>Obligations</dt>
            <dd>Existing EMIs and outstanding balances, used to derive a debt-to-income ratio.</dd>
          </div>
          <div>
            <dt>Credit standing</dt>
            <dd>Self-reported score, length of history, and number of recent applications.</dd>
          </div>
          <div>
            <dt>Utilization</dt>
            <dd>Balance as a share of total limit — usually the factor with the most headroom to change.</dd>
          </div>
          <div>
            <dt>Spending</dt>
            <dd>Category split. This drives the value estimate, not the eligibility estimate.</dd>
          </div>
        </dl>
        <p>
          Because the score is self-reported, an estimate built on a remembered or stale number will be wrong in the same
          direction as the input. Uploading a report replaces the guess with the figure on the document.
        </p>
      </section>

      <section>
        <h2>How annual value is calculated</h2>
        <p>
          Reward rates are applied to your category spend, capped where the issuer caps them, then the annual fee is
          subtracted. What remains is net value — the number worth comparing.
        </p>
        <div className="content-table-scroll">
          <table className="content-table">
            <caption>
              Modelled on {formatINR(landingProfile.monthlySpend)} of monthly spend for the sample profile. Illustrative.
            </caption>
            <thead>
              <tr>
                <th scope="col">Card</th>
                <th className="content-num" scope="col">Est. rewards</th>
                <th className="content-num" scope="col">Annual fee</th>
                <th className="content-num" scope="col">Net value</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.name}</th>
                  <td className="content-num">{formatINR(row.rewardValue)}</td>
                  <td className="content-num">{row.annualFee === 0 ? "None" : formatINR(row.annualFee)}</td>
                  <td className="content-num">{formatINR(row.netValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Note what this table does <em>not</em> conclude. {sorted[0].name} shows the highest net value at{" "}
          {formatINR(sorted[0].netValue)}, but it is not the recommended card for this profile — its match is 67%, held
          back by utilization. Credlytic orders results by approval confidence first and value second, because value you
          cannot obtain is not value.
        </p>
        <p>
          Reward value is also the softest number on the page. It assumes your spending stays roughly as entered, that you
          redeem what you earn, and that points convert at the rate the issuer currently publishes. Change any of those and
          the figure moves.
        </p>
      </section>

      <section>
        <h2>How issuer policy is handled</h2>
        <p>
          Eligibility criteria, fees and reward terms are taken from issuer documents — Most Important Terms and Conditions,
          published eligibility pages, and fee schedules — rather than restated from secondary coverage. Each claim carries
          the document it came from and the date that document was last checked.
        </p>
        <p>
          Where a figure cannot be confirmed in a source document, Credlytic states that it is unverified instead of
          publishing a number. Criteria change without announcement; a review date is the only honest way to show how fresh
          a figure is.
        </p>
      </section>

      <section>
        <h2>Limits of the estimate</h2>
        <ul>
          <li><strong>The issuer decides.</strong> Credlytic has no role in the decision and no visibility into it.</li>
          <li><strong>Published criteria are a floor, not the rule.</strong> Meeting every stated requirement does not oblige an issuer to approve.</li>
          <li><strong>Self-reported inputs.</strong> The estimate is only as accurate as the profile behind it.</li>
          <li><strong>No bureau access.</strong> Credlytic cannot see your report unless you upload it, so it cannot detect errors, ghost accounts or disputes on its own.</li>
          <li><strong>Not regulated advice.</strong> This is information to help you decide, not a recommendation from a licensed adviser.</li>
        </ul>
        <div className="content-note">
          <Info aria-hidden="true" />
          <p>
            Credlytic is in active development. The interface currently runs on an illustrative sample profile, and every
            figure shown in the product is labelled as sample data.
          </p>
        </div>
      </section>

      <section className="content-next">
        <h2>Related</h2>
        <Link href="/editorial-policy">Editorial policy <span>How card information is researched, reviewed and corrected</span></Link>
        <Link href="/credit-card-eligibility">Credit card eligibility in India <span>What issuers assess, and what you can change</span></Link>
        <Link href="/cards">Browse cards <span>Fees, rewards and estimated value side by side</span></Link>
      </section>
    </ContentShell>
  );
}
