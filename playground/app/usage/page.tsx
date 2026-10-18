import type { Metadata } from 'next'
import { ConfigTable } from '../../components/docs/ConfigTable'
import { buildConfigSections } from '../../components/docs/config-docs'
import { CopyCode } from '../../components/CopyCode'
import { SiteHeader } from '../../components/SiteHeader'

export const metadata: Metadata = {
  title: 'How to use · Loomora',
  description: 'How LoomoraProvider works and the complete configuration reference with defaults.',
}

const providerExample = `import 'loomora/dist/index.css' // not needed in a Tailwind project that scans loomora
import type { ReactNode } from 'react'
import { LoomoraProvider } from 'loomora'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoomoraProvider
      config={{
        button: { defaultColor: 'success', defaultLoadingTitle: 'Please wait' },
        settings: { isRtl: false, locale: 'en' },
      }}
    >
      {children}
    </LoomoraProvider>
  )
}`

const nestedExample = `<LoomoraProvider config={{ button: { defaultColor: 'success' } }}>
  {/* every Button here defaults to "success" */}

  <LoomoraProvider config={{ button: { defaultColor: 'error' } }}>
    {/* this subtree defaults to "error"; every other default is inherited from the parent */}
  </LoomoraProvider>
</LoomoraProvider>`

const noProviderExample = `import { Button, TextField } from 'loomora'

// Works without LoomoraProvider: components read the built-in defaults.
export function Example() {
  return <Button title="Save" />
}`

export default function UsagePage() {
  const sections = buildConfigSections()
  const rowCount = sections.reduce((total, section) => total + section.rows.length, 0)

  return (
    <div className="min-h-screen bg-main text-title-1">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Core concepts</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">How to use</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-body-1">
          Loomora works out of the box. Add <code className="rounded bg-second px-1.5 py-0.5 text-sm">LoomoraProvider</code>{' '}
          when you want to change defaults for your whole app, or for just part of it.
        </p>

        <section className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">1. Wrap your app with LoomoraProvider</h2>
            <p className="mt-2 text-sm leading-6 text-body-2">
              The provider merges the <code>config</code> you pass over the built-in defaults. You only write the values
              you want to change; everything else keeps its default.
            </p>
            <CopyCode code={providerExample} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. Override per subtree</h2>
            <p className="mt-2 text-sm leading-6 text-body-2">
              Providers can be nested. A nested provider starts from its parent&apos;s resolved configuration and only
              replaces the keys it sets.
            </p>
            <CopyCode code={nestedExample} />
            <h3 className="mt-8 text-sm font-semibold">The provider is optional</h3>
            <CopyCode code={noProviderExample} />
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-6 text-body-1">
          <p className="font-semibold text-title-1">Good to know</p>
          <ul className="mt-2 list-disc space-y-1 ps-5">
            <li>
              <code>LoomoraProvider</code> includes the theme provider, which uses <code>next-intl</code> (the{' '}
              <code>theme</code> namespace). Render it beneath your <code>NextIntlClientProvider</code>.
            </li>
            <li>
              Configuration is merged recursively, so changing <code>form.textField.className</code> never removes other
              <code> form</code> defaults.
            </li>
            <li>
              Each component page links to the configuration sections that affect it, so you can jump straight to the
              relevant rows below.
            </li>
          </ul>
        </section>

        <section id="configuration" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Configuration reference</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-body-2">
            Every key you can pass to <code>config</code>, with its type and default value. This table is generated from
            the library defaults ({rowCount} entries), so it always matches the version in this repository.
          </p>
          <div className="mt-8">
            <ConfigTable sections={sections} />
          </div>
        </section>
      </main>
    </div>
  )
}
