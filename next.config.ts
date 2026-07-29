import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Pre-rebrand service slugs still circulating in old links and search
    // results; send them to the services index instead of a 404.
    const legacyServiceRedirects = [
      "full-renovation",
      "kitchen-bath",
      "additions-adu",
      "historic-restoration",
    ].map((slug) => ({
      source: `/services/${slug}`,
      destination: "/services",
      permanent: true,
    }));

    return [
      // Humans opening /sitemap.xml in a browser (Accept lists text/html) land
      // on the designed /sitemap page; crawlers send Accept: */* and fall
      // through to the XML from app/sitemap.ts. Next compiles `value` into an
      // anchored regex, hence the wildcards. 307 on purpose: an Accept-driven
      // redirect must never be cached as permanent.
      {
        source: "/sitemap.xml",
        has: [{ type: "header", key: "accept", value: ".*text/html.*" }],
        destination: "/sitemap",
        permanent: false,
      },
      ...legacyServiceRedirects,
    ];
  },
  images: {
    // Required from Next.js 16: an unrestricted quality list would let anyone
    // ask the optimizer for arbitrary renditions.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    // Temporary Unsplash placeholder photography; swap for the real
    // project-photo host when assets land. Object form on purpose: a URL
    // pattern pins `search: ""`, which rejects Unsplash's ?q=&w= params.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    // React <ViewTransition> route crossfade. Full revert: delete this key,
    // the wrapper in app/(site)/layout.tsx and the ::view-transition block
    // in globals.css.
    viewTransition: true,
  },
};

export default nextConfig;
