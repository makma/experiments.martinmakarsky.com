/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/payment-:id",
        destination: "/payment/:id",
      },
      {
        source: "/api/pay-:id",
        destination: "/api/payment/:id",
      },
    ];
  },
  turbopack: {
    // Make sure Next treats `next-app` as the workspace root.
    root: __dirname,
  },
};

module.exports = nextConfig;
