/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
};

module.exports = nextConfig;
