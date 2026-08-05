import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Pre-rebrand service slugs still circulating in old links and search
    // results; send them to the services index instead of a 404.
    return [
      "full-renovation",
      "kitchen-bath",
      "additions-adu",
      "historic-restoration",
    ].map((slug) => ({
      source: `/services/${slug}`,
      destination: "/services",
      permanent: true,
    }));
  },
  images: {
    // Required from Next.js 16: an unrestricted quality list would let anyone
    // ask the optimizer for arbitrary renditions.
    // Frozen once live: qualities and size lists are encoded into every
    // /_next/image URL, so changing them re-mints each image URL sitewide and
    // Google re-indexes images slowly enough to cost real traffic.
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
