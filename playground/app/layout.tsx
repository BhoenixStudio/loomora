import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './globals.css'
import 'loomora/styles/index.css'

export const metadata: Metadata = {
  title: 'Loomora Playground',
  description: 'Interactive catalog for Loomora components, hooks, and data helpers.',
  icons: {
    icon: [
      { url: '/images/identity/favicon.png', media: '(prefers-color-scheme: light)' },
      { url: '/images/identity/favicon-light.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [
      { url: '/images/identity/appicon.png', media: '(prefers-color-scheme: light)' },
      { url: '/images/identity/appicon-light.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
