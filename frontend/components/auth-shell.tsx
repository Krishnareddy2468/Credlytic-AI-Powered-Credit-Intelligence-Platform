import Link from "next/link";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";

export function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <header className="auth-header"><Link className="landing-brand" href="/"><span className="brand-symbol brand-symbol-light"><CreditCard /></span><span><strong>Credlytic</strong><small>Credit intelligence</small></span></Link><Link href="/">Back to home</Link></header>
      <div className="auth-layout">
        <section className="auth-story"><p className="eyebrow">Private credit intelligence</p><h1>Make the decision before the application.</h1><p>Build a financial profile once, then understand eligibility, card value and the clearest next action.</p><div className="auth-trust-list"><span><ShieldCheck /><b>No credit-score impact</b></span><span><LockKeyhole /><b>Privacy-first profile controls</b></span></div><div className="auth-quote"><p>“Credlytic should tell me whether applying now makes sense—not simply show me another card.”</p><span>Product principle</span></div></section>
        <section className="auth-form-wrap"><div className="auth-form-head"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div>{children}</section>
      </div>
    </main>
  );
}
