import type { Metadata } from 'next'
import Link from 'next/link'
import { InstallationGuide } from '../../components/InstallationGuide'
import { SiteHeader } from '../../components/SiteHeader'

export const metadata: Metadata = {
  title: 'How to install · Loomora',
  description: 'Install Loomora with npm, pnpm or yarn and set up styling for Tailwind and non-Tailwind projects.',
}

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-main text-title-1">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Getting started</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">How to install</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-body-1">
            Add the package, make sure React is available, and pick the styling setup that matches your project.
          </p>
        </section>

        <InstallationGuide />

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-third bg-second p-6">
            <div>
              <h2 className="font-semibold">Installed? Next, wire up the provider.</h2>
              <p className="mt-1 text-sm text-body-2">Learn how LoomoraProvider works and which configuration you can set.</p>
            </div>
            <Link
              href="/usage"
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              How to use →
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
