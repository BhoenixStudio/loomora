'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { componentCatalog, componentGroups, type ComponentGroup } from './catalog'
import { COMPONENT_CONFIGS } from './docs/component-metadata'
import { configHref } from './docs/config-ids'

export function ComponentIndex() {
  const [query, setQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<ComponentGroup | 'All'>('All')
  const [onlyConfigurable, setOnlyConfigurable] = useState(false)

  const normalizedQuery = query.trim().toLowerCase()

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = { All: componentCatalog.length }
    for (const group of componentGroups) {
      counts[group] = componentCatalog.filter((c) => c.group === group).length
    }
    return counts
  }, [])

  const filteredEntries = useMemo(() => {
    return componentCatalog.filter((entry) => {
      // Group filter
      if (selectedGroup !== 'All' && entry.group !== selectedGroup) return false

      // Configurable filter
      if (onlyConfigurable && !COMPONENT_CONFIGS[entry.slug]?.length) return false

      // Search query filter
      if (!normalizedQuery) return true
      const searchable = `${entry.name} ${entry.group} ${entry.summary} ${entry.importName} ${
        COMPONENT_CONFIGS[entry.slug]?.join(' ') ?? ''
      }`.toLowerCase()
      return searchable.includes(normalizedQuery)
    })
  }, [selectedGroup, onlyConfigurable, normalizedQuery])

  function resetFilters() {
    setQuery('')
    setSelectedGroup('All')
    setOnlyConfigurable(false)
  }

  return (
    <section id="component-index" className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 sm:px-8">
      {/* Header & Controls */}
      <div className="rounded-3xl border border-third bg-second p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-third pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Component Directory</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Component Map & Catalog</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-body-2">
            Explore {componentCatalog.length} production-ready components. Filter by category, search by feature, or view related configuration defaults.
          </p>
        </div>

        {/* Search bar & toggles */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="relative min-w-[280px] flex-1">
            <input
              type="search"
              placeholder="Search components by name, feature, or config…"
              className="min-h-12 w-full rounded-2xl border border-third bg-main px-4 pe-10 text-sm text-title-1 outline-none transition placeholder:text-body-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-body-3 hover:bg-second hover:text-title-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-third bg-main px-4 py-3 text-xs font-medium text-body-1 transition hover:border-primary/50">
            <input
              type="checkbox"
              checked={onlyConfigurable}
              onChange={(e) => setOnlyConfigurable(e.target.checked)}
              className="h-4 w-4 rounded border-third text-primary focus:ring-primary"
            />
            <span>Configurable in LoomoraProvider only</span>
          </label>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedGroup('All')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              selectedGroup === 'All'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-main text-body-1 hover:bg-third hover:text-title-1'
            }`}
          >
            <span>All</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                selectedGroup === 'All' ? 'bg-white/20 text-white' : 'bg-second text-body-2'
              }`}
            >
              {groupCounts.All}
            </span>
          </button>

          {componentGroups.map((group) => {
            const active = selectedGroup === group
            return (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  active ? 'bg-primary text-white shadow-sm' : 'bg-main text-body-1 hover:bg-third hover:text-title-1'
                }`}
              >
                <span>{group}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? 'bg-white/20 text-white' : 'bg-second text-body-2'
                  }`}
                >
                  {groupCounts[group]}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-body-3">
          <span>
            Showing <strong className="font-semibold text-title-1">{filteredEntries.length}</strong> of{' '}
            {componentCatalog.length} components
          </span>
          {(query || selectedGroup !== 'All' || onlyConfigurable) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-primary hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredEntries.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-third bg-second p-12 text-center">
          <p className="text-base font-semibold text-title-1">No components match your search</p>
          <p className="mt-1 text-sm text-body-2">
            Try adjusting your query or category filter to discover what you are looking for.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:shadow-md"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => {
            const configs = COMPONENT_CONFIGS[entry.slug] ?? []
            return (
              <div
                key={entry.slug}
                className="group flex flex-col justify-between rounded-2xl border border-third bg-second p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-main px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {entry.group}
                    </span>
                    <span className="font-mono text-[11px] text-body-3">{entry.importName}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-title-1 group-hover:text-primary transition-colors">
                    <Link href={`/components/${entry.slug}`}>{entry.name}</Link>
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-body-2">{entry.summary}</p>
                </div>

                <div className="mt-5 border-t border-third/60 pt-3.5">
                  {configs.length > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-body-3">Config:</span>
                      {configs.slice(0, 2).map((cfg) => (
                        <Link
                          key={cfg}
                          href={configHref(cfg)}
                          className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] text-primary transition hover:bg-primary/20"
                          title={`View ${cfg} in configuration reference`}
                        >
                          {cfg}
                        </Link>
                      ))}
                      {configs.length > 2 && (
                        <span className="text-[10px] text-body-3">+{configs.length - 2} more</span>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/components/${entry.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition group-hover:gap-2"
                  >
                    <span>View component & live demo</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
