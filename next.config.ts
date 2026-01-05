import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@dnd-kit/core',
    '@dnd-kit/sortable',
    '@dnd-kit/utilities',
    'react-konva',
    'konva',
    'its-fine',
  ],
  reactCompiler: false,
  allowedDevOrigins: ['192.168.1.8', 'localhost', '127.0.0.1'],
};

export default nextConfig;
