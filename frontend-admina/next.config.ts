import type { NextConfig } from "next";
const path = require('path');

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:2560/api/:path*'
      },
    ];
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
