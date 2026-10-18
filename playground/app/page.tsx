import Link from 'next/link'
import { SiteHeader } from '../components/SiteHeader'

const problems = [
  {
    title: 'Every product reinvents the basics',
    body: 'Teams keep rebuilding the same form controls, feedback states and layout helpers. Loomora gives them one tested foundation so product time goes into product features.',
  },
  {
    title: 'Inconsistent look and behaviour',
    body: 'When each screen is built differently, users notice. Loomora centralises defaults for colors, sizes, corners and copy so every surface feels like the same product.',
  },
  {
    title: 'Customisation without forks',
    body: 'Change a default once through configuration and it applies everywhere, or override it for a single subtree. No copy-pasting components, no forking the library.',
  },
  {
    title: 'Global products need more than English',
    body: 'Translations, right-to-left layouts, locale-aware data and light/dark themes are part of the foundation instead of a late-stage retrofit.',
  },
]

const features = [
  {
    label: 'Configuration first',
    body: 'One recursively merged configuration controls defaults, class names, icons and copy. Partial overrides keep everything you did not mention.',
  },
  {
    label: 'Works with or without Tailwind',
    body: 'Ship a precompiled stylesheet for plain projects, or let your own Tailwind build scan the library for full control.',
  },
  {
    label: 'Built for global audiences',
    body: 'Translatable strings, RTL support and country, timezone and social-platform metadata ready to use.',
  },
  {
    label: 'Accessible by default',
    body: 'Semantic markup, labelled controls and keyboard behaviour are part of the baseline, not an add-on.',
  },
  {
    label: 'TypeScript native',
    body: 'Fully typed props, configuration and helpers give you autocomplete and safe refactors.',
  },
  {
    label: 'Framework friendly',
    body: 'Plain React 18 and 19 components, with client boundaries that fit Next.js and other modern setups.',
  },
]

const outcomes = [
  { value: 'Faster', detail: 'delivery of forms and product screens' },
  { value: 'Consistent', detail: 'experience across every product surface' },
  { value: 'Maintainable', detail: 'one place to change defaults' },
  { value: 'Global-ready', detail: 'languages, directions and themes' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-main text-title-1">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            A React component foundation for product teams
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Build consistent, global-ready products without rebuilding the basics.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-body-1 sm:text-lg">
            Loomora is a TypeScript React library that gives teams a shared, configurable foundation for the interface
            layer, so every product ships faster and looks and behaves like it belongs together.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/install"
              className="inline-flex min-h-12 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              How to install
            </Link>
            <Link
              href="/usage"
              className="inline-flex min-h-12 items-center rounded-xl border border-third bg-second px-6 text-sm font-semibold text-title-1 transition hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              How to use
            </Link>
            <Link
              href="/components"
              className="inline-flex min-h-12 items-center rounded-xl px-6 text-sm font-semibold text-primary transition hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore components →
            </Link>
            <Link
              href="/hooks"
              className="inline-flex min-h-12 items-center rounded-xl border border-third/60 bg-second/60 px-5 text-sm font-semibold text-title-1 transition hover:border-primary/50 hover:bg-second focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore hooks →
            </Link>
          </div>
        </section>

        <section className="border-y border-third bg-second">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-10 sm:px-8 lg:grid-cols-4">
            {outcomes.map((item) => (
              <div key={item.value}>
                <p className="text-2xl font-semibold tracking-tight text-title-1 sm:text-3xl">{item.value}</p>
                <p className="mt-1 text-sm text-body-2">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The problem</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Product teams spend too much time on work users never notice.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {problems.map((problem) => (
              <article key={problem.title} className="rounded-2xl border border-third bg-second p-6">
                <h3 className="text-lg font-semibold">{problem.title}</h3>
                <p className="mt-2 text-sm leading-6 text-body-2">{problem.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-third bg-second">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What you get</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              A foundation you configure once and use everywhere.
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.label} className="border-s-2 border-primary/40 ps-4">
                  <h3 className="font-semibold">{feature.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-body-2">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to see how it fits into your project?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-body-2 sm:text-base">
            Install it in a minute, learn how the provider and configuration work, then try every component live.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/install"
              className="inline-flex min-h-12 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              How to install
            </Link>
            <Link
              href="/usage"
              className="inline-flex min-h-12 items-center rounded-xl border border-third bg-second px-6 text-sm font-semibold transition hover:border-primary/50"
            >
              How to use
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-third bg-second">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-6 text-xs text-body-2 sm:px-8">
          <span>Loomora · v0.1.0</span>
          <span>MIT licensed</span>
        </div>
      </footer>
    </div>
  )
}
