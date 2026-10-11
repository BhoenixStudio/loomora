'use client'

import {
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ConditionalWrapper,
  hasError,
  InputBase,
  InputErrorMessage,
  InputFieldset,
  InputHelper,
  InputHelperAndError,
  InputLabel,
  Label,
  LabelProps,
} from '../..'
import { useLoomora } from '../../../config'
import { cx, hasProps, Hsva, useHue } from '../../../hooks'
import { GlobalElement } from '../../../types'

const clamp = (n: number, min = 0, max = 1) => Math.min(Math.max(n, min), max)

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue'> & {
  value?: string
  defaultValue?: string
  setValue?: (value: string) => void
}

export interface ColorFieldProps extends InputBase, InputFieldset, InputLabel, InputHelperAndError {
  wrapper?: GlobalElement<'div'>
  prefix?: ReactNode
  suffix?: ReactNode
  presets?: Iterable<string>
  alpha?: boolean
  allowEmpty?: boolean
  properties?: InputProps
}

export const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>((props, ref) => {
  const { form } = useLoomora()

  const {
    size = [],
    properties,
    fieldset,
    fieldsetPrefix,
    fieldsetSuffix,
    wrapper,
    label = '',
    prefix,
    suffix,
    inputHelper,
    errors,
    presets: presetsProp = form?.colorField?.presets,
    alpha = form?.colorField?.alpha,
    allowEmpty = form?.colorField?.allowEmpty,
    loading = false,
    condition,
  } = props

  const { normalizeHex, hex2hsva: hexToHsva, hsva2hex: hsvaToHex } = useHue()
  const error = hasError(errors)

  const {
    className: fieldsetClass = form?.fieldset?.className,
    attributes: fieldsetAttrs,
    ...restFieldset
  } = fieldset ?? {}
  const { className: wrapperClass, attributes: wrapperAttrs, ...restWrapper } = wrapper ?? {}

  const {
    value: valueProp,
    defaultValue = '',
    setValue,
    onChange,
    onBlur,
    onKeyDown,
    className,
    required,
    disabled,
    placeholder = '#000000',
    name,
    ...restProperties
  } = properties ?? {}

  const rootRef = useRef<HTMLDivElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const alphaRef = useRef<HTMLDivElement>(null)

  // States
  const [inner, setInner] = useState<string>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const [hsva, setHsva] = useState<Hsva>(() => hexToHsva(valueProp ?? defaultValue ?? ''))

  // Configs
  const presets = useMemo(() => {
    const seen = new Set<string>()
    const list: string[] = []
    for (const p of presetsProp ?? []) {
      const key = (normalizeHex(p, true) ?? p).toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      list.push(p)
    }
    return list
  }, [presetsProp, normalizeHex])

  const controlled = valueProp !== undefined
  const value = (controlled ? valueProp : inner) ?? ''
  const isDisabled = Boolean(disabled || loading)
  const hasValue = Boolean(value)
  const current = hasValue ? (normalizeHex(value, alpha) ?? '#000000') : ''

  let labelClass: string = '',
    restLabel: LabelProps = { children: '' }
  if (hasProps(label, 'children')) {
    const { className: lCN, ...restOfLabel } = label ?? {}
    labelClass = lCN ?? ''
    restLabel = restOfLabel
  }
  const labelClassName = cx([form?.label?.stateSharedClassName, form?.label?.activeClassName, labelClass])

  const pureHex = hsvaToHex({ ...hsva, a: 1 }, false)
  const checker = 'repeating-conic-gradient(rgba(128,128,128,.35) 0% 25%, transparent 0% 50%) 50% / 10px 10px'

  // Functions
  const commit = useCallback(
    (hex: string) => {
      if (!controlled) setInner(hex)
      setValue?.(hex)
    },
    [controlled, setValue]
  )
  const update = (patch: Partial<Hsva>) => {
    const next = { ...hsva, ...patch }
    setHsva(next)
    commit(hsvaToHex(next, alpha))
  }
  const drag =
    (ref: React.RefObject<HTMLDivElement | null>, apply: (x: number, y: number) => void) =>
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (isDisabled || !ref.current) return
      const el = ref.current
      el.setPointerCapture?.(e.pointerId)
      const move = (ev: { clientX: number; clientY: number }) => {
        const r = el.getBoundingClientRect()
        apply(clamp((ev.clientX - r.left) / (r.width || 1)), clamp((ev.clientY - r.top) / (r.height || 1)))
      }
      move(e)
      const onMove = (ev: PointerEvent) => move(ev)
      const onUp = () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerup', onUp)
        el.removeEventListener('pointercancel', onUp)
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)
    }
  const slider =
    (get: () => number, set: (v: number) => void, step: number) => (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const dir =
        e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0
      if (!dir) return
      e.preventDefault()
      set(clamp(get() + dir * step))
    }
  const commitText = () => {
    if (!text.trim()) {
      if (allowEmpty) commit('')
      else setText(value)
      return
    }
    const n = normalizeHex(text, alpha)
    if (n) {
      setHsva((p) => ({ ...hexToHsva(n), h: hexToHsva(n).s === 0 ? p.h : hexToHsva(n).h }))
      commit(n)
      setText(n)
    } else setText(value)
  }

  useEffect(() => {
    setText(value)
    const n = normalizeHex(value, true)
    if (!n) return
    setHsva((prev) => {
      const next = hexToHsva(n)
      if (hsvaToHex(prev, true) === hsvaToHex(next, true)) return prev
      return { ...next, h: next.s === 0 || next.v === 0 ? prev.h : next.h }
    })
  }, [value, normalizeHex, hexToHsva, hsvaToHex])
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (condition === false) return null
  return (
    <fieldset
      className={cx(['flex flex-col flex-nowrap relative', ...size, fieldsetClass])}
      {...fieldsetAttrs}
      {...restFieldset}
    >
      {fieldsetPrefix}

      <ConditionalWrapper childrenCondition={Boolean(label)}>
        {hasProps(label, 'children') ? (
          <Label className={cx(['mb-2', labelClassName])} {...{ required, ...restLabel }} />
        ) : (
          <Label className={cx(['mb-2', labelClassName])} {...{ required }}>
            {label}
          </Label>
        )}
      </ConditionalWrapper>

      <div ref={rootRef} className="color-field relative w-full">
        <div
          className={cx([
            'flex flex-nowrap items-center relative border bg-inherit rounded gap-2 px-2',
            { value: 'border-error/70', fallback: 'border-body-3/40', condition: error },
            { value: 'opacity-60 cursor-not-allowed', condition: isDisabled },
            wrapperClass,
          ])}
          {...wrapperAttrs}
          {...restWrapper}
        >
          {prefix}
          <button
            type="button"
            aria-label="Pick color"
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={isDisabled}
            onClick={() => setOpen((o) => !o)}
            className={cx([
              'color-field__swatch relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-body-3/40',
              'cursor-pointer transition-transform duration-150 hover:scale-105 disabled:cursor-not-allowed',
            ])}
            style={{ background: checker }}
          >
            <span className="absolute inset-0" style={{ background: current || 'transparent' }} />
            {!hasValue && (
              <span className="absolute inset-0 flex items-center justify-center text-body-3 text-xs">∅</span>
            )}
          </button>
          <input
            ref={ref}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            maxLength={alpha ? 9 : 7}
            className={cx([
              'flex-1 min-w-0 bg-transparent outline-none disabled:cursor-not-allowed py-3 font-mono uppercase',
              className,
            ])}
            value={text}
            placeholder={placeholder}
            disabled={isDisabled}
            required={required}
            onChange={(e) => {
              setText(e.target.value)
              const n = normalizeHex(e.target.value, alpha)
              if (n && /^#?[0-9a-f]{6}([0-9a-f]{2})?$/i.test(e.target.value.trim())) {
                setHsva((p) => ({ ...hexToHsva(n), h: hexToHsva(n).s === 0 ? p.h : hexToHsva(n).h }))
                commit(n)
              }
              onChange?.(e)
            }}
            onBlur={(e) => {
              commitText()
              onBlur?.(e)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commitText()
              }
              onKeyDown?.(e)
            }}
            {...restProperties}
          />
          {name && <input type="hidden" name={name} value={current} />}
          {allowEmpty && hasValue && !isDisabled && (
            <button
              type="button"
              aria-label="Clear color"
              className="shrink-0 cursor-pointer px-1 text-body-3 transition-colors hover:text-error"
              onClick={() => commit('')}
            >
              ×
            </button>
          )}
          {suffix}
        </div>

        {open && !isDisabled && (
          <dialog
            aria-label="Color picker"
            className={cx([
              'color-field__popover absolute z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-body-3/30',
              'bg-second p-3 shadow-xl backdrop-blur flex flex-col gap-3 animate-in fade-in',
            ])}
          >
            <div
              ref={areaRef}
              role="slider"
              tabIndex={0}
              aria-label="Saturation and brightness"
              aria-valuetext={`Saturation ${Math.round(hsva.s * 100)}%, brightness ${Math.round(hsva.v * 100)}%`}
              className="relative h-36 w-full cursor-crosshair touch-none select-none overflow-hidden rounded-lg"
              style={{
                backgroundColor: `hsl(${hsva.h} 100% 50%)`,
                backgroundImage: 'linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent)',
              }}
              onPointerDown={drag(areaRef, (x, y) => update({ s: x, v: 1 - y }))}
              onKeyDown={(e) => {
                const d: Record<string, [number, number]> = {
                  ArrowLeft: [-0.02, 0],
                  ArrowRight: [0.02, 0],
                  ArrowUp: [0, 0.02],
                  ArrowDown: [0, -0.02],
                }
                const m = d[e.key]
                if (!m) return
                e.preventDefault()
                update({ s: clamp(hsva.s + m[0]), v: clamp(hsva.v + m[1]) })
              }}
            >
              <span
                className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4)]"
                style={{ left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: pureHex }}
              />
            </div>

            {/* Hue */}
            <div
              ref={hueRef}
              role="slider"
              tabIndex={0}
              aria-label="Hue"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={Math.round(hsva.h)}
              className="relative h-3 w-full cursor-pointer touch-none select-none rounded-full"
              style={{
                background: 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)',
              }}
              onPointerDown={drag(hueRef, (x) => update({ h: x * 360 }))}
              onKeyDown={slider(
                () => hsva.h / 360,
                (v) => update({ h: v * 360 }),
                0.01
              )}
            >
              <span
                className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4)]"
                style={{ left: `${(hsva.h / 360) * 100}%`, background: `hsl(${hsva.h} 100% 50%)` }}
              />
            </div>

            {/* Alpha */}
            {alpha && (
              <div
                ref={alphaRef}
                role="slider"
                tabIndex={0}
                aria-label="Opacity"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(hsva.a * 100)}
                className="relative h-3 w-full cursor-pointer touch-none select-none rounded-full"
                style={{ background: checker }}
                onPointerDown={drag(alphaRef, (x) => update({ a: x }))}
                onKeyDown={slider(
                  () => hsva.a,
                  (v) => update({ a: v }),
                  0.01
                )}
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: `linear-gradient(to right, transparent, ${pureHex})` }}
                />
                <span
                  className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.4)]"
                  style={{ left: `${hsva.a * 100}%` }}
                />
              </div>
            )}

            {/* Presets */}
            {presets.length > 0 && (
              <div className="grid grid-cols-7 gap-1.5" role="listbox" aria-label="Preset colors">
                {presets.map((p) => {
                  const n = normalizeHex(p, true) ?? p
                  const selected = current.toLowerCase() === n.toLowerCase()
                  return (
                    <button
                      key={p}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      aria-label={p}
                      title={p}
                      className={cx([
                        'h-6 w-full rounded-md border border-body-3/30 cursor-pointer',
                        'transition-transform duration-150 hover:scale-110',
                        { value: 'ring-2 ring-primary ring-offset-1 ring-offset-second', condition: selected },
                      ])}
                      style={{ background: p }}
                      onClick={() => {
                        setHsva((prev) => ({ ...hexToHsva(n), h: hexToHsva(n).s === 0 ? prev.h : hexToHsva(n).h }))
                        commit(normalizeHex(n, alpha) ?? n)
                      }}
                    />
                  )
                })}
              </div>
            )}
          </dialog>
        )}
      </div>

      {fieldsetSuffix}

      <ConditionalWrapper childrenCondition={Boolean(inputHelper)}>
        {hasProps(inputHelper, 'children') ? (
          <InputHelper {...inputHelper} />
        ) : (
          <InputHelper>{inputHelper}</InputHelper>
        )}
      </ConditionalWrapper>

      <InputErrorMessage {...{ errors }} />
    </fieldset>
  )
})

ColorField.displayName = 'ColorField'
