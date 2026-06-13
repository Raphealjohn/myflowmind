/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // 301 the legacy/secondary domain to the canonical one. Vercel domain
  // settings can also do this; this keeps the rule in code as a backstop.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?kalevantgroup\\.com" }],
        destination: "https://kalevant.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
