import path from 'node:path'
import type { NextConfig } from 'next'

const librarySource = path.resolve(process.cwd(), '../src/index.ts')
const playgroundTranslations = path.resolve(process.cwd(), 'app/next-intl.ts')
const playgroundIntlServer = path.resolve(process.cwd(), 'app/next-intl-server.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['loomora'],
  turbopack: {
    resolveAlias: {
      loomora: librarySource,
      'next-intl': playgroundTranslations,
      'next-intl/server': playgroundIntlServer,
    },
  },
  webpack: (config) => {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use the source entry during development so Next.js Fast Refresh sees library changes.
      loomora: librarySource,
      'next-intl': playgroundTranslations,
      'next-intl/server': playgroundIntlServer,
    }
    return config
  },
}

export default nextConfig
