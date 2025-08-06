import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  experimental: {
    ppr: "incremental",
    after: true,
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
};

const sentryWebpackPluginOptions = {
  // Set these only once
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: "yc-directory-6b", // Make sure this matches your token's org
  project: "yc-directory",

  silent: !process.env.CI,
  widenClientFileUpload: true,

  reactComponentAnnotation: {
    enabled: true,
  },

  // tunnelRoute: "/monitoring", // Uncomment if needed
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
