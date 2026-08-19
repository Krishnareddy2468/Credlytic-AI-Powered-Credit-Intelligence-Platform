import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import { company, contact } from "@/data/company";

/**
 * Renders a JSON-LD block.
 *
 * Every schema below describes only what is visible on the page and verifiable.
 * No AggregateRating, Review, award, user-count or partnership markup is emitted
 * — fabricating those is both a Google spam violation and, for a financial
 * product, a misrepresentation.
 */
export function JsonLd({ data, id }: { data: Record<string, unknown>; id: string }) {
  return (
    <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} id={id} type="application/ld+json" />
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/brand/lockup.png"),
      width: 705,
      height: 200
    },
    description: company.mission,
    slogan: company.oneLiner,
    areaServed: { "@type": "Country", name: "India" },
    parentOrganization: { "@type": "Organization", name: company.legalEntity },
    ...(contact.email
      ? {
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: contact.email,
              areaServed: "IN",
              availableLanguage: ["English"]
            }
          ]
        }
      : {})
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: company.mission,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#organization` }
    // No SearchAction: the site has no public search endpoint, and declaring one
    // that does not exist is a common structured-data error.
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}
