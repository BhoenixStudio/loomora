import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Dropdown } from '../src/components/UI/Dropdown'

describe('Dropdown wrapper', () => {
  it('passes a consumer wrapper ref and keeps click-away working', () => {
    const ref = createRef<HTMLDivElement>()
    const onToggle = vi.fn()
    render(
      <>
        <Dropdown trigger="Open" wrapperProps={{ ref }} onToggle={onToggle}>
          {() => <span>menu item</span>}
        </Dropdown>
        <button type="button">outside</button>
      </>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('menu item')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }))
    expect(onToggle).toHaveBeenLastCalledWith(false)
  })

  it('spreads wrapper attributes onto the wrapper element', () => {
    const { container } = render(
      <Dropdown trigger="Open" wrapperProps={{ attributes: { title: 'dd-wrap' } }}>
        {() => <span>menu item</span>}
      </Dropdown>
    )

    expect(container.querySelector('div[title="dd-wrap"]')).not.toBeNull()
  })

  it('calls onToggle(false) when the menu item calls close', () => {
    const onToggle = vi.fn()
    render(
      <Dropdown trigger="Open" onToggle={onToggle}>
        {(close) => <button onClick={close}>choose</button>}
      </Dropdown>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByRole('button', { name: 'choose' }))

    expect(onToggle).toHaveBeenLastCalledWith(false)
  })
})
