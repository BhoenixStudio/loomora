import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '../public/css/globals.css'
import 'loomora/styles/index.css'

export const metadata: Metadata = {
  title: 'Loomora Playground',
  description: 'Interactive catalog for Loomora components, hooks, and data helpers.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
