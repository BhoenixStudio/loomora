import { fireEvent, render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { describe, expect, it } from 'vitest'
import { DateField, DatePickerField, Input, LoomoraProvider } from '../src'

const wrapper = ({ children }: PropsWithChildren) => <LoomoraProvider>{children}</LoomoraProvider>

describe('DateField component', () => {
  it('renders with placeholder and label in date mode', () => {
    render(
      <DateField
        label="Birth Date"
        properties={{
          mode: 'date',
          value: '2025-05-15',
        }}
      />,
      { wrapper }
    )

    expect(screen.getByText('Birth Date')).toBeInTheDocument()
    const input = screen.getByDisplayValue('2025-05-15')
    expect(input).toBeInTheDocument()
  })

  it('renders time mode with formatted time', () => {
    render(
      <DateField
        label="Meeting Time"
        properties={{
          mode: 'time',
          value: '14:30',
          hour12: false,
        }}
      />,
      { wrapper }
    )

    expect(screen.getByText('Meeting Time')).toBeInTheDocument()
    expect(screen.getByDisplayValue('14:30')).toBeInTheDocument()
  })

  it('renders dateRange mode with start and end dates', () => {
    render(
      <DateField
        label="Trip Duration"
        properties={{
          mode: 'dateRange',
          value: ['2025-01-10', '2025-01-20'],
        }}
      />,
      { wrapper }
    )

    expect(screen.getByText('Trip Duration')).toBeInTheDocument()
    expect(screen.getByDisplayValue(/2025-01-10.*2025-01-20/)).toBeInTheDocument()
  })

  it('clears value when clear button is clicked', () => {
    let changedVal: unknown = 'init'
    render(
      <DateField
        label="Deadline"
        properties={{
          mode: 'date',
          value: '2025-12-31',
          allowClear: true,
          onChange: (val) => {
            changedVal = val
          },
        }}
      />,
      { wrapper }
    )

    const clearBtn = screen.getByLabelText('Clear date')
    expect(clearBtn).toBeInTheDocument()
    fireEvent.click(clearBtn)
    expect(changedVal).toBeNull()
  })

  it('renders via unified Input component with type="date"', () => {
    render(
      <Input
        type="date"
        label="Unified Date"
        properties={{
          mode: 'date',
          value: '2026-06-01',
        }}
      />,
      { wrapper }
    )

    expect(screen.getByText('Unified Date')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2026-06-01')).toBeInTheDocument()
  })

  it('DatePickerField alias is identical to DateField', () => {
    expect(DatePickerField).toBe(DateField)
  })
})
