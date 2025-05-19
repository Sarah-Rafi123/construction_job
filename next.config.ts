import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  images: {
    domains: ["jay-construction-project.s3.amazonaws.com"],
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
