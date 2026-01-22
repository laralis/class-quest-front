/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3300",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "exemplo.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
