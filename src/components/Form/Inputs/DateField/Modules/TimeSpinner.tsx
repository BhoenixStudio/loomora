'use client'

import { useMemo } from 'react'
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

  const isPm = hours >= 12
  const displayHours = hour12 ? hours % 12 || 12 : hours

  // Hours list
  const hoursList = useMemo(() => {
    if (hour12) {
      return Array.from({ length: 12 }, (_, i) => i + 1)
    }
    return Array.from({ length: 24 }, (_, i) => i)
  }, [hour12])

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

  const handleHourSelect = (h: number) => {
    let finalHours = h
    if (hour12) {
      if (isPm && h < 12) finalHours = h + 12
      if (!isPm && h === 12) finalHours = 0
    }
    onChange({ hours: finalHours, minutes, seconds })
  }

  const handleAmPmToggle = (pm: boolean) => {
    if (pm && !isPm) {
      onChange({ hours: hours + 12, minutes, seconds })
    } else if (!pm && isPm) {
      onChange({ hours: hours - 12, minutes, seconds })
    }
  }

  return (
    <div className="flex flex-col p-2 border-s border-body-3/20 select-none min-w-[140px]">
      {label && <div className="text-xs font-semibold text-title-1 mb-1 px-1">{label}</div>}

      <div className="flex items-center gap-1.5 justify-center">
        {/* Hours Column */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-semibold text-body-3 mb-1">
            {translations?.dateField?.hours ?? 'Hr'}
          </span>
          <div className="h-44 overflow-y-auto flex flex-col gap-1 px-1 py-1 scrollbar-thin">
            {hoursList.map((h) => {
              const selected = displayHours === h
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleHourSelect(h)}
                  className={cx([
                    'w-7 h-7 flex items-center justify-center text-xs rounded transition-colors cursor-pointer',
                    selected
                      ? 'bg-primary text-white font-semibold shadow-xs'
                      : 'text-title-2 hover:bg-second hover:text-title-1',
                  ])}
                >
                  {padZero(h)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Colon separator */}
        <span className="text-body-3 font-bold mt-4">:</span>

        {/* Minutes Column */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-semibold text-body-3 mb-1">
            {translations?.dateField?.minutes ?? 'Min'}
          </span>
          <div className="h-44 overflow-y-auto flex flex-col gap-1 px-1 py-1 scrollbar-thin">
            {minutesList.map((m) => {
              const selected = minutes === m
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChange({ hours, minutes: m, seconds })}
                  className={cx([
                    'w-7 h-7 flex items-center justify-center text-xs rounded transition-colors cursor-pointer',
                    selected
                      ? 'bg-primary text-white font-semibold shadow-xs'
                      : 'text-title-2 hover:bg-second hover:text-title-1',
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
            <span className="text-body-3 font-bold mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-semibold text-body-3 mb-1">
                {translations?.dateField?.seconds ?? 'Sec'}
              </span>
              <div className="h-44 overflow-y-auto flex flex-col gap-1 px-1 py-1 scrollbar-thin">
                {secondsList.map((s) => {
                  const selected = seconds === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onChange({ hours, minutes, seconds: s })}
                      className={cx([
                        'w-7 h-7 flex items-center justify-center text-xs rounded transition-colors cursor-pointer',
                        selected
                          ? 'bg-primary text-white font-semibold shadow-xs'
                          : 'text-title-2 hover:bg-second hover:text-title-1',
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

        {/* AM / PM Toggle (if 12h) */}
        {hour12 && (
          <div className="flex flex-col items-center justify-start gap-1 mt-4 ms-1">
            <button
              type="button"
              onClick={() => handleAmPmToggle(false)}
              className={cx([
                'px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer',
                !isPm
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-body-2 hover:bg-second hover:text-title-1',
              ])}
            >
              {translations?.dateField?.am ?? 'AM'}
            </button>
            <button
              type="button"
              onClick={() => handleAmPmToggle(true)}
              className={cx([
                'px-2 py-1 text-xs rounded font-medium transition-colors cursor-pointer',
                isPm
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'text-body-2 hover:bg-second hover:text-title-1',
              ])}
            >
              {translations?.dateField?.pm ?? 'PM'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
