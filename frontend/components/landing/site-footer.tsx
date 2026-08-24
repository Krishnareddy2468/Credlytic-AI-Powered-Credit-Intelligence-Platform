import Link from "next/link";
import { BrandLockup } from "@/components/landing/brand-lockup";
import { company } from "@/data/company";

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
<nav aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/editorial-policy">Editorial policy</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
