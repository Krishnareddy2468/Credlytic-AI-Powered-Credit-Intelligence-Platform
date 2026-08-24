import { LandingNav } from "@/components/landing/landing-nav";
import { SiteFooter } from "@/components/landing/site-footer";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";

/**
 * Shell for long-form public pages (methodology, editorial policy, guides).
 *
 * Reuses the marketing header/footer and the established band rhythm — dark
 * hero, paper prose body — rather than introducing a new layout. Prose sits on
 * paper because that is what the brand already uses for reading passages.
 */
export function ContentShell({
  breadcrumb,
  children,
  kicker,
  lede,
  reviewed,
  title
}: {
  breadcrumb: Array<{ name: string; path: string }>;
  children: React.ReactNode;
  kicker: string;
  lede: string;
  /** Review date. Long-form financial pages must state when they were last checked. */
  reviewed?: string;
  title: string;
}) {
  return (
    <div className="landing-page">
      <JsonLd data={breadcrumbSchema(breadcrumb)} id="ld-breadcrumb" />

      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <LandingNav />

      <main id="main-content">
        <header className="content-hero">
          <div className="landing-container">
            <p className="content-kicker">{kicker}</p>
            <h1>{title}</h1>
            <p className="content-lede">{lede}</p>
            {reviewed ? <p className="content-reviewed">Last reviewed {reviewed}</p> : null}
          </div>
        </header>

        <div className="content-body">
          <div className="landing-container content-prose">{children}</div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
