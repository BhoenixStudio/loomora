'use client'

import { useState } from 'react'
import { CopyCode } from './CopyCode'

type PackageManager = 'pnpm' | 'npm' | 'yarn'

export function InstallationGuide() {
  const [pkgManager, setPkgManager] = useState<PackageManager>('npm')
  const [activeTab, setActiveTab] = useState<'non-tailwind' | 'tailwind-v4' | 'tailwind-v3'>('non-tailwind')

  const installCommands: Record<PackageManager, string> = {
    npm: 'npm install loomora',
    pnpm: 'pnpm add loomora',
    yarn: 'yarn add loomora',
  }

  const peerInstallCommands: Record<PackageManager, string> = {
    npm: 'npm install react react-dom',
    pnpm: 'pnpm add react react-dom',
    yarn: 'yarn add react react-dom',
  }

  return (
    <section id="installation-guide" className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-16 sm:px-8">
      <div className="rounded-3xl border border-third bg-second p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-third pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Getting Started</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Installation & Styling Guide</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-body-2">
            Loomora works out-of-the-box in both Tailwind and standard (non-Tailwind) projects. Choose your setup below.
          </p>
        </div>

        {/* Step 1: Install Loomora */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-body-3">1. Install Loomora</p>
            <div className="inline-flex rounded-lg border border-third bg-main p-1">
              {(['npm', 'pnpm', 'yarn'] as const).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPkgManager(pm)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                    pkgManager === pm
                      ? 'bg-second text-primary shadow-xs'
                      : 'text-body-2 hover:text-title-1'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>
          <CopyCode code={installCommands[pkgManager]} />
        </div>

        {/* Step 2: Peer Dependencies */}
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              !
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-title-1">2. Peer Dependencies (Important to have)</h3>
              <p className="mt-1 text-xs leading-5 text-body-2">
                Loomora requires <code className="rounded bg-second px-1.5 py-0.5 text-xs font-semibold text-title-1">react</code> and{' '}
                <code className="rounded bg-second px-1.5 py-0.5 text-xs font-semibold text-title-1">react-dom</code>{' '}
                (<span className="font-medium text-title-1">&gt;=18.2.0 &lt;20</span>) in your project. These are essential
                peer dependencies. If your project doesn&apos;t have them installed yet, install them separately:
              </p>
              <div className="mt-2">
                <CopyCode code={peerInstallCommands[pkgManager]} />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Styling Setup */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-body-3">3. Styling Setup</p>

          <div className="mt-3 flex flex-wrap gap-2 border-b border-third pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('non-tailwind')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === 'non-tailwind'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-main text-body-1 hover:bg-third hover:text-title-1'
              }`}
            >
              Non-Tailwind Projects (Vanilla CSS, Vite, Next.js)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tailwind-v4')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === 'tailwind-v4'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-main text-body-1 hover:bg-third hover:text-title-1'
              }`}
            >
              Tailwind CSS v4
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tailwind-v3')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeTab === 'tailwind-v3'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-main text-body-1 hover:bg-third hover:text-title-1'
              }`}
            >
              Tailwind CSS v3
            </button>
          </div>

          <div className="mt-4">
            {activeTab === 'non-tailwind' && (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-body-2">
                  No Tailwind required! Simply import Loomora&apos;s precompiled stylesheet in your root entry file
                  (<code className="rounded bg-main px-1.5 py-0.5 text-xs text-title-1">main.tsx</code>,{' '}
                  <code className="rounded bg-main px-1.5 py-0.5 text-xs text-title-1">index.tsx</code>, or{' '}
                  <code className="rounded bg-main px-1.5 py-0.5 text-xs text-title-1">layout.tsx</code>). It bundles
                  all required utility classes, theme variables, and keyframe animations without resetting your global styles:
                </p>
                <CopyCode
                  code={`// In your main entry file (main.tsx, index.tsx, or layout.tsx)\nimport 'loomora/dist/index.css'\nimport { Button, LoomoraProvider } from 'loomora'\n\nexport default function App() {\n  return (\n    <LoomoraProvider>\n      <Button title="Get Started" variant="fill" color="info" />\n    </LoomoraProvider>\n  )\n}`}
                />
              </div>
            )}

            {activeTab === 'tailwind-v4' && (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-body-2">
                  In Tailwind v4, add the <code className="rounded bg-main px-1.5 py-0.5 text-xs text-title-1">@source</code>{' '}
                  directive in your main CSS file (<code className="rounded bg-main px-1.5 py-0.5 text-xs text-title-1">globals.css</code>)
                  so Tailwind scans Loomora&apos;s component markup:
                </p>
                <CopyCode
                  code={`@import 'tailwindcss';\n@source '../node_modules/loomora';\n\n/* Optional: Customize theme tokens */\n:root {\n  --loomora-primary: #f37035;\n  --loomora-main: #f5f7fa;\n}`}
                />
              </div>
            )}

            {activeTab === 'tailwind-v3' && (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-body-2">
                  In Tailwind v3, add Loomora to your{' '}
                  <code className="rounded bg-main px-1.5 py-0.5 text-xs text-title-1">tailwind.config.js</code> content array
                  and import Loomora&apos;s stylesheet for component keyframes:
                </p>
                <CopyCode
                  code={`// tailwind.config.js\nmodule.exports = {\n  content: [\n    './src/**/*.{js,ts,jsx,tsx}',\n    './node_modules/loomora/**/*.{js,ts,jsx,tsx}',\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}\n\n// In your app root:\nimport 'loomora/dist/index.css'`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
