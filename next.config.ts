import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...((process.env.NEXT_CONFIG_OUTPUT === "standalone") && { 
    output: "standalone" 
  }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
