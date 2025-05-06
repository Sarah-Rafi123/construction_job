import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack(config) {
    // Configure webpack to handle SVG files as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })

    return config
  },
  images: {
    domains: ["jay-construction-project.s3.amazonaws.com"],
  },
}

export default nextConfig
