'use client'

import Link from 'next/link'
import { useState } from 'react'
import { componentCatalog, componentGroups } from './catalog'

export function ComponentIndex() {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  return (
    <section id="component-index" className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-20 sm:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-third pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Documentation index</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Choose a component</h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-body-2">
          Open a guide for interactive examples, API notes, and implementation patterns.
        </p>
      </div>

      <label className="mb-7 block max-w-lg">
        <span className="mb-2 block text-sm font-medium text-title-2">Find a component</span>
        <input
          type="search"
          placeholder="Search by name or purpose…"
          className="min-h-12 w-full rounded-xl border border-third bg-second px-4 text-sm text-title-1 outline-none transition placeholder:text-body-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="space-y-10">
        {componentGroups.map((group) => {
          const entries = componentCatalog.filter(
            (entry) =>
              entry.group === group &&
              `${entry.name} ${entry.group} ${entry.summary}`.toLowerCase().includes(normalizedQuery)
          )
          if (entries.length === 0) return null

          const groupId = `group-${group.toLowerCase().replaceAll(' ', '-')}`
          return (
            <section key={group} aria-labelledby={groupId}>
              <h3 id={groupId} className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-body-2">
                {group} <span className="ms-1 font-normal">· {entries.length}</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/components/${entry.slug}`}
                    className="group rounded-2xl border border-third bg-second p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-title-1">{entry.name}</span>
                      <span
                        className="text-body-3 transition group-hover:translate-x-1 group-hover:text-primary"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-body-2">{entry.summary}</span>
                    <span className="mt-4 inline-flex rounded-full bg-main px-2.5 py-1 text-xs font-medium text-body-1">
                      {entry.group}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
