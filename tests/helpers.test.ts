import { copy, fade } from '../src/hooks'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('fade', () => {
  it('leaves the element closed when out runs after in, using the returned cancel', () => {
    vi.useFakeTimers()
    const setOpen = vi.fn()
    const setShow = vi.fn()

    const cancelIn = fade('in', { open: false, setOpen, setShow }, { period: 100 })
    cancelIn()
    fade('out', { open: false, setOpen, setShow }, { closePeriod: 50 })
    vi.advanceTimersByTime(200)

    expect(setOpen).toHaveBeenLastCalledWith(false)
    expect(setOpen).not.toHaveBeenCalledWith(true)
  })

  it('cancel prevents the pending late setOpen', () => {
    vi.useFakeTimers()
    const setOpen = vi.fn()

    const cancel = fade('in', { open: false, setOpen }, { period: 100 })
    cancel()
    vi.advanceTimersByTime(200)

    expect(setOpen).not.toHaveBeenCalled()
  })

  it('a consumer that cancels the previous fade before the next one prevents the stale open', () => {
    vi.useFakeTimers()
    const setOpen = vi.fn()

    const previous = fade('in', { open: false, setOpen }, { period: 100 })
    previous()
    fade('out', { open: true, setOpen }, { closePeriod: 100 })
    vi.advanceTimersByTime(200)

    expect(setOpen).not.toHaveBeenCalledWith(true)
  })
})

describe('copy', () => {
  it('returns true and calls onCopy when the clipboard write succeeds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const onCopy = vi.fn()

    await expect(copy('hello', { onCopy })).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
    expect(onCopy).toHaveBeenCalledWith('"hello" successfully copied to clipboard')
    vi.unstubAllGlobals()
  })

  it('returns false when the clipboard write fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })

    await expect(copy('hello')).resolves.toBe(false)
    expect(error).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })

  it('does not report a consumer onCopy error as a copy failure', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    const onCopy = vi.fn(() => {
      throw new Error('consumer bug')
    })

    await expect(copy('hello', { onCopy })).rejects.toThrow('consumer bug')
    expect(error).not.toHaveBeenCalledWith('Failed to copy to clipboard:', expect.anything())
    vi.unstubAllGlobals()
  })

  it('returns false and does nothing when disabled', async () => {
    const writeText = vi.fn()
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    await expect(copy('hello', { disabled: true })).resolves.toBe(false)
    expect(writeText).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
