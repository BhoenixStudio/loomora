'use client'

import { useMemo, useState } from 'react'
import type { ConfigSection } from './config-docs'

export function ConfigTable({ sections }: Readonly<{ sections: ConfigSection[] }>) {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()

  const visible = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          rows: section.rows.filter(
            (row) =>
              !normalized ||
              `${row.path} ${row.description} ${row.value} ${row.type}`.toLowerCase().includes(normalized)
          ),
        }))
        .filter((section) => section.rows.length > 0),
    [sections, normalized]
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <nav aria-label="Configuration sections" className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-body-3">Sections</p>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block rounded-lg px-2 py-1 font-mono text-xs text-body-2 transition hover:bg-second hover:text-primary"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0">
        <label className="block max-w-lg">
          <span className="mb-2 block text-sm font-medium text-title-2">Filter configuration</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by path, value or description…"
            className="min-h-11 w-full rounded-xl border border-third bg-second px-4 text-sm text-title-1 outline-none transition placeholder:text-body-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        {visible.length === 0 && <p className="mt-8 text-sm text-body-2">No configuration matches “{query}”.</p>}

        <div className="mt-6 space-y-10">
          {visible.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h3 className="font-mono text-base font-semibold text-title-1">{section.title}</h3>
              {section.description && <p className="mt-1 text-sm text-body-2">{section.description}</p>}
              <div className="mt-3 overflow-x-auto rounded-xl border border-third">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead className="bg-main text-xs uppercase tracking-wide text-body-2">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Path</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Default</th>
                      <th className="px-4 py-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={row.path} className="border-t border-third align-top">
                        <td className="px-4 py-3 font-mono text-xs text-title-1 break-all">{row.path}</td>
                        <td className="px-4 py-3 font-mono text-xs text-body-2">{row.type}</td>
                        <td className="px-4 py-3 font-mono text-xs text-body-1">
                          <span className="break-all">{row.value}</span>
                          {row.detail && (
                            <details className="mt-1">
                              <summary className="cursor-pointer text-primary">Show full value</summary>
                              <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-main p-3 text-[11px] leading-5">
                                {row.detail}
                              </pre>
                            </details>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs leading-5 text-body-2">{row.description || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
