'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLoomora } from '../../../../../config'
import { cx } from '../../../../../hooks'
import { padZero } from '../helper'

export type TimeSpinnerProps = {
  hours: number
  minutes: number
  seconds: number
  onChange: (time: { hours: number; minutes: number; seconds: number }) => void
  hour12?: boolean
  showSeconds?: boolean
  minuteStep?: number
  secondStep?: number
  minTime?: string
  maxTime?: string
  label?: string
}

export function TimeSpinner(props: Readonly<TimeSpinnerProps>) {
  const { form, translations } = useLoomora()
  const {
    hours,
    minutes,
    seconds,
    onChange,
    hour12 = form?.dateField?.hour12 ?? true,
    showSeconds = form?.dateField?.showSeconds ?? false,
    minuteStep = form?.dateField?.minuteStep ?? 1,
    secondStep = form?.dateField?.secondStep ?? 1,
    label,
  } = props

  const [is12Hour, setIs12Hour] = useState(hour12)

  useEffect(() => {
    setIs12Hour(hour12)
  }, [hour12])

  const isPm = hours >= 12
  const displayHours = is12Hour ? hours % 12 || 12 : hours

  // Scroll container refs for auto-scrolling
  const hoursRef = useRef<HTMLDivElement>(null)
  const minutesRef = useRef<HTMLDivElement>(null)
  const secondsRef = useRef<HTMLDivElement>(null)

  // Hours list
  const hoursList = useMemo(() => {
    if (is12Hour) {
      return Array.from({ length: 12 }, (_, i) => i + 1)
    }
    return Array.from({ length: 24 }, (_, i) => i)
  }, [is12Hour])

  // Minutes list
  const minutesList = useMemo(() => {
    const list: number[] = []
    for (let m = 0; m < 60; m += Math.max(1, minuteStep)) {
      list.push(m)
    }
    return list
  }, [minuteStep])

  // Seconds list
  const secondsList = useMemo(() => {
    if (!showSeconds) return []
    const list: number[] = []
    for (let s = 0; s < 60; s += Math.max(1, secondStep)) {
      list.push(s)
    }
    return list
  }, [showSeconds, secondStep])

  // Auto-scroll selected element to center of scroll column
  useEffect(() => {
    const scrollToSelected = (container: HTMLDivElement | null) => {
      if (!container) return
      const selectedBtn = container.querySelector('[data-selected="true"]') as HTMLElement | null
      if (!selectedBtn) return
      const top = selectedBtn.offsetTop - container.offsetTop - container.clientHeight / 2 + selectedBtn.clientHeight / 2
      container.scrollTo({ top, behavior: 'smooth' })
    }
    scrollToSelected(hoursRef.current)
    scrollToSelected(minutesRef.current)
    scrollToSelected(secondsRef.current)
  }, [displayHours, minutes, seconds, is12Hour])

  const handleHourSelect = (h: number) => {
    let finalHours = h
    if (is12Hour && isPm && h < 12) finalHours = h + 12
    if (is12Hour && !isPm && h === 12) finalHours = 0
    onChange({ hours: finalHours, minutes, seconds })
  }

  const handleAmPmToggle = (pm: boolean) => {
    if (pm && !isPm) {
      onChange({ hours: hours + 12, minutes, seconds })
      return
    }
    if (!pm && isPm) {
      onChange({ hours: hours - 12, minutes, seconds })
    }
  }

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-second/20 border border-body-3/15 select-none shadow-xs min-w-[190px]">
      {/* Header: Label + Digital Readout + 12h/24h toggle */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-body-3/15">
        <div className="flex items-center gap-1.5">
          <span className="text-primary text-xs">🕒</span>
          {label ? (
            <span className="text-xs font-semibold text-title-1 tracking-wide">{label}</span>
          ) : (
            <span className="text-xs font-semibold text-title-1">Time</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ms-auto">
          {/* Digital readout badge */}
          <span className="px-2 py-0.5 rounded-md bg-main border border-body-3/20 font-mono text-[11px] font-bold text-primary shadow-xs tracking-wider">
            {padZero(displayHours)}:{padZero(minutes)}{showSeconds ? `:${padZero(seconds)}` : ''}
            {is12Hour ? (isPm ? ' PM' : ' AM') : ''}
          </span>

          {/* 12h / 24h toggle pill */}
          <div className="flex items-center p-0.5 rounded-md bg-main/80 border border-body-3/20 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setIs12Hour(true)}
              className={cx([
                'px-1.5 py-0.5 rounded transition-all cursor-pointer select-none',
                is12Hour ? 'bg-primary text-white shadow-xs font-bold' : 'text-body-3 hover:text-title-1',
              ])}
              title="12-Hour format"
            >
              12h
            </button>
            <button
              type="button"
              onClick={() => setIs12Hour(false)}
              className={cx([
                'px-1.5 py-0.5 rounded transition-all cursor-pointer select-none',
                !is12Hour ? 'bg-primary text-white shadow-xs font-bold' : 'text-body-3 hover:text-title-1',
              ])}
              title="24-Hour format"
            >
              24h
            </button>
          </div>
        </div>
      </div>

      {/* Main column pickers */}
      <div className="flex items-start justify-center gap-2 p-2 rounded-xl bg-main/60 border border-body-3/10 shadow-inner">
        {/* Hours Column */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-body-3 mb-1 select-none">
            {translations?.dateField?.hours ?? 'Hours'}
          </span>
          <div
            ref={hoursRef}
            className="h-44 overflow-y-auto flex flex-col gap-1 px-1 py-1 rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {hoursList.map((h) => {
              const selected = displayHours === h
              return (
                <button
                  key={h}
                  type="button"
                  data-selected={selected}
                  onClick={() => handleHourSelect(h)}
                  className={cx([
                    'w-8 h-8 flex items-center justify-center text-xs rounded-lg font-medium transition-all duration-150 cursor-pointer select-none',
                    selected
                      ? 'bg-primary text-white font-bold shadow-md scale-105 z-10 ring-2 ring-primary/30'
                      : 'text-title-2 hover:bg-second hover:text-title-1 hover:scale-102',
                  ])}
                >
                  {padZero(h)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Colon separator */}
        <span className="text-body-3/70 font-bold text-sm select-none pt-7">:</span>

        {/* Minutes Column */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider text-body-3 mb-1 select-none">
            {translations?.dateField?.minutes ?? 'Mins'}
          </span>
          <div
            ref={minutesRef}
            className="h-44 overflow-y-auto flex flex-col gap-1 px-1 py-1 rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {minutesList.map((m) => {
              const selected = minutes === m
              return (
                <button
                  key={m}
                  type="button"
                  data-selected={selected}
                  onClick={() => onChange({ hours, minutes: m, seconds })}
                  className={cx([
                    'w-8 h-8 flex items-center justify-center text-xs rounded-lg font-medium transition-all duration-150 cursor-pointer select-none',
                    selected
                      ? 'bg-primary text-white font-bold shadow-md scale-105 z-10 ring-2 ring-primary/30'
                      : 'text-title-2 hover:bg-second hover:text-title-1 hover:scale-102',
                  ])}
                >
                  {padZero(m)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Seconds Column (if enabled) */}
        {showSeconds && (
          <>
            <span className="text-body-3/70 font-bold text-sm select-none pt-7">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-body-3 mb-1 select-none">
                {translations?.dateField?.seconds ?? 'Secs'}
              </span>
              <div
                ref={secondsRef}
                className="h-44 overflow-y-auto flex flex-col gap-1 px-1 py-1 rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {secondsList.map((s) => {
                  const selected = seconds === s
                  return (
                    <button
                      key={s}
                      type="button"
                      data-selected={selected}
                      onClick={() => onChange({ hours, minutes, seconds: s })}
                      className={cx([
                        'w-8 h-8 flex items-center justify-center text-xs rounded-lg font-medium transition-all duration-150 cursor-pointer select-none',
                        selected
                          ? 'bg-primary text-white font-bold shadow-md scale-105 z-10 ring-2 ring-primary/30'
                          : 'text-title-2 hover:bg-second hover:text-title-1 hover:scale-102',
                      ])}
                    >
                      {padZero(s)}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* AM / PM Segmented Control */}
        {is12Hour && (
          <div className="flex flex-col items-center pt-5 ms-1">
            <div className="flex flex-col gap-1 p-1 bg-main rounded-xl border border-body-3/15 shadow-xs">
              <button
                type="button"
                onClick={() => handleAmPmToggle(false)}
                className={cx([
                  'w-9 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer select-none',
                  !isPm
                    ? 'bg-primary text-white shadow-md ring-2 ring-primary/30'
                    : 'text-body-2 hover:bg-second hover:text-title-1',
                ])}
              >
                {translations?.dateField?.am ?? 'AM'}
              </button>
              <button
                type="button"
                onClick={() => handleAmPmToggle(true)}
                className={cx([
                  'w-9 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer select-none',
                  isPm
                    ? 'bg-primary text-white shadow-md ring-2 ring-primary/30'
                    : 'text-body-2 hover:bg-second hover:text-title-1',
                ])}
              >
                {translations?.dateField?.pm ?? 'PM'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
