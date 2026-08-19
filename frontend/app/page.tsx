import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  CircleAlert,
  FileSearch,
  Fingerprint,
  Gauge,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { EligibilityOrbit } from "@/components/landing/eligibility-orbit";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingProductPreview } from "@/components/landing/product-preview";
import { LandingSectionHead } from "@/components/landing/section-head";
import { SiteFooter } from "@/components/landing/site-footer";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { Reveal } from "@/components/landing/reveal";
import {
  landingAdvisorExchange,
  landingIntelligence,
  landingProcess,
  landingProof,
  landingTrustPoints
} from "@/data/landing.mock";
import "./landing.css";

// The homepage canonical lives here rather than in the root layout, so child
// routes do not inherit it.
export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") }
};

const pillarIcons = [Gauge, TrendingUp, SearchCheck, Bot];
const trustIcons = [ShieldCheck, Fingerprint, FileSearch];

const contrast = [
  {
    tone: "before" as const,
    label: "Without Credlytic",
    steps: ["Choose a card from an advert", "Apply, and accept a hard inquiry", "Wait for a decision nobody explains"]
  },
  {
    tone: "after" as const,
    label: "With Credlytic",
    steps: ["See your match and the factors behind it", "Fix the one factor holding you back", "Apply once, with context"]
  }
];

