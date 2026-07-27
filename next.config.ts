import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Pre-rebrand service slugs still circulating in old links and search
    // results; send them to the services index instead of a 404.
    return ["full-renovation", "kitchen-bath", "additions-adu", "historic-restoration"].map(
      (slug) => ({
        source: `/services/${slug}`,
        destination: "/services",
        permanent: true,
      }),
    );
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
};

export default nextConfig;
