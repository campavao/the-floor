import type { NextConfig } from "next";

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

/**
 * Where the curated category images are served from.
 *
 * Production builds on Vercel with R2 configured serve them from the R2
 * bucket, which `scripts/sync-curated-images.mjs` fills during the same build
 * under the same paths. Everywhere else -- local dev, CI, preview deployments
 * -- they come from public/images. Keep this condition in step with the one at
 * the top of that script.
 */
const curatedImageBaseUrl =
  process.env.VERCEL_ENV === "production"
    ? (process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "") ?? "")
    : "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CURATED_IMAGE_BASE_URL: curatedImageBaseUrl,
  },
  async redirects() {
    if (!curatedImageBaseUrl) return [];

    // Old tabs, search-engine image results and hotlinks still ask Vercel for
    // /images/*. Redirects run before public files, so they get sent to R2
    // without Vercel serving the bytes.
    return [
      {
        source: "/images/:path*",
        destination: `${curatedImageBaseUrl}/images/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      {
        source: "/sounds/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
      {
        source: "/:path*\\.(svg|ico|png|jpg|jpeg|webp|gif)",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CACHE }],
      },
    ];
  },
};

export default nextConfig;
