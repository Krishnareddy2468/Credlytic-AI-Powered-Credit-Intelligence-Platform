import type { Metadata } from "next";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { ContentShell } from "@/components/content/content-shell";
import { buildMetadata } from "@/lib/seo";
import { contact } from "@/data/company";
import "../landing.css";
import "../content.css";

export const metadata: Metadata = buildMetadata({
  description:
    "How Credlytic researches and reviews credit-card information: sources used, review cadence, how corrections are handled, and why commercial arrangements do not affect card rankings.",
  path: "/editorial-policy",
  title: "Editorial Policy — How We Research Card Data"
});

export default function EditorialPolicyPage() {
  return (
    <ContentShell
      breadcrumb={[
        { name: "Home", path: "/" },
        { name: "Editorial policy", path: "/editorial-policy" }
      ]}
      kicker="Editorial policy"
      lede="Credlytic publishes numbers people use to make financial decisions. This page states where those numbers come from, how often they are checked, how mistakes get fixed, and what commercial arrangements can and cannot influence."
      reviewed="August 2026"
      title="How we research, review and correct card information."
    >
      <section>
        <h2>Sources, in order of preference</h2>
        <ol>
          <li>
            <strong>Issuer documents.</strong> Most Important Terms and Conditions, fee schedules, reward programme terms
            and published eligibility pages. These are the primary source for every fee, rate, cap and criterion.
          </li>
          <li>
            <strong>Regulator publications.</strong> RBI master directions and circulars, for rules that apply across
            issuers rather than to one card.
          </li>
          <li>
            <strong>Issuer confirmation.</strong> Where a document is ambiguous, we prefer to leave a field marked
            unverified over interpreting it.
          </li>
        </ol>
        <p>
          Comparison sites, blogs and aggregator listings are not used as sources. They are frequently stale, and a figure
          copied from a copy cannot be traced back to anything.
        </p>
      </section>

      <section>
        <h2>What gets published, and what does not</h2>
        <p>
          A card field is published when it can be pointed at a source document. Where it cannot, the page says so rather
          than filling the gap. In practice this means Credlytic pages sometimes show fewer numbers than competing pages —
          the missing ones are the ones nobody can substantiate.
        </p>
        <p>
          Language matters here. Verified criteria are stated directly. Anything read from a document that may have changed
          is attributed: <em>&ldquo;according to the currently reviewed issuer information&rdquo;</em>, with the review date
          attached.
        </p>
      </section>

      <section>
        <h2>Review cadence</h2>
        <dl className="content-defs">
          <div>
            <dt>Fees and criteria</dt>
            <dd>Reviewed each quarter, and whenever an issuer announces a change.</dd>
          </div>
          <div>
            <dt>Reward rates and caps</dt>
            <dd>Reviewed each quarter. These change more often than fees and are the most common source of stale data.</dd>
          </div>
          <div>
            <dt>Regulatory context</dt>
            <dd>Reviewed when the RBI publishes a relevant direction or amendment.</dd>
          </div>
          <div>
            <dt>Every page</dt>
            <dd>Carries the date of its last review. If the date looks old, treat the figures as unconfirmed.</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>Corrections</h2>
        <p>
          If a figure on this site is wrong, we want to know. Send the card, the field and — where you have it — the issuer
          document that contradicts us
          {contact.email ? (
            <>
              , to <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </>
          ) : null}
          .
        </p>
        <p>
          Corrections are made to the page, and the review date is updated so the change is visible rather than silent. We
          do not remove the fact that a page was wrong.
        </p>
      </section>

      <section>
        <h2>Commercial arrangements</h2>
        <p>
          Credlytic is free to use. The intended revenue model is a referral fee paid by an issuer when an application
          succeeds, alongside a paid tier. Both are disclosed rather than buried.
        </p>
        <div className="content-note" data-tone="caution">
          <CircleAlert aria-hidden="true" />
          <p>
            <strong>Commercial arrangements do not affect ranking.</strong> Results are ordered by approval confidence and
            estimated value against your spending. A referral fee cannot move a card up a list, and no card is included or
            excluded on commercial grounds. Where the highest-paying card is not the best fit, the page says so.
          </p>
        </div>
        <p>
          This is the specific failure of commission-ranked comparison sites, and the reason ranking inputs are documented
          in the <Link href="/methodology">methodology</Link> rather than left implicit.
        </p>
      </section>

      <section>
        <h2>What we will not publish</h2>
        <ul>
          <li>Ratings, scores or star counts that no one actually assigned.</li>
          <li>Reviews or testimonials that were not written by a real user.</li>
          <li>Approval guarantees, or any suggestion that an issuer has pre-approved you.</li>
          <li>Certifications, licences or partnerships we do not hold.</li>
          <li>Sponsored placement presented as an editorial recommendation.</li>
        </ul>
      </section>

      <section className="content-next">
        <h2>Related</h2>
        <Link href="/methodology">Methodology <span>How eligibility confidence and card value are estimated</span></Link>
        <Link href="/about">About Credlytic <span>What the product does and who builds it</span></Link>
        <Link href="/contact">Contact <span>Corrections, press and general enquiries</span></Link>
      </section>
    </ContentShell>
  );
}
