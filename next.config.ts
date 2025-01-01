import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: {
    appIsrStatus: true, 
    buildActivity: true, 
    buildActivityPosition: 'bottom-left', 
  },
};

export default nextConfig;
