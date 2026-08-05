import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * The blanket allow is a deliberate AI-crawler policy, not an oversight
 * (client decision, 2026-08-05): search-facing bots (OAI-SearchBot,
 * Claude-SearchBot, PerplexityBot, Googlebot) are how the site enters AI
 * answers, and training bots (GPTBot, ClaudeBot, Google-Extended, CCBot) are
 * how the brand becomes an entity future models know without searching.
 * Blocking any of them costs discovery this site exists to win. Bytespider
 * ignores robots.txt anyway, so listing it would be theater. `/_next/image`
 * must stay crawlable or Google Images loses every optimized rendition.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/styleguide"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
