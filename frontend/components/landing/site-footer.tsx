import Link from "next/link";
import { BrandLockup } from "@/components/landing/brand-lockup";
import { company, contact } from "@/data/company";

/**
 * Shared marketing footer. Extracted when the About page was added so the two
 * marketing pages cannot drift apart.
 */
export function SiteFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer-inner">
        <div className="landing-footer-brand">
          <Link aria-label="Credlytic home" href="/">
            <BrandLockup size="footer" />
          </Link>
          <p className="landing-footer-entity">
            A product of {company.legalEntity}
          </p>
        </div>
        <p>Prototype experience · Not financial advice · Issuer approval remains final</p>
        {/*
          Privacy and Terms previously pointed at /settings, which is not those
          documents. Dead-ended legal links are worse than absent ones on a
          financial product, so they are withheld until the real pages exist.
        */}
        <nav aria-label="Footer">
          <Link href="/about">About</Link>
          {contact.email ? <a href={`mailto:${contact.email}`}>Contact</a> : null}
          <Link href="/login">Sign in</Link>
        </nav>
      </div>
    </footer>
  );
}
