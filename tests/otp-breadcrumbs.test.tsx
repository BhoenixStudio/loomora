import { render, screen } from '@testing-library/react'
import { OtpField } from '../src/components/Form/Inputs/Otp'
import { Breadcrumbs } from '../src/components/Partials/Breadcrumbs'

describe('OtpField text output', () => {
  it('renders no stray x text when label, helper, and error are set', () => {
    const { container } = render(
      <OtpField label="Code" inputHelper="Enter the code" error errorHelper="Wrong code" properties={{ value: [] }} />
    )

    expect(screen.getByText('Code')).toBeInTheDocument()
    expect(container.textContent?.includes('x')).toBe(false)
  })
})

describe('Breadcrumbs', () => {
  it('never shows a separator after the last item, even when an item requests one', () => {
    const { container } = render(
      <Breadcrumbs separator="/" items={[{ title: 'Home' }, { title: 'Docs', showSeparator: true }]} />
    )

    expect(container.textContent).toBe('Home/Docs')
    expect(container.textContent?.endsWith('/')).toBe(false)
  })

  it('renders items with the self-stretch default class', () => {
    const { container } = render(<Breadcrumbs items={[{ title: 'Home' }]} />)

    expect(container.querySelector('.self-stretch')).not.toBeNull()
  })
})
