import type { Metadata } from 'next'
import { ComponentIndex } from '../../components/ComponentIndex'
import { SiteHeader } from '../../components/SiteHeader'

export const metadata: Metadata = {
  title: 'All Components · Loomora',
  description: 'Map, search, and filter all Loomora UI components, form inputs, and utilities.',
}

export default function ComponentsDirectoryPage() {
  return (
    <div className="min-h-screen bg-main text-title-1">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Component library</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">All Components Map</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body-1">
            Browse through Loomora’s comprehensive set of accessible, theme-driven components. Each component includes
            an interactive live sandbox, full API reference, and LoomoraProvider configuration links.
          </p>
        </section>

        <ComponentIndex />
      </main>

      <footer className="border-t border-third bg-second">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-6 text-xs text-body-2 sm:px-8">
          <span>Loomora · v0.1.0</span>
          <span>All components are TypeScript & SSR ready</span>
        </div>
      </footer>
    </div>
  )
}
