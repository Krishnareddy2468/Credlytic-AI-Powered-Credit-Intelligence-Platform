import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  CreditCard,
  FileSearch,
  Fingerprint,
  Gauge,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { CreditCardVisual, ProgressBar } from "@/components/product-ui";
import { creditCards } from "@/data/mock-cards";

const intelligence = [
  { icon: Gauge, label: "Eligibility", copy: "See profile-match confidence before choosing where to apply." },
  { icon: TrendingUp, label: "Card value", copy: "Estimate value using fees, rewards and your real spending pattern." },
  { icon: SearchCheck, label: "Policy intelligence", copy: "Understand issuer criteria through traceable policy context." },
  { icon: Bot, label: "Personal guidance", copy: "Turn complex credit factors into a practical next action." }
];

const process = [
  { number: "01", title: "Build your profile", copy: "Share only the financial signals needed for a useful assessment." },
  { number: "02", title: "Read the intelligence", copy: "See matches, trade-offs and the factors influencing each result." },
  { number: "03", title: "Choose your next move", copy: "Compare now, improve first or wait for a stronger application window." }
];

export default function Home() {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Link className="landing-brand" href="/">
          <span className="brand-symbol brand-symbol-light"><CreditCard aria-hidden="true" /></span>
          <span><strong>Credlytic</strong><small>Credit intelligence</small></span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="#intelligence">How it works</Link>
          <Link href="/cards">Explore cards</Link>
          <Link href="#trust">Security</Link>
        </nav>
        <div className="landing-nav-actions">
          <Link className="nav-login" href="/login">Sign in</Link>
          <Link className="button button-small button-primary" href="/onboarding">Check my eligibility<ArrowRight /></Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-copy landing-container">
          <div className="hero-kicker"><ShieldCheck aria-hidden="true" /> AI credit intelligence · No hard inquiry</div>
          <h1>Know your odds<br />before you apply.</h1>
          <p>Credlytic ranks credit cards by your approval likelihood and real value, explains what affects your match using current bank policy, and shows what to improve before you apply.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/onboarding">Check my eligibility<ArrowRight /></Link>
            <Link className="button button-secondary" href="/cards">Explore cards</Link>
          </div>
          <p className="hero-disclaimer"><LockKeyhole aria-hidden="true" /> No hard inquiry · No credit-score impact</p>
        </div>

        <div className="hero-intelligence" aria-label="Example eligibility intelligence">
          <div className="orbit-halo orbit-halo-one" />
          <div className="orbit-halo orbit-halo-two" />
          <div className="hero-signal-line" aria-hidden="true"><span /><i /></div>
          <div className="hero-profile-core">
            <span>Profile Strength</span>
            <strong><b>89</b><em>/100</em></strong>
            <small>Good standing</small>
          </div>
          <div className="hero-factor-note">
            <span>Primary factor</span>
            <strong>Utilization <b>38% ↓</b></strong>
          </div>
          <div className="hero-match hero-match-one">
            <CreditCardVisual bank="ICICI" name="Amazon Pay" network="Visa" tone="ink" compact />
            <span><b>92%</b> strong match</span>
          </div>
          <div className="hero-match hero-match-two">
            <CreditCardVisual bank="Axis" name="Ace" network="Visa" tone="blue" compact />
            <span><b>84%</b> good match</span>
          </div>
          <div className="hero-match hero-match-three">
            <CreditCardVisual bank="HDFC" name="Regalia Gold" network="Visa" tone="silver" compact />
            <span><b>67%</b> improve first</span>
          </div>
        </div>

        <div className="hero-proof landing-container">
          <div><strong>30+ cards</strong><span>ranked for your profile</span></div>
          <div><strong>₹14,400</strong><span>sample annual value identified</span></div>
          <div><strong>0 hard inquiries</strong><span>for the Credlytic eligibility check</span></div>
        </div>
      </section>

      <section className="problem-band">
        <div className="landing-container problem-layout">
          <p className="section-index">01 / The problem</p>
          <div>
            <h2>A credit-card application should not begin with a guess.</h2>
            <p>Issuer criteria are difficult to interpret, card benefits are hard to compare, and every unnecessary application can make the next decision harder.</p>
          </div>
          <div className="problem-stat"><span>Instead of</span><strong>Apply → wait → wonder</strong><ChevronRight aria-hidden="true" /><span>Credlytic helps you</span><strong>Understand → compare → decide</strong></div>
        </div>
      </section>

      <section className="landing-section" id="intelligence">
        <div className="landing-container">
          <div className="landing-section-head">
            <p className="section-index">02 / Credit intelligence</p>
            <h2>One decision, understood from every angle.</h2>
            <p>Credlytic combines your profile, spending priorities and issuer context into explanations you can act on.</p>
          </div>
          <div className="intelligence-grid">
            {intelligence.map((item, index) => {
              const Icon = item.icon;
              return <article key={item.label}><span className="intelligence-number">0{index + 1}</span><Icon aria-hidden="true" /><h3>{item.label}</h3><p>{item.copy}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="product-preview-band">
        <div className="landing-container preview-layout">
          <div className="preview-copy">
            <p className="section-index">03 / Product preview</p>
            <h2>Your credit position, without the noise.</h2>
            <p>See what is helping, what is holding you back, and the most useful next action in one calm workspace.</p>
            <ul>
              <li><Check aria-hidden="true" /> High-confidence matches, not endless offers</li>
              <li><Check aria-hidden="true" /> Clear reasons behind every recommendation</li>
              <li><Check aria-hidden="true" /> Prioritized improvement actions</li>
            </ul>
            <Link className="text-action" href="/dashboard">Explore the dashboard<ArrowRight /></Link>
          </div>
          <div className="dashboard-preview" aria-label="Credlytic dashboard preview">
            <div className="preview-top"><span><i /> Credlytic overview</span><small>Sample profile</small></div>
            <div className="preview-summary">
              <div className="score-preview"><span>Credit score</span><strong>742</strong><small>+11 this month</small></div>
              <div className="action-preview"><span>Recommended next action</span><strong>Lower utilization below 30%</strong><p>Pay ₹12,000 before your next statement to improve premium-card readiness.</p><div className="limiting-factor-preview"><span><b>Limiting factor</b><strong>Utilization · 38%</strong></span><ProgressBar label="Sample credit utilization" tone="warning" value={38} /></div></div>
            </div>
            <div className="preview-list">
              {creditCards.slice(0, 3).map((card) => (
                <div key={card.id}><CreditCardVisual bank={card.bank} name={card.name} network={card.network} tone={card.tone} compact /><span><strong>{card.name}</strong><small>{card.bank}</small></span><div><b>{card.match}%</b><ProgressBar value={card.match} tone={card.match > 80 ? "success" : "warning"} /></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-container">
          <div className="landing-section-head compact-head">
            <p className="section-index">04 / How it works</p>
            <h2>From profile to confident action.</h2>
          </div>
          <div className="process-grid">
            {process.map((item) => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="advisor-band">
        <div className="landing-container advisor-layout">
          <div className="advisor-demo">
            <div className="advisor-demo-head"><span><Sparkles aria-hidden="true" /> Credlytic Advisor</span><small>Grounded guidance</small></div>
            <div className="advisor-question">Why is my HDFC match only 67%?</div>
            <div className="advisor-answer">
              <span className="answer-label">Credlytic analysis</span>
              <p>Your travel spending supports the card’s value, but 38% utilization is above the preferred range for a premium application.</p>
              <div><TrendingUp aria-hidden="true" /><span><small>Recommended action</small><strong>Reduce utilization below 30%, then recheck.</strong></span></div>
            </div>
            <div className="advisor-source"><FileSearch aria-hidden="true" /><span><strong>Policy context</strong><small>HDFC product terms · reviewed Aug 2026</small></span></div>
          </div>
          <div className="advisor-copy">
            <p className="section-index">05 / Credlytic Advisor</p>
            <h2>Ask a financial question. Get an accountable answer.</h2>
            <p>Advice is separated into analysis, source context, recommended action and important limitations, so you can see how the answer was formed.</p>
            <Link className="button button-secondary" href="/advisor">Open Advisor<ArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="trust-section" id="trust">
        <div className="landing-container trust-layout">
          <div className="trust-copy"><p className="section-index">06 / Trust by behavior</p><h2>Your financial context deserves restraint.</h2><p>Credlytic is designed to collect less, explain more, and keep you in control of every sensitive input.</p></div>
          <div className="trust-points">
            <article><ShieldCheck /><div><h3>No hard inquiry</h3><p>Internal eligibility assessment does not request a bureau inquiry.</p></div></article>
            <article><Fingerprint /><div><h3>Clear data control</h3><p>Review, export or delete profile and report data from settings.</p></div></article>
            <article><FileSearch /><div><h3>Traceable context</h3><p>Policy-grounded guidance shows the source and its review date.</p></div></article>
          </div>
        </div>
      </section>

      <section className="landing-final">
        <div className="landing-container final-inner">
          <span className="final-mark"><BarChart3 /></span>
          <h2>Make your next credit decision with context.</h2>
          <p>Start with a private sample profile. No hard inquiry · No credit-score impact.</p>
          <div><Link className="button button-primary" href="/onboarding">Check my eligibility<ArrowRight /></Link><Link className="button button-secondary" href="/cards">Explore cards</Link></div>
        </div>
      </section>

      <footer className="landing-footer landing-container">
        <Link className="landing-brand" href="/"><span className="brand-symbol brand-symbol-light"><CreditCard /></span><span><strong>Credlytic</strong><small>Credit intelligence for better decisions</small></span></Link>
        <p>Prototype experience · Not financial advice · Issuer approval remains final</p>
        <div><Link href="/settings">Privacy</Link><Link href="/settings">Terms</Link><Link href="/login">Sign in</Link></div>
      </footer>
    </main>
  );
}
