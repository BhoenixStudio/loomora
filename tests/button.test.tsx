import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Button } from '../src/components/UI/Button'

describe('Button loading state', () => {
  it('does not call onClick while loading', () => {
    const onClick = vi.fn()
    render(<Button loading onClick={onClick} title="Save" />)

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('disables the button and sets aria-busy while loading', () => {
    render(<Button loading title="Save" />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('blocks link clicks while loading', () => {
    const onClick = vi.fn()
    render(<Button loading href="/next" onClick={onClick} title="Open" />)

    const link = screen.getByRole('link')
    fireEvent.click(link)

    expect(onClick).not.toHaveBeenCalled()
    expect(link).toHaveAttribute('aria-disabled', 'true')
  })
})

describe('Button id and content', () => {
  it('applies id to the regular button', () => {
    render(<Button id="save-btn" title="Save" />)

    expect(screen.getByRole('button')).toHaveAttribute('id', 'save-btn')
  })

  it('applies id to the link', () => {
    render(<Button id="home-link" href="/" title="Home" />)

    expect(screen.getByRole('link')).toHaveAttribute('id', 'home-link')
  })

  it('renders children together with icons when both title and children are set', () => {
    render(
      <Button title="ignored" startIcon={<span>start</span>}>
        <span>child content</span>
      </Button>
    )

    expect(screen.getByText('child content')).toBeInTheDocument()
    expect(screen.getByText('start')).toBeInTheDocument()
  })
})

describe('Button ref forwarding', () => {
  it('attaches the forwarded ref to the button element', () => {
    const ref = createRef<HTMLButtonElement | HTMLAnchorElement>()
    render(<Button ref={ref} title="Save" />)

    expect(ref.current).toBe(screen.getByRole('button'))
  })

  it('attaches the forwarded ref to the link element', () => {
    const ref = createRef<HTMLButtonElement | HTMLAnchorElement>()
    render(<Button ref={ref} href="/next" title="Open" />)

    expect(ref.current).toBe(screen.getByRole('link'))
  })
})
