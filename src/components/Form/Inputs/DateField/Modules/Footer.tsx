'use client'

import { useLoomora } from '../../../../../config'
import { DateFieldMode } from '../helper'

export type FooterProps = {
  mode: DateFieldMode
  onClear?: () => void
  onToday?: () => void
  onCancel?: () => void
  onApply?: () => void
}

export function Footer(props: Readonly<FooterProps>) {
  const { translations } = useLoomora()
  const { mode, onClear, onToday, onCancel, onApply } = props

  const isTimeOnly = mode === 'time' || mode === 'timeRange'
  const todayOrNowLabel = isTimeOnly
    ? translations?.dateField?.now ?? 'Now'
    : translations?.dateField?.today ?? 'Today'

  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-body-3/20 select-none bg-inherit">
      <div className="flex items-center gap-2">
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-body-2 hover:text-error transition-colors cursor-pointer font-medium"
          >
            {translations?.dateField?.clear ?? 'Clear'}
          </button>
        )}
        {onToday && (
          <button
            type="button"
            onClick={onToday}
            className="text-xs text-primary hover:underline transition-all cursor-pointer font-medium"
          >
            {todayOrNowLabel}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-2.5 py-1 text-xs rounded-md text-body-1 hover:bg-second transition-colors cursor-pointer"
          >
            {translations?.dateField?.cancel ?? 'Cancel'}
          </button>
        )}
        {onApply && (
          <button
            type="button"
            onClick={onApply}
            className="px-3 py-1 text-xs rounded-md bg-primary text-white font-medium hover:bg-primary/90 shadow-xs transition-colors cursor-pointer"
          >
            {translations?.dateField?.apply ?? 'Apply'}
          </button>
        )}
      </div>
    </div>
  )
}
