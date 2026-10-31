import path from 'node:path'
import type { NextConfig } from 'next'

const librarySource = path.resolve(process.cwd(), '../src/index.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_EXPORT === 'true' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['loomora'],
  turbopack: {
    resolveAlias: {
      loomora: '../src/index.ts',
    },
  },
  webpack: (config) => {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use the source entry during development so Next.js Fast Refresh sees library changes.
      loomora: librarySource,
    }
    return config
  },
}

export default nextConfig
