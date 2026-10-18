'use client'

import type { ReactNode } from 'react'

export function InteractiveLayout({
  children,
  controls,
  reset,
  title = 'Interactive Prop Controls',
  stageClassName = '',
}: Readonly<{
  children: ReactNode
  controls: ReactNode
  reset?: () => void
  title?: string
  stageClassName?: string
}>) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="lg:h-full">
        <div
          className={`flex min-h-85 flex-col items-center justify-center rounded-2xl border border-third bg-main p-6 sm:p-8 text-center lg:sticky lg:top-24 ${stageClassName}`}
        >
          {children}
        </div>
      </div>

      <div className="rounded-2xl border border-third bg-second p-5">
        <div className="flex items-center justify-between border-b border-third pb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-body-3">{title}</h3>
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-primary transition hover:underline"
            >
              Reset to defaults
            </button>
          )}
        </div>
        <div className="mt-4 space-y-3">{controls}</div>
      </div>
    </div>
  )
}

export function ControlToggle({
  label,
  checked,
  onChange,
  description,
}: Readonly<{
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}>) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-third bg-main px-3.5 py-2.5 text-xs transition hover:border-primary/50 hover:bg-second select-none"
    >
      <div className="flex flex-col text-start min-w-0">
        <span className="font-mono font-medium text-title-1 group-hover:text-primary transition truncate">{label}</span>
        {description && <span className="text-[10px] text-body-3 truncate">{description}</span>}
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <span
          className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-tight transition ${
            checked
              ? 'bg-primary/15 text-primary border border-primary/25'
              : 'bg-third/35 text-body-3 border border-third/60'
          }`}
        >
          {checked ? 'true' : 'false'}
        </span>

        <div
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            checked ? 'bg-primary' : 'bg-third'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    </button>
  )
}

export function ControlSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: Readonly<{
  label: string
  value: T
  options: { value: T; label?: string }[]
  onChange: (value: T) => void
}>) {
  return (
    <div className="rounded-xl border border-third bg-main p-3 text-xs">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-medium text-body-2 truncate">{label}</span>
        <span className="font-mono font-semibold text-primary shrink-0">{value}</span>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-lg border border-third bg-second px-2.5 py-1.5 text-xs text-title-1 outline-none transition focus:border-primary"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label ?? opt.value}
          </option>
        ))}
      </select>
    </div>
  )
}

export function ControlInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: Readonly<{
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}>) {
  return (
    <div className="rounded-xl border border-third bg-main p-3 text-xs">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-medium text-body-2 truncate">{label}</span>
        <span className="max-w-35 truncate font-mono font-semibold text-primary shrink-0">
          {value ? `"${value}"` : '(empty)'}
        </span>
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-third bg-second px-2.5 py-1.5 text-xs text-title-1 outline-none transition focus:border-primary"
      />
    </div>
  )
}

export function ControlRange({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  suffix = '',
  onChange,
}: Readonly<{
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  suffix?: string
  onChange: (value: number) => void
}>) {
  return (
    <div className="rounded-xl border border-third bg-main p-3 text-xs">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-medium text-body-2 truncate">{label}</span>
        <span className="font-mono font-semibold text-primary shrink-0">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-primary"
      />
    </div>
  )
}
