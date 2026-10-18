import Link from 'next/link'
import type { ReactNode } from 'react'
import { componentCatalog, type ComponentDoc, type ComponentGroup } from './catalog'
import { CopyCode } from './CopyCode'
import { getComponentConfigs } from './docs/component-metadata'

export function DocsPage({ doc, children }: { doc: ComponentDoc; children: ReactNode }) {
  const configs = getComponentConfigs(doc.slug)

  return (
    <div className="min-h-screen bg-main text-title-1">
      <header className="sticky top-0 z-40 border-b border-third bg-second/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-7">
          <Link href="/" className="shrink-0 text-base font-bold tracking-tight">
            loomora<span className="text-primary">.</span>
            <span className="ms-2 hidden rounded-full bg-primary/10 px-2 py-1 align-middle text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:inline">
              Component docs
            </span>
          </Link>
          <nav aria-label="Breadcrumb" className="min-w-0 truncate text-sm text-body-2">
            <Link href="/components" className="hover:text-primary">
              Components
            </Link>
            <span className="mx-2 text-body-3">/</span>
            <span className="font-medium text-title-1">{doc.name}</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/components"
              className="hidden text-xs font-semibold text-body-2 transition hover:text-primary sm:inline-block"
            >
              Component directory
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
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-body-3">Component index</p>
          <nav
            className="sticky top-24 max-h-[calc(100vh-8rem)] space-y-6 overflow-y-auto pb-4"
            aria-label="Components"
          >
            {(['UI', 'Form fields', 'Form composition', 'Partials', 'Helpers'] as const).map((group) => (
              <div key={group}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-body-3">{group}</p>
                <SidebarGroup group={group} current={doc.slug} />
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 px-4 py-8 sm:px-7 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-5xl">
            {/* Breadcrumb / metadata tags and Small button to go to related configs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  {doc.group}
                </span>
                <span className="text-xs text-body-3">·</span>
                <span className="font-mono text-xs text-body-2">loomora/{doc.importName}</span>
              </div>

              {/* Small button to go to the related configs */}
              {configs.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {configs.map((cfg) => (
                    <Link
                      key={cfg.key}
                      href={cfg.href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-third bg-second px-2.5 py-1 text-xs font-medium text-title-1 transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary shadow-2xs"
                      title={`Go to ${cfg.key} configuration in LoomoraProvider`}
                    >
                      <span className="text-primary font-bold">⚙</span>
                      <span>
                        Config: <code className="font-mono font-semibold text-primary">{cfg.key}</code>
                      </span>
                      <span className="text-body-3 text-[10px]">↗</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href="/usage#configuration"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-third bg-second px-2.5 py-1 text-xs font-medium text-title-1 transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary shadow-2xs"
                  title="View Loomora configuration reference"
                >
                  <span className="text-primary font-bold">⚙</span>
                  <span>Related configs</span>
                  <span className="text-body-3 text-[10px]">↗</span>
                </Link>
              )}
            </div>

            {/* Title and Description */}
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{doc.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-body-1 sm:text-lg">{doc.description}</p>

            {/* Interactive live box */}
            <section
              id="live-example"
              className="mt-8 scroll-mt-24 rounded-2xl border border-third bg-second shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-third px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold text-title-1">Interactive live playground</h2>
                  <p className="mt-0.5 text-xs text-body-2">
                    Tweak props, change states, and see the live component respond in real time.
                  </p>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-success">
                  Live
                </span>
              </div>
              <div className="min-h-40 p-5 sm:p-7">{children}</div>
            </section>

            {/* How to call */}
            <section id="usage" className="mt-10 scroll-mt-24">
              <h2 className="text-xl font-semibold">How to call</h2>
              <p className="mt-2 text-sm leading-6 text-body-2">
                Import directly from the Loomora package root. For projects without Tailwind CSS, ensure{' '}
                <code className="rounded bg-main px-1.5 py-0.5 text-xs text-title-1">loomora/dist/index.css</code> is
                imported once in your root layout.
              </p>
              <CopyCode code={`import { ${doc.importName} } from 'loomora'\n\n${doc.code}`} />
            </section>

            {/* API reference */}
            <section id="api" className="mt-10 scroll-mt-24">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">API reference</h2>
                  <p className="mt-1 text-sm text-body-2">Important public props and how they affect rendering.</p>
                </div>
                <span className="text-xs text-body-3">{doc.props.length} props</span>
              </div>
              <div className="mt-4 overflow-x-auto rounded-xl border border-third">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <thead className="bg-main text-xs uppercase tracking-wide text-body-2">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Prop</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Default</th>
                      <th className="px-4 py-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.props.map((prop) => (
                      <tr key={prop.name} className="border-t border-third align-top">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-title-1">{prop.name}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-body-1">{prop.type}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-body-2">{prop.defaultValue}</td>
                        <td className="px-4 py-3 leading-6 text-body-1">{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Navigation links */}
            <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-third pt-5 text-sm">
              <Link href="/components" className="font-medium text-body-2 hover:text-primary">
                ← All components map
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

function SidebarGroup({ group, current }: { group: ComponentGroup; current: string }) {
  return (
    <ul className="space-y-0.5">
      {componentCatalog
        .filter((entry) => entry.group === group)
        .map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/components/${entry.slug}`}
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
