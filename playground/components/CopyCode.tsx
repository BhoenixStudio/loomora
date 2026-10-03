'use client'

import { useState } from 'react'

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-third bg-slate-950">
      <button
        type="button"
        onClick={copyCode}
        className="absolute end-3 top-3 inline-flex min-h-9 items-center rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-100 transition hover:border-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-live="polite"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="overflow-x-auto p-4 pe-24 text-xs leading-6 text-slate-100 sm:p-5 sm:pe-28">
        <code>{code}</code>
      </pre>
    </div>
  )
}
