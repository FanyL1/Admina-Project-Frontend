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
  allowedDevOrigins: [`${process.env.NEXT_PUBLIC_IP_NETWORKING}`] // Esto es para permitir abrir el frontend por conexion WIFI. La variable tiene la ip de la computadora
};

export default nextConfig;
