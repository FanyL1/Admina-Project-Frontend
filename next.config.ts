import type { NextConfig } from "next";
const path = require('path');
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`
      },
    ];
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
