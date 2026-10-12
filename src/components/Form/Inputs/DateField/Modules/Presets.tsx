'use client'

import { cx } from '../../../../../hooks'
import { DatePreset } from '../helper'

export type PresetsProps = {
  presets: DatePreset[]
  onSelect: (value: DatePreset['value']) => void
  isMobile?: boolean
}

export function Presets(props: Readonly<PresetsProps>) {
  const { presets, onSelect, isMobile = false } = props

  if (!presets || presets.length === 0) return null

  if (isMobile) {
    return (
      <div className="flex items-center gap-1.5 p-2 overflow-x-auto border-b border-body-3/20 scrollbar-none select-none">
        {presets.map((preset, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(preset.value)}
            className="shrink-0 px-2.5 py-1 text-xs rounded-full bg-second hover:bg-primary/20 text-title-2 hover:text-primary transition-colors cursor-pointer font-medium"
          >
            {preset.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 p-2 border-e border-body-3/20 select-none min-w-[120px] max-w-[160px]">
      <div className="text-[10px] uppercase font-semibold text-body-3 mb-1 px-2">Presets</div>
      <div className="flex flex-col gap-0.5 overflow-y-auto max-h-64">
        {presets.map((preset, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(preset.value)}
            className={cx([
              'px-2.5 py-1.5 text-xs text-start rounded-md transition-colors cursor-pointer font-medium',
              'text-title-2 hover:bg-second hover:text-title-1',
            ])}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
