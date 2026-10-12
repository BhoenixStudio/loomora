'use client'

import { ReactNode } from 'react'
import { useLoomora } from '../../../../../config'
import { CalendarView } from '../helper'

export type HeaderProps = {
  viewDate: Date
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  prevIcon?: ReactNode
  nextIcon?: ReactNode
  yearRange?: [number, number]
}

export function Header(props: Readonly<HeaderProps>) {
  const { form, translations } = useLoomora()
  const {
    viewDate,
    view,
    onViewChange,
    onPrev,
    onNext,
    prevIcon = form?.dateField?.chevronLeft ?? '‹',
    nextIcon = form?.dateField?.chevronRight ?? '›',
    yearRange,
  } = props

  const monthKeys = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const
  const currentMonthKey = monthKeys[viewDate.getMonth()]
  const monthName =
    translations?.dates?.months?.[currentMonthKey]?.name ??
    viewDate.toLocaleString('default', { month: 'long' })
  const year = viewDate.getFullYear()

  let title = `${monthName} ${year}`
  if (view === 'months') {
    title = `${year}`
  } else if (view === 'years' && yearRange) {
    title = `${yearRange[0]} - ${yearRange[1]}`
  }

  return (
    <div className="flex items-center justify-between px-2 py-1.5 border-b border-body-3/20 select-none">
      <button
        type="button"
        onClick={onPrev}
        className="flex items-center justify-center w-7 h-7 rounded text-body-1 hover:bg-second transition-colors cursor-pointer text-base"
        aria-label="Previous"
      >
        {prevIcon}
      </button>

      <div className="flex items-center gap-1 font-medium text-sm text-title-1">
        {view === 'days' && (
          <>
            <button
              type="button"
              onClick={() => onViewChange('months')}
              className="px-1.5 py-0.5 rounded hover:bg-second transition-colors cursor-pointer hover:text-primary"
            >
              {monthName}
            </button>
            <button
              type="button"
              onClick={() => onViewChange('years')}
              className="px-1.5 py-0.5 rounded hover:bg-second transition-colors cursor-pointer hover:text-primary"
            >
              {year}
            </button>
          </>
        )}
        {view === 'months' && (
          <button
            type="button"
            onClick={() => onViewChange('years')}
            className="px-1.5 py-0.5 rounded hover:bg-second transition-colors cursor-pointer hover:text-primary"
          >
            {title}
          </button>
        )}
        {view === 'years' && (
          <span className="px-1.5 py-0.5 font-semibold text-title-1">{title}</span>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="flex items-center justify-center w-7 h-7 rounded text-body-1 hover:bg-second transition-colors cursor-pointer text-base"
        aria-label="Next"
      >
        {nextIcon}
      </button>
    </div>
  )
}
