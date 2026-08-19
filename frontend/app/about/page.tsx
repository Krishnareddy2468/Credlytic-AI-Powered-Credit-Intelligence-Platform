import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Globe, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingSectionHead } from "@/components/landing/section-head";
import { Reveal } from "@/components/landing/reveal";
import { SiteFooter } from "@/components/landing/site-footer";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import {
  company,
  contact,
  layers,
  marketStats,
  penetrationGap,
  principles,
  problems,
  roadmap
} from "@/data/company";
import "../landing.css";
import "./about.css";

export const metadata: Metadata = buildMetadata({
  description: `Credlytic is a credit intelligence platform for India, built by ${company.legalEntity}. How eligibility confidence is estimated, how issuer policy is reviewed, and how results are ranked.`,
  path: "/about",
  title: "About Credlytic — Credit Intelligence for India"
});

/** Only render contact rows that have actually been filled in. */
const contactRows = [
  { icon: Mail, label: "General enquiries", value: contact.email, href: `mailto:${contact.email}` },
  { icon: Mail, label: "Press", value: contact.press, href: `mailto:${contact.press}` },
  { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Registered office", value: contact.address, href: undefined },
  { icon: Globe, label: "LinkedIn", value: contact.linkedin, href: contact.linkedin }
].filter((row) => row.value.length > 0);

export default function AboutPage() {
  return (
    <div className="landing-page">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" }
        ])}
        id="ld-breadcrumb-about"
      />
      <noscript>
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <LandingNav />

      <main id="main-content">
        <section className="about-hero">
          <div className="landing-container">
            <p className="hero-kicker">
              <ShieldCheck aria-hidden="true" /> About Credlytic
            </p>
            <h1>Credit decisions should start with information.</h1>
            <p className="about-hero-lede">{company.mission}</p>
            <p className="about-hero-entity">
              {company.name} is a product of {company.legalEntity}
            </p>
          </div>
        </section>

        <section className="about-paper">
          <div className="landing-container">
            <LandingSectionHead
              index="01"
              label="Why Credlytic exists"
              lede={
                <p>
                  A rejected application costs 10–30 CIBIL points. Three rejections inside six months can take 50–90
                  points off a score — leaving someone further from approval than when they started.
                </p>
              }
              title="Applying should not be the way you find out."
            />
            <ol className="about-problems">
              {problems.map((problem, index) => (
                <Reveal as="li" delay={index * 70} key={problem.number}>
                  <span>{problem.number}</span>
                  <div>
                    <h3>{problem.title}</h3>
                    <p>{problem.copy}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container">
            <LandingSectionHead
              index="02"
              label="How it works"
              support={<p>Three layers, each answerable for a different part of the decision.</p>}
              title="Intelligence before application."
            />
            <ol className="about-layers">
              {layers.map((layer, index) => (
                <Reveal as="li" delay={index * 90} key={layer.index}>
                  <p className="about-layer-index">{layer.index}</p>
                  <h3>{layer.title}</h3>
                  <p className="about-layer-copy">{layer.copy}</p>
                  <p className="about-layer-detail">{layer.detail}</p>
                </Reveal>
              ))}
            </ol>
            <p className="about-status">
              Credlytic is in active development. The experience published here runs on illustrative sample data, and
              every figure in the interface is labelled as such.
            </p>
          </div>
        </section>

        <section className="about-paper">
          <div className="landing-container">
            <LandingSectionHead
              index="03"
              label="Market"
              lede={
                <p>
                  India has more than 118 million credit cards in circulation, yet only a quarter of credit-active
                  consumers hold one. The gap is not demand — it is information.
                </p>
              }
              title="A market growing faster than its guidance."
            />
            <dl className="about-stats">
              {marketStats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                  <dd className="about-stat-source">{stat.source}</dd>
                </div>
              ))}
            </dl>

            <div className="about-gap">
              <h3>Credit-card penetration</h3>
              <ul>
                {penetrationGap.map((row) => (
                  <li key={row.market}>
                    <span className="about-gap-market">{row.market}</span>
                    <span className="about-gap-track">
                      <span className="about-gap-fill" data-focus={row.market === "India"} style={{ width: `${row.value}%` }} />
                    </span>
                    <span className="about-gap-value">{row.value}%</span>
                  </li>
                ))}
              </ul>
              <p className="about-gap-source">Source: TransUnion CIBIL, 2026. Comparison markets per published national figures.</p>
            </div>
          </div>
        </section>

        <section className="landing-section" id="principles">
          <div className="landing-container">
            <LandingSectionHead
              index="04"
              label="How we operate"
              support={
                <p>
                  Credlytic is free to use. Issuers pay a referral fee when an application succeeds, and a paid tier is
                  planned. Neither changes how results are ordered.
                </p>
              }
              title="What we will and will not do."
            />
            <ul className="about-principles">
              {principles.map((principle, index) => (
                <Reveal as="li" delay={index * 80} key={principle.title}>
                  <h3>{principle.title}</h3>
                  <p>{principle.copy}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="about-paper">
          <div className="landing-container">
            <LandingSectionHead index="05" label="Roadmap" title="India first. Then wider." />
            <ol className="about-roadmap">
              {roadmap.map((phase, index) => (
                <Reveal as="li" data-current={phase.current ? "true" : "false"} delay={index * 70} key={phase.phase}>
                  <div className="about-phase-head">
                    <span className="about-phase-name">{phase.phase}</span>
                    <span className="about-phase-window">{phase.window}</span>
                    {phase.current ? <span className="about-phase-badge">Current</span> : null}
                  </div>
                  <h3>{phase.title}</h3>
                  <ul>
                    {phase.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="landing-section" id="contact">
          <div className="landing-container">
            <LandingSectionHead
              index="06"
              label="Company"
              support={<p>{company.vision}</p>}
              title={`${company.name}, a product of ${company.legalEntity}.`}
            />

            <div className="about-company">
              <dl className="about-company-facts">
                <div>
                  <dt>
                    <Building2 aria-hidden="true" /> Entity
                  </dt>
                  <dd>{company.legalEntity}</dd>
                </div>
                <div>
                  <dt>
                    <Globe aria-hidden="true" /> Website
                  </dt>
                  <dd>
                    <a href={`https://${company.domain}`} rel="noreferrer" target="_blank">
                      {company.domain}
                    </a>
                    <small>Operating in {company.market}</small>
                  </dd>
                </div>
              </dl>

              <div className="about-contact">
                <h3>Contact</h3>
                {contactRows.length > 0 ? (
                  <dl className="about-contact-rows">
                    {contactRows.map((row) => {
                      const Icon = row.icon;
                      return (
                        <div key={row.label}>
                          <dt>
                            <Icon aria-hidden="true" /> {row.label}
                          </dt>
                          <dd>{row.href ? <a href={row.href}>{row.value}</a> : row.value}</dd>
                        </div>
                      );
                    })}
                  </dl>
                ) : (
                  <p className="about-contact-fallback">
                    Reach us through <a href={`https://${company.domain}`} rel="noreferrer" target="_blank">{company.domain}</a>.
                    Direct contact channels are published as they open.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-final">
          <Reveal className="landing-container final-inner">
            <h2>See what Credlytic tells you.</h2>
            <p>Start with a private sample profile. No hard inquiry · No credit-score impact.</p>
            <div className="final-actions">
              <Link className="button button-primary" href="/onboarding">
                Check my eligibility
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button button-secondary" href="/cards">
                Explore cards
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
