import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript during production builds
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://192.168.0.113:3002/api/v1/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
