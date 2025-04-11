import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
