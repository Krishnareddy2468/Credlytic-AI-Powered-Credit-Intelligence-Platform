import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/content/content-shell";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { company, contact } from "@/data/company";
import "../landing.css";
import "../content.css";

export const metadata: Metadata = buildMetadata({
  description: `Contact Credlytic — a product of ${company.legalEntity}. Corrections to card information, press enquiries, and general questions.`,
  path: "/contact",
  title: "Contact Credlytic"
});

export default function ContactPage() {
  return (
    <ContentShell
      breadcrumb={[
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" }
      ]}
      kicker="Contact"
      lede="One address, read by the people who build the product. Corrections to card data are the most useful thing you can send us."
      title="Contact Credlytic."
    >
      <section>
        <h2>Get in touch</h2>
        <dl className="content-defs">
          {contact.email ? (
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
          ) : null}
          <div>
            <dt>Entity</dt>
            <dd>{company.legalEntity}</dd>
          </div>
          <div>
            <dt>Operating market</dt>
            <dd>{company.market}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>
              <a href={absoluteUrl("/")} rel="noreferrer" target="_blank">
                {company.domain}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>What to send</h2>
        <h3>A correction</h3>
        <p>
          The most valuable message we receive. Include the card, the field that is wrong, and the issuer document that
          contradicts us if you have it. Corrections are applied to the page and the review date is updated — see the{" "}
          <Link href="/editorial-policy">editorial policy</Link>.
        </p>
        <h3>A question about a result</h3>
        <p>
          If a profile match or value estimate does not look right, tell us which card and what you expected. Note that
          Credlytic estimates fit from published criteria and cannot see an issuer&apos;s internal decision — the{" "}
          <Link href="/methodology">methodology</Link> sets out exactly what the number does and does not cover.
        </p>
        <h3>Press</h3>
        <p>Use the same address and mention the outlet and your deadline.</p>
      </section>

      <section>
        <h2>What we cannot help with</h2>
        <ul>
          <li>
            <strong>The status of an application.</strong> Credlytic is not an issuer and has no visibility into any
            application. Your bank is the only source for that.
          </li>
          <li>
            <strong>Disputes on your credit report.</strong> Those go through the bureau that issued the report.
          </li>
          <li>
            <strong>Individual financial advice.</strong> Credlytic publishes information and estimates; it is not a
            licensed adviser and cannot recommend a course of action for your circumstances.
          </li>
        </ul>
      </section>

      <section className="content-next">
        <h2>Before you write</h2>
        <Link href="/methodology">Methodology <span>What a profile match means, and its limits</span></Link>
        <Link href="/editorial-policy">Editorial policy <span>Sources, review cadence and corrections</span></Link>
        <Link href="/about">About Credlytic <span>What the product does and who builds it</span></Link>
      </section>
    </ContentShell>
  );
}
