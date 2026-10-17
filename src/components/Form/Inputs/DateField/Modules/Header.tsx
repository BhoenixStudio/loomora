'use client'

import { ReactNode } from 'react'
import { useLoomora } from '../../../../../config'
import { CalendarView } from '../helper'

export type HeaderProps = {
  viewDate: Date
  secondMonthDate?: Date
  isDualMonth?: boolean
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
    secondMonthDate,
    isDualMonth = false,
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

  // Second month info for dual-month display
  const secondMonthKey = secondMonthDate ? monthKeys[secondMonthDate.getMonth()] : null
  const secondMonthTrans = secondMonthKey ? translations?.dates?.months?.[secondMonthKey]?.name : null
  const secondMonthLocale = secondMonthDate ? secondMonthDate.toLocaleString('default', { month: 'long' }) : ''
  const secondMonthName = secondMonthTrans ?? secondMonthLocale
  const secondYear = secondMonthDate ? secondMonthDate.getFullYear() : year

  let title = `${monthName} ${year}`
  if (view === 'months') {
    title = `${year}`
  } else if (view === 'years' && yearRange) {
    title = `${yearRange[0]} - ${yearRange[1]}`
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-body-3/20 select-none bg-inherit">
      {/* Left controls: Prev button and optional Back button */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-body-1 hover:bg-second hover:text-primary transition-colors cursor-pointer text-base"
          aria-label="Previous"
        >
          {prevIcon}
        </button>

        {view !== 'days' && (
          <button
            type="button"
            onClick={() => onViewChange(view === 'years' ? 'months' : 'days')}
            className="flex items-center gap-1 px-1.5 py-1 rounded-md text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            aria-label="Back to calendar"
            title="Back to previous view"
          >
            <span>‹</span>
            <span>{view === 'years' ? 'Months' : 'Calendar'}</span>
          </button>
        )}
      </div>

      {/* Center title area */}
      <div className="flex items-center gap-2 font-medium text-sm text-title-1">
        {view === 'days' && !isDualMonth && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onViewChange('months')}
              className="px-2 py-1 rounded-md hover:bg-second transition-colors cursor-pointer hover:text-primary font-semibold"
            >
              {monthName}
            </button>
            <button
              type="button"
              onClick={() => onViewChange('years')}
              className="px-2 py-1 rounded-md hover:bg-second transition-colors cursor-pointer hover:text-primary font-semibold"
            >
              {year}
            </button>
          </div>
        )}

        {view === 'days' && isDualMonth && (
          <div className="flex items-center justify-around w-full gap-8">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onViewChange('months')}
                className="px-2 py-1 rounded-md hover:bg-second transition-colors cursor-pointer hover:text-primary font-semibold"
              >
                {monthName}
              </button>
              <button
                type="button"
                onClick={() => onViewChange('years')}
                className="px-2 py-1 rounded-md hover:bg-second transition-colors cursor-pointer hover:text-primary font-semibold"
              >
                {year}
              </button>
            </div>
            <span className="text-body-3/30 font-light select-none">|</span>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 font-semibold text-title-1">
                {secondMonthName} {secondYear}
              </span>
            </div>
          </div>
        )}

        {view === 'months' && (
          <button
            type="button"
            onClick={() => onViewChange('years')}
            className="px-2.5 py-1 rounded-md hover:bg-second transition-colors cursor-pointer hover:text-primary font-bold flex items-center gap-1"
            title="Click to view decade"
          >
            <span>{title}</span>
            <span className="text-[10px] text-body-3">▾</span>
          </button>
        )}

        {view === 'years' && (
          <button
            type="button"
            onClick={() => onViewChange('months')}
            className="px-2.5 py-1 rounded-md hover:bg-second transition-colors cursor-pointer hover:text-primary font-bold"
            title="Click to return to months"
          >
            {title}
          </button>
        )}
      </div>

      {/* Right controls: Next button and return to days if in month/year mode */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-body-1 hover:bg-second hover:text-primary transition-colors cursor-pointer text-base"
          aria-label="Next"
        >
          {nextIcon}
        </button>

        {view !== 'days' && (
          <button
            type="button"
            onClick={() => onViewChange('days')}
            className="flex items-center justify-center w-6 h-6 rounded-md text-body-3 hover:text-title-1 hover:bg-second transition-colors cursor-pointer text-xs"
            aria-label="Return to calendar"
            title="Return to calendar days"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
