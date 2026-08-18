import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { BrandLockup } from "@/components/landing/brand-lockup";
import { SignInForm } from "@/components/auth/sign-in-form";
import { signInHighlights } from "@/data/landing.mock";
import "./login.css";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Credlytic workspace, or open the demo dashboard."
};

export default function LoginPage() {
  return (
    <main className="signin-page">
      <aside className="signin-aside">
        <Link aria-label="Credlytic home" className="signin-brand" href="/">
          <BrandLockup />
        </Link>

        <div className="signin-aside-body">
          <h2>Credit intelligence before you apply.</h2>
          <p>
            Understand your eligibility, compare what each card is actually worth against your spending, and see the
            single change that improves your position most.
          </p>
          <dl className="signin-aside-stats">
            {signInHighlights.map((item) => (
              <div key={item.value}>
                <dt>{item.value}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="signin-aside-foot">Prototype experience · Not financial advice · Issuer approval remains final</p>
      </aside>

      <section className="signin-panel">
        <Link className="signin-back" href="/">
          <ArrowLeft aria-hidden="true" />
          Back to home
        </Link>
        <Suspense fallback={<div className="signin-form-wrap" />}>
          <SignInForm />
        </Suspense>
      </section>
    </main>
  );
}
