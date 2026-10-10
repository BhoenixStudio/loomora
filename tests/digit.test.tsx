import { render, screen } from '@testing-library/react'
import { Digit, UseDigit } from '../src/components/UI/Digit'

describe('Digit edge cases', () => {
  it('renders zero instead of the fallback', () => {
    render(<Digit value={0} fallback="none" />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.queryByText('none')).toBeNull()
  })

  it('renders the fallback for undefined', () => {
    render(<Digit value={undefined} fallback="none" />)

    expect(screen.getByText('none')).toBeInTheDocument()
  })

  it('renders the fallback for null when not loading', () => {
    render(<Digit value={null} fallback="none" />)

    expect(screen.getByText('none')).toBeInTheDocument()
  })

  it('shows the loader for null when loading', () => {
    const { container } = render(<Digit value={null} fallback="none" loading />)

    expect(screen.queryByText('none')).toBeNull()
    expect(container.firstChild).not.toBeNull()
  })

  it('does not throw when decimalsMin is greater than decimalsMax', () => {
    expect(() => render(<Digit value={1.5} decimalsMin={5} decimalsMax={1} />)).not.toThrow()
  })

  it('does not throw for out-of-range decimal counts', () => {
    expect(() => render(<Digit value={1.5} decimalsMin={-1} decimalsMax={500} />)).not.toThrow()
  })
})

describe('UseDigit edge cases', () => {
  it('formats zero', () => {
    expect(UseDigit(0, { fallback: 'none' })).toBe('0')
  })

  it('returns the fallback for undefined', () => {
    expect(UseDigit(undefined, { fallback: 'none' })).toBe('none')
  })
})
