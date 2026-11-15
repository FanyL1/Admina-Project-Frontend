import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // El live reload del telefono (cap run android -l) entra por la IP de la LAN;
  // sin esto Next 16 bloquea /_next/* y la pagina queda sin hidratar (navbar sin collapse).
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*'],
};

export default nextConfig;
