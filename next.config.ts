import type { NextConfig } from "next";

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

const nextConfig: NextConfig = {
  // The language detector's model is a 4 MB table of data. Bundling it buys
  // nothing and slows every build, so it's loaded from node_modules instead.
  serverExternalPackages: ["eld"],
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
