import "server-only";

import type { Graph, Thing } from "schema-dts";

import type { Service } from "@/content/services";
import { site } from "@/lib/site";

/**
 * JSON-LD builders for the site-wide schema graph. Server-only on purpose:
 * the graph ships in the server-rendered HTML because no major AI crawler
 * executes JavaScript, and none of this belongs in a client bundle.
 *
 * Shape: one `@graph` per page, nodes stitched by stable `@id` anchors so
 * parsers assemble a single site-wide entity across routes. The org and
 * website nodes render once from the (site) layout; routes add their own
 * WebPage/BreadcrumbList/Service nodes through the builders below.
 */

type GraphNode = Exclude<Graph["@graph"][number], string>;

export const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;

/** Resolves a route path against the canonical origin; absolute URLs pass through. */
export const absoluteUrl = (path: string) => new URL(path, site.url).href;

/**
 * areaServed mirrors exactly what the coverage band claims — the region,
 * nothing finer. Widening this to named counties requires the site copy to
 * claim them first.
 */
const areaServed = {
  "@type": "AdministrativeArea",
  name: "Southern California",
} as const;

export function organizationNode(): GraphNode {
  const { contact } = site;

  return {
    // Multi-typed so parsers matching the literal "LocalBusiness" string
    // still recognize the node; GeneralContractor is the specific subtype.
    // schema-dts models a single @type, hence the cast.
    "@type": ["GeneralContractor", "LocalBusiness"] as unknown as "GeneralContractor",
    "@id": organizationId,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: `${site.url}/`,
    logo: absoluteUrl("/apple-icon"),
    telephone: contact.phoneHref.replace("tel:", ""),
    email: contact.email,
    ...(contact.address.street
      ? {
          address: {
            "@type": "PostalAddress" as const,
            streetAddress: contact.address.street,
            addressLocality: contact.address.city,
            addressRegion: contact.address.state,
            postalCode: contact.address.zip,
            addressCountry: "US",
          },
        }
      : {}),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...contact.officeHours.days],
      opens: contact.officeHours.opens,
      closes: contact.officeHours.closes,
    },
    areaServed,
    // CSLB number: same render-guard contract as the footer and /licenses.
    ...(site.license
      ? {
          identifier: {
            "@type": "PropertyValue" as const,
            propertyID: "CSLB",
            value: site.license,
          },
        }
      : {}),
    ...(site.profiles.length ? { sameAs: [...site.profiles] } : {}),
  };
}

/** Locks the SERP site-name line. Never carries a SearchAction: the sitelinks search box was retired in 2024. */
export function websiteNode(): GraphNode {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${site.url}/`,
    name: site.name,
    alternateName: site.shortName,
    publisher: { "@id": organizationId },
  };
}

type WebPageOptions = {
  path: string;
  title: string;
  description: string;
  /** Schema subtype where one exists (AboutPage, ContactPage, FAQPage…). */
  type?: "WebPage" | "AboutPage" | "ContactPage" | "FAQPage" | "CollectionPage";
  /** Extra properties merged into the node (e.g. FAQPage mainEntity). */
  extra?: Record<string, Thing | readonly Thing[]>;
};

export function webPageNode({
  path,
  title,
  description,
  type = "WebPage",
  extra,
}: WebPageOptions): GraphNode {
  const url = absoluteUrl(path);
  return {
    "@type": type,
    "@id": url,
    url,
    name: title,
    description,
    isPartOf: { "@id": websiteId },
    ...extra,
  };
}

/**
 * BreadcrumbList for the SERP trail — schema only, no visible UI; the last
 * item names the current page and carries no link per Google's convention.
 */
export function breadcrumbNode(
  path: string,
  trail: readonly { name: string; path?: string }[],
): GraphNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}

/** The machine-readable "what we do, where" layer AI engines filter on; no rich result exists for Service and none is expected. */
export function serviceNode(service: Pick<Service, "slug" | "title" | "summary">): GraphNode {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    provider: { "@id": organizationId },
    areaServed,
  };
}

export function faqMainEntity(
  faqs: readonly { question: string; answer: string }[],
): { mainEntity: readonly Thing[] } {
  return {
    mainEntity: faqs.map((faq) => ({
      "@type": "Question" as const,
      name: faq.question,
      acceptedAnswer: { "@type": "Answer" as const, text: faq.answer },
    })),
  };
}

/**
 * Renders one @graph script. Native script tag, not next/script: JSON-LD is
 * data, not executable code. `<` is escaped so page-sourced strings can never
 * break out of the tag.
 */
export function JsonLd({ graph }: { graph: readonly GraphNode[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  } satisfies Graph).replace(/</g, "\\u003c");

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
