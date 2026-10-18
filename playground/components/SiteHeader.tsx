'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/install', label: 'How to install' },
  { href: '/usage', label: 'How to use' },
  { href: '/components', label: 'Components' },
  { href: '/hooks', label: 'Hooks' },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-third bg-second/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight">
          loomora<span className="text-primary">.</span>
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-1">
          {links.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-primary/10 text-primary' : 'text-body-1 hover:bg-main hover:text-title-1'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
