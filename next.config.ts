import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
