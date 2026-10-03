import Link from 'next/link'
import { componentCatalog, componentGroups } from '../components/catalog'
import { ComponentIndex } from '../components/ComponentIndex'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-main text-title-1">
      <header className="border-b border-third bg-second">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-lg font-bold tracking-tight">
            loomora<span className="text-primary">.</span>
            <span className="ms-2 rounded-full bg-primary/10 px-2 py-1 align-middle text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Docs lab
            </span>
          </Link>
          <span className="text-sm text-body-2">v0.1.0 · Interactive component documentation</span>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Loomora component library
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Explore every component. Try it. Understand its API.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-body-1 sm:text-lg">
            A practical guide to Loomora’s UI, form, and helper components. Each entry includes a live example, a
            copyable usage snippet, and a prop reference so you can experiment while you learn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#component-index"
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Browse components{' '}
              <span aria-hidden="true" className="ms-2">
                →
              </span>
            </Link>
            <a
              href="https://www.npmjs.com/package/loomora"
              className="inline-flex min-h-11 items-center rounded-xl border border-third bg-second px-5 text-sm font-semibold text-title-2 transition hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Package details
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: 'Components', value: componentCatalog.length, detail: 'with live examples' },
            { label: 'Categories', value: componentGroups.length, detail: 'organized for browsing' },
            { label: 'Documentation', value: 'API', detail: 'props, defaults, snippets' },
            { label: 'Playground', value: 'Live', detail: 'change values and states' },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-third bg-second p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-body-2">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold tracking-tight text-title-1">{item.value}</p>
              <p className="mt-1 text-sm text-body-2">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <ComponentIndex />

      <footer className="border-t border-third bg-second">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-6 text-xs text-body-2 sm:px-8">
          <span>Loomora · Interactive component documentation</span>
          <a href="#component-index" className="font-medium text-title-2 hover:text-primary">
            Back to index ↑
          </a>
        </div>
      </footer>
    </main>
  )
}
