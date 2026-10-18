import Link from 'next/link'
import type { ReactNode } from 'react'
import { CopyCode } from './CopyCode'
import { configHref } from './docs/config-ids'
import { hookCatalog, type HookCategory, type HookDoc } from './hooks-catalog'

export function HookDocsPage({ doc, children }: { doc: HookDoc; children: ReactNode }) {
  const configs = doc.relatedConfigs.map((key) => ({
    key,
    href: configHref(key),
  }))

  return (
    <div className="min-h-screen bg-main text-title-1">
      <header className="sticky top-0 z-40 border-b border-third bg-second/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-7">
          <Link href="/" className="shrink-0 text-base font-bold tracking-tight">
            loomora<span className="text-primary">.</span>
            <span className="ms-2 hidden rounded-full bg-primary/10 px-2 py-1 align-middle text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:inline">
              Hook docs
            </span>
          </Link>
          <nav aria-label="Breadcrumb" className="min-w-0 truncate text-sm text-body-2">
            <Link href="/hooks" className="hover:text-primary">
              Hooks
            </Link>
            <span className="mx-2 text-body-3">/</span>
            <span className="font-medium text-title-1">{doc.name}</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/hooks"
              className="hidden text-xs font-semibold text-body-2 transition hover:text-primary sm:inline-block"
            >
              Hooks directory
            </Link>
            <a
              href="#live-example"
              className="inline-flex min-h-10 shrink-0 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-white transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4 sm:text-sm"
            >
              Try live example
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden border-e border-third px-5 py-8 lg:block">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-body-3">Hooks index</p>
          <nav
            className="sticky top-24 max-h-[calc(100vh-8rem)] space-y-6 overflow-y-auto pb-4"
            aria-label="Hooks"
          >
            {(['State & Context', 'DOM & Layout', 'Data & Utilities', 'Validation'] as const).map((category) => (
              <div key={category}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-body-3">{category}</p>
                <SidebarGroup category={category} current={doc.slug} />
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 px-4 py-8 sm:px-7 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                {doc.category}
              </span>
              <span className="text-xs text-body-3">·</span>
              <span className="font-mono text-xs text-body-2">loomora → {doc.importName}</span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{doc.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-body-1 sm:text-lg">{doc.description}</p>

            {/* Related Loomora Configuration Box */}
            <section className="mt-6 rounded-2xl border border-third bg-second p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-third pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    ⚙
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-title-1">Related Loomora Configuration</h2>
                    <p className="text-xs text-body-2">
                      Defaults and settings configuring this hook in <code className="rounded bg-main px-1 py-0.5 text-xs">LoomoraProvider</code>.
                    </p>
                  </div>
                </div>
                <Link
                  href="/usage#configuration"
                  className="text-xs font-semibold text-primary transition hover:underline"
                >
                  View full config reference →
                </Link>
              </div>

              {configs.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {configs.map((cfg) => (
                    <Link
                      key={cfg.key}
                      href={cfg.href}
                      className="group inline-flex items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/5 px-3.5 py-2 font-mono text-xs font-medium text-title-1 transition hover:border-primary hover:bg-primary/10"
                    >
                      <span className="text-body-3">config:</span>
                      <span className="font-semibold text-primary">{cfg.key}</span>
                      <span className="text-body-3 transition group-hover:translate-x-0.5 group-hover:text-primary">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs leading-5 text-body-2">
                  This hook operates independently without requiring specific <code className="rounded bg-main px-1 py-0.5 text-xs">LoomoraProvider</code> configuration overrides.
                </p>
              )}
            </section>

            {/* Live Interactive Box */}
            <section
              id="live-example"
              className="mt-8 scroll-mt-24 overflow-hidden rounded-2xl border border-third bg-second shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-third px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold text-title-1">Interactive live playground</h2>
                  <p className="mt-0.5 text-xs text-body-2">
                    Interact with the hook state and inspect computed return values in real time.
                  </p>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-success">
                  Live
                </span>
              </div>
              <div className="min-h-40 p-5 sm:p-7">{children}</div>
            </section>

            {/* Capabilities Box */}
            <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/15 pb-3">
                <div>
                  <h2 className="text-base font-semibold text-title-1">Hook Capabilities & Architecture</h2>
                  <p className="mt-0.5 text-xs text-body-2">
                    Key features that optimize performance, bundle footprint, and developer experience.
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Features
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {doc.features.map((feat) => (
                  <div key={feat.title} className="flex flex-col rounded-xl border border-third bg-main p-3.5 shadow-2xs">
                    <h3 className="text-xs font-bold text-primary">{feat.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-body-1">{feat.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Usage & API Reference */}
            <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
              <div className="min-w-0">
                <section id="usage" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold">How to call</h2>
                  <p className="mt-2 text-sm leading-6 text-body-2">
                    Import directly from the Loomora root package in any React client component.
                  </p>
                  <CopyCode code={doc.code} />
                </section>

                <section id="api" className="mt-9 scroll-mt-24">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold">Return values & methods</h2>
                      <p className="mt-1 text-sm text-body-2">API signatures and utilities returned by this hook.</p>
                    </div>
                    <span className="text-xs text-body-3">{doc.returns.length} methods</span>
                  </div>
                  <div className="mt-4 overflow-x-auto rounded-xl border border-third">
                    <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                      <thead className="bg-main text-xs uppercase tracking-wide text-body-2">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Method / Prop</th>
                          <th className="px-4 py-3 font-semibold">Type</th>
                          <th className="px-4 py-3 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doc.returns.map((ret) => (
                          <tr key={ret.name} className="border-t border-third align-top">
                            <td className="px-4 py-3 font-mono text-xs font-semibold text-title-1">{ret.name}</td>
                            <td className="px-4 py-3 font-mono text-[11px] text-body-1">{ret.type}</td>
                            <td className="px-4 py-3 leading-6 text-body-1">{ret.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <section className="rounded-xl border border-third bg-second p-5">
                  <h2 className="font-semibold">Notes & patterns</h2>
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-body-1">
                    {doc.notes.map((note) => (
                      <li key={note} className="flex gap-2">
                        <span aria-hidden="true" className="mt-0.5 text-primary">
                          •
                        </span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-xl border border-third bg-main p-5">
                  <h2 className="font-semibold">About this hook</h2>
                  <p className="mt-2 text-sm leading-6 text-body-2">{doc.summary}</p>
                  <div className="mt-4 border-t border-third pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-body-3">Package export</p>
                    <code className="mt-2 block break-all rounded-lg bg-second px-3 py-2 text-xs text-title-2">
                      loomora → {doc.importName}
                    </code>
                  </div>
                </section>
                <Link
                  href="/usage"
                  className="block rounded-xl border border-primary/25 bg-primary/5 p-5 transition hover:border-primary/50"
                >
                  <span className="text-sm font-semibold text-primary">Configuring LoomoraProvider</span>
                  <span className="mt-1 block text-xs leading-5 text-body-2">
                    Learn how configuration values are provided to hooks through context.
                  </span>
                </Link>
              </aside>
            </section>

            <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-third pt-5 text-sm">
              <Link href="/hooks" className="font-medium text-body-2 hover:text-primary">
                ← All hooks map
              </Link>
              <a href="#live-example" className="font-medium text-body-2 hover:text-primary">
                Back to live example ↑
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarGroup({ category, current }: { category: HookCategory; current: string }) {
  return (
    <ul className="space-y-0.5">
      {hookCatalog
        .filter((entry) => entry.category === category)
        .map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/hooks/${entry.slug}`}
              aria-current={entry.slug === current ? 'page' : undefined}
              className={`block rounded-lg px-2.5 py-2 text-xs transition ${
                entry.slug === current
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-body-1 hover:bg-main hover:text-title-1'
              }`}
            >
              {entry.name}
            </Link>
          </li>
        ))}
    </ul>
  )
}
