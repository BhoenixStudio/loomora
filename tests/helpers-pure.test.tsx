import { render } from '@testing-library/react'
import { ProgressBar } from '../src/components/Partials/ProgressBar'
import { Loader } from '../src/components/Partials/Loader'
import { UseCase, IsValidSlug } from '../src/hooks/casify'
import { useStrict } from '../src/hooks/strict'
import { renderHook } from '@testing-library/react'
import { useHue } from '../src/hooks/chroma'

describe('useStrict', () => {
  it('accepts a numeric enum value that is in the allowed list', () => {
    const { result } = renderHook(() => useStrict())
    const { isValid, variables } = result.current.check({
      level: { type: 'enum', value: 1, allowedValues: [1, 2] },
    })

    expect(isValid).toBe(true)
    expect(variables).toEqual({ level: 1 })
  })

  it('accepts zero when isEmptyValid is set on a number', () => {
    const { result } = renderHook(() => useStrict())
    const { isValid, variables } = result.current.check({
      count: { type: 'number', value: 0, isEmptyValid: true },
    })

    expect(isValid).toBe(true)
    expect(variables).toEqual({ count: 0 })
  })

  it('emits no error when condition is false', () => {
    const { result } = renderHook(() => useStrict())
    const { errors } = result.current.check({
      name: { type: 'string', value: '', condition: false, errorMessage: 'required' },
    })

    expect(errors).toEqual([])
  })

  it('rejects a string value for a number type', () => {
    const { result } = renderHook(() => useStrict())
    const { isValid } = result.current.check({
      amount: { type: 'number', value: '5' as unknown as number, errorMessage: 'bad' },
    })

    expect(isValid).toBe(false)
  })

  it('stores only the valid items of an array field', () => {
    const { result } = renderHook(() => useStrict())
    const { variables } = result.current.check({
      ids: { type: 'numbers', value: [1, -2, 3] },
    })

    expect(variables).toEqual({ ids: [1, 3] })
  })
})

describe('useHue', () => {
  it('returns null-safe values for invalid hex input', () => {
    const { result } = renderHook(() => useHue())

    expect(result.current.hex2rgb('#zzzzzz')).toBeNull()
    expect(result.current.isDark('')).toBe(false)
    expect(result.current.hex2hsl('nope')).toBeNull()
  })

  it('accepts 3, 4, 6, and 8 digit hex', () => {
    const { result } = renderHook(() => useHue())

    expect(result.current.hex2rgb('#f00')).toEqual([255, 0, 0])
    expect(result.current.hex2rgb('#ff0000')).toEqual([255, 0, 0])
    expect(result.current.hex2rgb('#f008')).toEqual([255, 0, 0])
    expect(result.current.hex2rgb('#ff000080')).toEqual([255, 0, 0])
  })

  it('treats negative hue as its positive equivalent', () => {
    const { result } = renderHook(() => useHue())

    expect(result.current.hsl2rgb(-120, 100, 50)).toEqual(result.current.hsl2rgb(240, 100, 50))
  })

  it('keeps non-finite channel values out of hex output', () => {
    const { result } = renderHook(() => useHue())

    expect(result.current.rgb2hex(Number.NaN, 0, 0)).toBe('#000000')
  })
})

describe('UseCase', () => {
  it('keeps non-ASCII letters for normal and camel formats', () => {
    expect(UseCase('中文', 'NORMAL')).toBe('中文')
    expect(UseCase('café naïve', 'CAMEL')).toBe('caféNaïve')
  })

  it('transliterates to ASCII for SLUG and passes IsValidSlug', () => {
    const slug = UseCase('café naïve', 'SLUG')

    expect(slug).toBe('cafe-naive')
    expect(IsValidSlug(slug)).toBe(true)
  })
})

describe('ProgressBar and Loader numeric edge cases', () => {
  it('renders 0% when outOf is zero', () => {
    const { container } = render(<ProgressBar value={5} outOf={0} showValueAsText />)

    expect(container.textContent).toContain('0%')
    expect(container.textContent).not.toContain('NaN')
  })

  it('renders a valid CSS width for a non-numeric loader width', () => {
    const { container } = render(<Loader variant="text" counts={2} width="auto" />)
    const widths = Array.from(container.querySelectorAll('[style]')).map((el) => (el as HTMLElement).style.width)

    expect(widths.some((w) => w.includes('NaN'))).toBe(false)
    expect(widths.at(-1)).toBe('calc(auto * 0.8)')
  })

  it('rounds a rem width scaled for the last text line', () => {
    const { container } = render(<Loader variant="text" counts={2} width="12rem" />)
    const widths = Array.from(container.querySelectorAll('[style]')).map((el) => (el as HTMLElement).style.width)

    expect(widths.at(-1)).toBe('9.6rem')
  })
})
