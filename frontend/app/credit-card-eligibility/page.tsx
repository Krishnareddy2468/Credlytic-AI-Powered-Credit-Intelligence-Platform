import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleAlert } from "lucide-react";
import { ContentShell } from "@/components/content/content-shell";
import { buildMetadata } from "@/lib/seo";
import "../landing.css";
import "../content.css";

export const metadata: Metadata = buildMetadata({
  description:
    "What Indian issuers assess before approving a credit card, what a rejection costs, and which factors you can actually change. Check your eligibility without a hard inquiry.",
  path: "/credit-card-eligibility",
  title: "Credit Card Eligibility in India — Check Before You Apply"
});

export default function EligibilityGuidePage() {
  return (
    <ContentShell
      breadcrumb={[
        { name: "Home", path: "/" },
        { name: "Credit card eligibility", path: "/credit-card-eligibility" }
      ]}
      kicker="Credit card eligibility"
      lede="Applying is the most expensive way to find out whether you qualify. This page sets out what issuers actually assess, which of those factors you can move, and how far ahead of an application you need to move them."
      reviewed="August 2026"
      title="Check your eligibility before you apply."
    >
      <section>
        <h2>What an application costs when it fails</h2>
        <p>
          Every application places a hard inquiry on your bureau file, typically costing 10–30 points. The inquiry stays
          visible for two years and is weighed most heavily in the first six months — the exact window in which someone
          rejected by one issuer usually tries another.
        </p>
        <p>
          Three rejections inside six months can take 50–90 points off a score. The second application is assessed against
          a worse file than the first, and the third against a worse file again. This is why the order of operations matters
          more than the choice of card.
        </p>
        <div className="content-note" data-tone="caution">
          <CircleAlert aria-hidden="true" />
          <p>
            A declined application is not a neutral event you can simply repeat. It changes the input to the next decision.
          </p>
        </div>
      </section>

      <section>
        <h2>What issuers assess</h2>
        <p>
          Criteria differ by card, but the sequence is broadly consistent. Earlier checks are closer to pass/fail; later
          ones shade the decision and the limit you are offered.
        </p>
        <dl className="content-defs">
          <div>
            <dt>Income threshold</dt>
            <dd>
              A stated minimum, usually monthly gross. Largely binary — below the line, the rest rarely matters. Entry cards
              sit well under premium ones.
            </dd>
          </div>
          <div>
            <dt>Credit score</dt>
            <dd>
              A floor rather than a target. Clearing it moves you into assessment; exceeding it by 60 points does not
              guarantee a premium card if another factor fails.
            </dd>
          </div>
          <div>
            <dt>Credit utilization</dt>
            <dd>
              Balance as a share of total limit. Most issuers prefer under 30% for premium products. Usually the factor with
              the most headroom, because it responds within one statement cycle.
            </dd>
          </div>
          <div>
            <dt>Debt-to-income</dt>
            <dd>Existing EMIs against income. High obligations can fail an application that income alone would clear.</dd>
          </div>
          <div>
            <dt>Recent inquiries</dt>
            <dd>Several applications in a short window reads as credit-seeking behaviour, independent of your score.</dd>
          </div>
          <div>
            <dt>History length</dt>
            <dd>
              A thin file is not a bad file, but it limits what can be assessed. This is the one factor no action shortens.
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>What a soft check can and cannot tell you</h2>
        <p>
          Checking eligibility with Credlytic does not request a bureau inquiry, so it costs you nothing and leaves no trace
          on your file. What it produces is a fit estimate: how closely your profile matches what an issuer publishes.
        </p>
        <p>
          It cannot tell you the issuer&apos;s answer. Banks weigh internal signals — existing relationship, employer
          category, address history, bureau detail beyond the headline score — that no external tool can see. Treat a strong
          match as a well-founded reason to apply, not as a decision already made. The{" "}
          <Link href="/methodology">methodology</Link> sets out precisely which inputs are used and where the estimate stops.
        </p>
      </section>

      <section>
        <h2>Which factors are worth acting on</h2>
        <p>Ranked by how much they move, and how quickly.</p>
        <div className="content-table-scroll">
          <table className="content-table">
            <caption>Typical time for a change to appear on your bureau file.</caption>
            <thead>
              <tr>
                <th scope="col">Factor</th>
                <th scope="col">Action</th>
                <th scope="col">Visible in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Utilization</th>
                <td>Pay down balances before the statement date, not the due date</td>
                <td>1 cycle</td>
              </tr>
              <tr>
                <th scope="row">Recent inquiries</th>
                <td>Stop applying; let the window age</td>
                <td>3–6 months</td>
              </tr>
              <tr>
                <th scope="row">Debt-to-income</th>
                <td>Close a small loan, or wait out a tenure</td>
                <td>1–2 cycles after closure</td>
              </tr>
              <tr>
                <th scope="row">Payment history</th>
                <td>Nothing to fix if clean; a single miss takes time to fade</td>
                <td>12+ months</td>
              </tr>
              <tr>
                <th scope="row">History length</th>
                <td>No action shortens it</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The practical read: if utilization is your limiting factor, an application is worth delaying by one statement
          cycle. If history length is the constraint, waiting does not help and a card matched to a thinner file is the
          better move.
        </p>
      </section>

      <section>
        <h2>A sensible order of operations</h2>
        <ol>
          <li>Establish where you actually stand, rather than estimating from memory.</li>
          <li>Identify the single factor holding the best-fit cards out of reach.</li>
          <li>If it responds inside a cycle or two, fix it before applying.</li>
          <li>If it does not, apply for the card matched to your current profile instead of the one you want.</li>
          <li>Apply once, to the card with the strongest match.</li>
        </ol>
        <p>
          Step four is the one most people skip. Applying for a card two tiers above your profile and being declined leaves
          you worse placed for the card you would have been approved for.
        </p>
      </section>

      <section className="content-next">
        <h2>Next</h2>
        <Link href="/onboarding">
          Check your eligibility <span>Sample profile, no hard inquiry, no credit-score impact</span>
        </Link>
        <Link href="/cards">Browse cards <span>Fees, rewards and estimated value side by side</span></Link>
        <Link href="/methodology">Methodology <span>What a profile match means, and its limits</span></Link>
        <Link href="/editorial-policy">Editorial policy <span>How issuer criteria are sourced and reviewed</span></Link>
      </section>
    </ContentShell>
  );
}
