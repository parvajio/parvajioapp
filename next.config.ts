import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

module.exports = {
  allowedDevOrigins: ['192.168.0.174'],
}

export default nextConfig;
