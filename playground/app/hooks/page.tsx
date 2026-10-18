import type { Metadata } from 'next'
import { HookIndex } from '../../components/HookIndex'
import { SiteHeader } from '../../components/SiteHeader'

export const metadata: Metadata = {
  title: 'All Hooks · Loomora',
  description: 'Map, search, and explore all Loomora React hooks, helpers, and runtime utilities.',
}

export default function HooksDirectoryPage() {
  return (
    <div className="min-h-screen bg-main text-title-1">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">React utilities</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">All Hooks Map</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body-1">
            Explore Loomora’s collection of ergonomic React hooks. From responsive breakpoints and synchronized web storage
            to date arithmetic, color space math, and theme controls.
          </p>
        </section>

        <HookIndex />
      </main>

      <footer className="border-t border-third bg-second">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-6 text-xs text-body-2 sm:px-8">
          <span>Loomora · v0.1.0</span>
          <span>All hooks operate in modern React 18 & 19 environments</span>
        </div>
      </footer>
    </div>
  )
}