export default function Home() {
  return (
    <div className="landing-page">
      <JsonLd data={organizationSchema()} id="ld-organization" />
      <JsonLd data={websiteSchema()} id="ld-website" />
      <noscript>
        {/* Reveal animations are progressive enhancement; never let them hide content. */}
        <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <LandingNav />

      <main id="main-content">
        <section className="landing-hero">
          <div className="landing-container hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">
                <ShieldCheck aria-hidden="true" /> Credit intelligence · No hard inquiry
              </p>
              <h1>
                Know your odds
                <br />
                before you apply.
              </h1>
              <p className="hero-lede">
                Credlytic ranks credit cards by your approval likelihood and real value, explains what affects your match using current
                issuer policy, and shows what to improve before you apply.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary" href="/onboarding">
                  Check my eligibility
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link className="button button-secondary" href="/cards">
                  Explore cards
                </Link>
              </div>
              <p className="hero-disclaimer">
                <LockKeyhole aria-hidden="true" /> No hard inquiry · No credit-score impact · Issuer approval remains final
              </p>
            </div>

            <div className="hero-visual">
              <EligibilityOrbit />
            </div>
          </div>

          <div className="hero-proof landing-container">
            {landingProof.map((stat) => (
              <div key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="problem-band">
          <div className="landing-container">
            <LandingSectionHead
              index="01"
              label="The problem"
              lede={
                <p>
                  Issuer criteria are difficult to interpret, card benefits are hard to compare, and every unnecessary application makes
                  the next decision harder.
                </p>
              }
              support={
                <Reveal className="problem-contrast" delay={120}>
                  {contrast.map((column, index) => (
                    <div key={column.tone}>
                      {index === 1 ? (
                        <p className="problem-contrast-divider" aria-hidden="true">
                          <span />
                          <ArrowDown />
                          <span />
                        </p>
                      ) : null}
                      <div className="problem-contrast-block" data-tone={column.tone}>
                        <p className="problem-contrast-label">{column.label}</p>
                        <ol>
                          {column.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </Reveal>
              }
              title="A credit-card application should not begin with a guess."
            />
          </div>
        </section>

        <section className="landing-section" id="intelligence">
          <div className="landing-container">
            <LandingSectionHead
              index="02"
              label="Credit intelligence"
              support={
                <p>Credlytic combines your profile, spending priorities and issuer context into explanations you can act on.</p>
              }
              title="One decision, understood from every angle."
            />

            <ul className="intelligence-grid">
              {landingIntelligence.map((pillar, index) => {
                const Icon = pillarIcons[index];
                return (
                  <Reveal as="li" delay={index * 90} key={pillar.id}>
                    <span className="intelligence-number">0{index + 1}</span>
                    <Icon aria-hidden="true" />
                    <h3>{pillar.label}</h3>
                    <p>{pillar.copy}</p>
                    <p className="intelligence-answers">{pillar.answers}</p>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="product-preview-band">
          <div className="landing-container preview-layout">
            <div className="preview-copy">
              <LandingSectionHead
                index="03"
                label="Product preview"
                lede={<p>See what is helping, what is holding you back, and the most useful next action in one calm workspace.</p>}
                title="Your credit position, without the noise."
                variant="stacked"
              />
              <ul className="preview-highlights">
                <li>
                  <Check aria-hidden="true" /> High-confidence matches, not endless offers
                </li>
                <li>
                  <Check aria-hidden="true" /> A stated reason behind every recommendation
                </li>
                <li>
                  <Check aria-hidden="true" /> Improvement actions ranked by real impact
                </li>
              </ul>
              <Link className="text-action" href="/dashboard">
                Explore the dashboard
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <Reveal className="preview-frame" delay={120}>
              <LandingProductPreview />
            </Reveal>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container">
            <LandingSectionHead index="04" label="How it works" title="From profile to confident action." />
            <ol className="process-grid">
              {landingProcess.map((step, index) => (
                <Reveal as="li" delay={index * 90} key={step.number}>
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="advisor-band" id="advisor">
          <div className="landing-container advisor-layout">
            <Reveal className="advisor-demo">
              <div className="advisor-demo-head">
                <span>
                  <Sparkles aria-hidden="true" /> Credlytic Advisor
                </span>
                <small>Grounded guidance</small>
              </div>

              <p className="advisor-question">{landingAdvisorExchange.question}</p>

              <div className="advisor-answer">
                <div className="advisor-block">
                  <p className="advisor-block-label advisor-label-analysis">Credlytic analysis</p>
                  <p className="advisor-block-body">{landingAdvisorExchange.analysis}</p>
                </div>

                <div className="advisor-block advisor-block-inline" data-tone="action">
                  <TrendingUp aria-hidden="true" />
                  <div>
                    <p className="advisor-block-label">Recommended action</p>
                    <strong>{landingAdvisorExchange.action}</strong>
                    <small>{landingAdvisorExchange.actionImpact}</small>
                  </div>
                </div>

                <div className="advisor-block advisor-block-inline" data-tone="limit">
                  <CircleAlert aria-hidden="true" />
                  <div>
                    <p className="advisor-block-label">Important limitation</p>
                    <p className="advisor-block-body">{landingAdvisorExchange.limitation}</p>
                  </div>
                </div>

                <Link className="advisor-citation" href="/advisor">
                  <FileSearch aria-hidden="true" />
                  <span>
                    <strong>{landingAdvisorExchange.source.title}</strong>
                    <small>{landingAdvisorExchange.source.detail}</small>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <div className="advisor-copy">
              <LandingSectionHead
                index="05"
                label="Credlytic Advisor"
                lede={
                  <p>
                    Every answer separates analysis, recommended action, important limitations and the policy it relies on, so you can
                    see how the conclusion was formed.
                  </p>
                }
                title="Ask a financial question. Get an accountable answer."
                variant="stacked"
              />
              <Link className="button button-secondary" href="/advisor">
                Open Advisor
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="trust-section" id="trust">
          <div className="landing-container trust-layout">
            <div className="trust-copy">
              <LandingSectionHead
                index="06"
                label="Trust by behaviour"
                lede={<p>Credlytic is designed to collect less, explain more, and keep you in control of every sensitive input.</p>}
                title="Your financial context deserves restraint."
                variant="stacked"
              />
            </div>
            <ul className="trust-points">
              {landingTrustPoints.map((point, index) => {
                const Icon = trustIcons[index];
                return (
                  <Reveal as="li" delay={index * 90} key={point.id}>
                    <Icon aria-hidden="true" />
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.copy}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="landing-final">
          <Reveal className="landing-container final-inner">
            <span className="final-mark" aria-hidden="true">
              <BarChart3 />
            </span>
            <h2>Make your next credit decision with context.</h2>
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
