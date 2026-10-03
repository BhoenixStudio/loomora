import Link from 'next/link'
import type { ReactNode } from 'react'
import { componentCatalog, type ComponentDoc, type ComponentGroup } from './catalog'
import { CopyCode } from './CopyCode'

export function DocsPage({ doc, children }: { doc: ComponentDoc; children: ReactNode }) {
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
            <Link href="/" className="hover:text-primary">
              Components
            </Link>
            <span className="mx-2 text-body-3">/</span>
            <span className="font-medium text-title-1">{doc.name}</span>
          </nav>
          <a
            href="#live-example"
            className="inline-flex min-h-10 shrink-0 items-center rounded-lg bg-primary px-3 text-xs font-semibold text-white transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4 sm:text-sm"
          >
            Try example
          </a>
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{doc.group}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{doc.name}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-body-1 sm:text-lg">{doc.description}</p>

            <section
              id="live-example"
              className="mt-8 scroll-mt-24 overflow-hidden rounded-2xl border border-third bg-second shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-third px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold">Interactive example</h2>
                  <p className="mt-1 text-xs text-body-2">Change the control and inspect the live state.</p>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-success">
                  Live
                </span>
              </div>
              <div className="min-h-40 p-5 sm:p-7">{children}</div>
            </section>

            <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
              <div className="min-w-0">
                <section id="usage" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold">Usage</h2>
                  <p className="mt-2 text-sm leading-6 text-body-2">
                    Import from the Loomora package root. The example shows the core composition; connect controlled
                    fields to state in the parent component.
                  </p>
                  <CopyCode code={`import { ${doc.importName} } from 'loomora'\n\n${doc.code}`} />
                </section>

                <section id="api" className="mt-9 scroll-mt-24">
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
                  <h2 className="font-semibold">About this component</h2>
                  <p className="mt-2 text-sm leading-6 text-body-2">{doc.summary}</p>
                  <div className="mt-4 border-t border-third pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-body-3">Package import</p>
                    <code className="mt-2 block break-all rounded-lg bg-second px-3 py-2 text-xs text-title-2">
                      loomora → {doc.importName}
                    </code>
                  </div>
                </section>
                <a
                  href="#usage"
                  className="block rounded-xl border border-primary/25 bg-primary/5 p-5 transition hover:border-primary/50"
                >
                  <span className="text-sm font-semibold text-primary">Implementation guide</span>
                  <span className="mt-1 block text-xs leading-5 text-body-2">
                    Review the usage snippet and API props above.
                  </span>
                </a>
              </aside>
            </section>

            <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-third pt-5 text-sm">
              <Link href="/" className="font-medium text-body-2 hover:text-primary">
                ← All components
              </Link>
              <a href="#live-example" className="font-medium text-body-2 hover:text-primary">
                Back to example ↑
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarGroup({ group, current }: { group: ComponentGroup; current: string }) {
  const { componentCatalog } = require('./catalog') as typeof import('./catalog')
  return (
    <ul className="space-y-0.5">
      {componentCatalog
        .filter((entry) => entry.group === group)
        .map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/components/${entry.slug}`}
              aria-current={entry.slug === current ? 'page' : undefined}
              className={`block rounded-lg px-2.5 py-2 text-xs transition ${entry.slug === current ? 'bg-primary/10 font-semibold text-primary' : 'text-body-1 hover:bg-main hover:text-title-1'}`}
            >
              {entry.name}
            </Link>
          </li>
        ))}
    </ul>
  )
}

function CodeBlock({ code }: { code: string }) {
  return <CopyCode code={code} />
}
