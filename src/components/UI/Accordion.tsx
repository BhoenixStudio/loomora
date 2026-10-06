'use client'

import { ComponentPropsWithoutRef, ElementType, ReactNode, useEffect, useRef, useState } from 'react'
import { cx } from '../../hooks'
import { ChildSize, CSSProps, GlobalElementEssentials as DEE } from '../../types'

type NativeElementProps<T extends ElementType> = DEE<T> &
  Omit<ComponentPropsWithoutRef<T>, 'className' | 'style' | 'ref' | 'id' | 'children'>

export type AccordionProps = NativeElementProps<'section'> & {
  size?: ChildSize[]
  title?: ReactNode
  initialCollapsed?: boolean
  setOpen?: (value: boolean) => void
  condition?: boolean
  children: ReactNode
  childrenClassName?: string
  hasEffects?: boolean
  index?: number
} & (
    | { allTitleClickable?: true; titleProps?: NativeElementProps<'button'> }
    | { allTitleClickable: false; titleProps?: NativeElementProps<'div'> }
  )

export type AccordionMiniProps = Pick<AccordionProps, 'title' | 'size' | 'className' | 'condition'>

export function Accordion(props: Readonly<AccordionProps>) {
  const {
    size = [],
    className,
    title,
    titleProps,
    initialCollapsed = false,
    setOpen,
    allTitleClickable = true,
    condition,
    attributes,
    children,
    childrenClassName = 'text-sm text-body-2 font-normal px-1',
    hasEffects = false,
    index = 1,
    style,
    ...attrs
  } = props

  const {
    className: tBClassName = 'text-title-1 text-md font-medium py-3',
    attributes: tBAttributes,
    ...tBAttrs
  } = (titleProps ?? {}) as NativeElementProps<'button'>
  const { onClick: onTBClick, ...restTBAttributes } = tBAttributes ?? {}

  const {
    className: tDClassName = 'py-3',
    attributes: tDAttributes,
    ...tDAttrs
  } = (titleProps ?? {}) as NativeElementProps<'div'>

  const headButtonRef = useRef<HTMLButtonElement>(null)
  const headDivRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLElement>(null)

  // States
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    if (condition === false) {
      setHasEntered(false)
      return
    }

    const element = containerRef.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setHasEntered(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      setHasEntered(true)
      observer.disconnect()
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [condition])

  // Configs
  const trigger = (
    <div
      className={cx([
        'loomora-accordion__trigger shrink-0 ms-auto',
        { value: 'cursor-pointer', condition: !allTitleClickable },
        { value: 'loomora-accordion__trigger--collapsed', condition: collapsed },
      ])}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...(!allTitleClickable && { onClick: () => handleCollapseChange() })}
      >
        <path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z" />
      </svg>
    </div>
  )

  let titleElement: ReactNode = (
    <div ref={headDivRef} className={cx(['flex flex-nowrap items-start', tDClassName])} {...tDAttributes} {...tDAttrs}>
      {title}
      {trigger}
    </div>
  )
  if (allTitleClickable)
    titleElement = (
      <button
        ref={headButtonRef}
        onClick={(e) => {
          handleCollapseChange()
          onTBClick?.(e)
        }}
        className={cx([
          'flex flex-nowrap items-start cursor-pointer',
          tBClassName,
          { value: 'loomora-accordion__title--effects', condition: hasEffects },
        ])}
        {...restTBAttributes}
        {...tBAttrs}
      >
        {title}
        {trigger}
      </button>
    )

  // Functions
  function handleCollapseChange() {
    setCollapsed(!collapsed)
    setOpen?.(!collapsed)
  }

  const accordionStyle: CSSProps = {
    ...style,
    '--loomora-accordion-entrance-delay': `${index * 0.1}s`,
  }

  if (condition === false) return null
  return (
    <section
      ref={containerRef}
      className={cx([
        'loomora-accordion flex flex-col flex-nowrap',
        { value: 'loomora-accordion--entered', condition: hasEntered },
        'transition-all duration-300 ease-in-out',
        ...size,
        className,
      ])}
      style={accordionStyle}
      {...attributes}
      {...attrs}
    >
      {titleElement}
      <div
        className={cx([
          'loomora-accordion__content',
          { value: 'loomora-accordion__content--collapsed', condition: collapsed },
          { value: childrenClassName, condition: typeof children === 'string' },
          { value: 'pt-1', condition: !collapsed },
        ])}
      >
        <div className="loomora-accordion__content-inner">{children}</div>
      </div>
    </section>
  )
}
