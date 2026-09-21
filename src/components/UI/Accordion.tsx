"use client";

import { cn } from "../../hooks";
import { ChildSize, CSSProps, GlobalElementEssentials as DEE } from "../../types";
import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type NativeElementProps<T extends ElementType> = DEE<T> &
  Omit<ComponentPropsWithoutRef<T>, "className" | "style" | "ref" | "id" | "children">;

/**
 * ## Accordion
 *
 * Confirmed: this client component renders a title row and an always-mounted
 * content region whose height and opacity animate when the local collapsed
 * state changes. The title uses a clickable native `button` by default, or a
 * `div` title row with a chevron-only trigger when `allTitleClickable` is
 * `false`.
 *
 * ### File overview
 *
 * `AccordionProps` defines the component contract, including section
 * attributes, title configuration, layout classes, and the required
 * `children`. `AccordionMiniProps` is only a narrowed prop type; this file
 * does not export a separate mini accordion component.
 *
 * ### When to use
 *
 * - Use `Accordion` for independently expandable sections such as form
 *   sections or detail panels.
 * - Use `condition={false}` when the section should not render at all.
 * - Use `allTitleClickable={false}` only when the title row must remain
 *   non-clickable and the chevron should be the toggle target.
 * - Prefer a controlled disclosure abstraction when the parent must own the
 *   open state; this component exposes `initialCollapsed` and `setOpen`, but
 *   no controlled `open` prop.
 *
 * ### Developer guide
 *
 * Import `Accordion` from the `@components` barrel and provide `children`.
 * The component starts expanded unless `initialCollapsed` is `true`. Clicking
 * the active trigger toggles local state, calls `setOpen` with the next
 * boolean value when provided, rotates the chevron SVG, and animates the
 * content region between height `0` and `auto`.
 *
 * The outer section uses a native CSS one-time viewport entrance animation.
 * Its delay is `index * 0.1`, with `index` defaulting to `1`. `size` and
 * `className` are combined on that section. `attributes` is forwarded to the
 * outer section, while `titleProps` configures the title element for
 * the selected `allTitleClickable` mode.
 * In the default button mode, `titleProps.attributes.onClick` is called after
 * the internal toggle. In the non-clickable title mode, `titleProps.attributes`
 * are applied to the title `div`, but only the chevron's handler toggles the
 * accordion.
 *
 * ### Usage examples
 *
 * Minimal example:
 *
 * ```tsx
 * import { Accordion } from '@components'
 *
 * export function Details() {
 *   return <Accordion title='Details'>Additional details</Accordion>
 * }
 * ```
 *
 * Practical example with initial state, layout, effects, and an open-state
 * notification:
 *
 * ```tsx
 * import { Accordion } from '@components'
 *
 * export function PaymentDetails() {
 *   return (
 *     <Accordion
 *       title='Payment details'
 *       size={['md:col-span-6']}
 *       initialCollapsed
 *       hasEffects
 *       index={2}
 *       setOpen={(open) => console.log(open)}
 *     >
 *       <p>Payment information</p>
 *     </Accordion>
 *   )
 * }
 * ```
 *
 * The second example is illustrative: the surrounding component decides how
 * to use the `setOpen` notification and what content to render.
 *
 * ### AI agent guide
 *
 * - Preserve the `'use client'` directive, exported names, and the
 *   discriminated `allTitleClickable`/`titleProps` prop relationship.
 * - Preserve the exact `condition === false` early return, initial-only
 *   `initialCollapsed` behavior, and `setOpen` next-state notification.
 * - Keep children mounted while collapsed; the current implementation hides
 *   them with CSS rather than conditionally unmounting them.
 * - Reuse `cn`, the native chevron SVG, and the library stylesheet when
 *   extending styling or interaction behavior. Check `src/components/Forms/index.tsx` before
 *   changing the section contract because `FormSections` consumes it.
 * - Treat this source as manually maintained. Public prop, rendering, or
 *   animation changes are executable changes and require confirmation when
 *   the requested work is documentation-only.
 * - Confirm the focused project checks with `pnpm type:check`,
 *   `pnpm lint`, or `pnpm format:check` after source changes.
 *
 * ### Errors, edge cases, and limitations
 *
 * - There is no runtime validation for missing or invalid prop values.
 * - Only the exact value `false` hides the component; `undefined` and `true`
 *   render it.
 * - `children` remains mounted when collapsed, so descendant state is not
 *   reset by toggling the accordion.
 * - `childrenClassName` is applied automatically only when `children` is a
 *   primitive string. JSX elements, arrays, and other React nodes do not get
 *   that default class automatically.
 * - This file does not set `aria-expanded`, `aria-controls`, or a keyboard
 *   handler for the chevron-only mode. Verify the resulting accessibility
 *   behavior before using `allTitleClickable={false}`.
 * - No network, authentication, persistence, loading, or error state is
 *   handled here.
 *
 * ### Related references
 *
 * - `src/types/index.ts`: `GlobalElementEssentials` and `ChildSize`.
 * - `src/styles/index.css`: library-wide accordion animations.
 * - `src/components/Forms/index.tsx`: verified `FormSections` consumer.
 * - `src/components/index.ts`: public barrel export.
 */

/**
 * Public props for `Accordion`.
 *
 * The base native section props
 * contract supplies top-level `className`, `style`, and `id` values plus an
 * `attributes` object forwarded to the outer section. `titleProps` is
 * narrowed by `allTitleClickable`: the default/button mode accepts
 * native button props, while `false` accepts native div props.
 *
 * Defaults are `size=[]`, `initialCollapsed=false`,
 * `allTitleClickable=true`, `childrenClassName='text-sm text-body-2 font-normal px-1'`,
 * `hasEffects=false`, and `index=1`.
 *
 * @property size Additional `ChildSize` classes applied to the outer section.
 * @property title Optional title-row content.
 * @property initialCollapsed Initial local collapsed state; later prop changes
 *   do not synchronize the state.
 * @property setOpen Optional notification called with the next collapsed
 *   state after the trigger is activated. It does not control the component.
 * @property condition When exactly `false`, the component returns `null`.
 * @property children Required content rendered inside the animated region.
 * @property childrenClassName Class used for string children; it is not
 *   automatically applied to non-string React nodes.
 * @property hasEffects Adds the title button's hover and tap CSS effects
 *   when `allTitleClickable` is enabled.
 * @property index Multiplies the outer entrance delay by `0.1`.
 *
 * `allTitleClickable` defaults to `true`. Its default title classes are
 * `text-title-1 text-md font-medium py-3` in button mode and `py-3` in div
 * mode.
 */
export type AccordionProps = NativeElementProps<"section"> & {
  size?: ChildSize[];
  title?: ReactNode;
  initialCollapsed?: boolean;
  setOpen?: (value: boolean) => void;
  condition?: boolean;
  children: ReactNode;
  childrenClassName?: string;
  hasEffects?: boolean;
  index?: number;
} & (
    | { allTitleClickable?: true; titleProps?: NativeElementProps<"button"> }
    | { allTitleClickable: false; titleProps?: NativeElementProps<"div"> }
  );

/** A reusable subset of `AccordionProps` containing only title, sizing, class, and condition fields. */
export type AccordionMiniProps = Pick<AccordionProps, "title" | "size" | "className" | "condition">;

/**
 * Renders an animated, locally controlled disclosure section.
 *
 * @param props Accordion configuration and content.
 * @returns A native section, or `null` when `condition` is exactly `false`.
 * @remarks The default title is a native button that toggles the section. With
 *   `allTitleClickable={false}`, the title is a div and only its chevron icon
 *   invokes the internal collapse handler.
 */
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
    childrenClassName = "text-sm text-body-2 font-normal px-1",
    hasEffects = false,
    index = 1,
    style,
    ...attrs
  } = props;

  const {
    className: tBClassName = "text-title-1 text-md font-medium py-3",
    attributes: tBAttributes,
    ...tBAttrs
  } = (titleProps ?? {}) as NativeElementProps<"button">;
  const { onClick: onTBClick, ...restTBAttributes } = tBAttributes ?? {};

  const {
    className: tDClassName = "py-3",
    attributes: tDAttributes,
    ...tDAttrs
  } = (titleProps ?? {}) as NativeElementProps<"div">;

  const headButtonRef = useRef<HTMLButtonElement>(null);
  const headDivRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // States
  const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (condition === false) {
      setHasEntered(false);
      return;
    }

    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setHasEntered(true);
      observer.disconnect();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [condition]);

  // Configs
  const trigger = (
    <div
      className={cn([
        "loomora-accordion__trigger shrink-0 ms-auto",
        { value: "cursor-pointer", condition: !allTitleClickable },
        { value: "loomora-accordion__trigger--collapsed", condition: collapsed },
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
  );

  let titleElement: ReactNode = (
    <div
      ref={headDivRef}
      className={cn(["flex flex-nowrap items-start", tDClassName])}
      {...tDAttributes}
      {...tDAttrs}
    >
      {title}
      {trigger}
    </div>
  );
  if (allTitleClickable)
    titleElement = (
      <button
        ref={headButtonRef}
        onClick={(e) => {
          handleCollapseChange();
          onTBClick?.(e);
        }}
        className={cn([
          "flex flex-nowrap items-start cursor-pointer",
          tBClassName,
          { value: "loomora-accordion__title--effects", condition: hasEffects },
        ])}
        {...restTBAttributes}
        {...tBAttrs}
      >
        {title}
        {trigger}
      </button>
    );

  // Functions
  function handleCollapseChange() {
    setCollapsed(!collapsed);
    setOpen?.(!collapsed);
  }

  const accordionStyle: CSSProps = {
    ...style,
    "--loomora-accordion-entrance-delay": `${index * 0.1}s`,
  };

  if (condition === false) return null;
  return (
    <section
      ref={containerRef}
      className={cn([
        "loomora-accordion flex flex-col flex-nowrap",
        { value: "loomora-accordion--entered", condition: hasEntered },
        "transition-all duration-300 ease-in-out",
        ...size,
        className,
      ])}
      style={accordionStyle}
      {...attributes}
      {...attrs}
    >
      {titleElement}
      <div
        className={cn([
          "loomora-accordion__content",
          { value: "loomora-accordion__content--collapsed", condition: collapsed },
          { value: childrenClassName, condition: typeof children === "string" },
          { value: "pt-1", condition: !collapsed },
        ])}
      >
        <div className="loomora-accordion__content-inner">{children}</div>
      </div>
    </section>
  );
}

/**
 * Documentation metadata
 *
 * Last documentation update: 2026-09-18
 * Documentation audience: Developers and AI agents
 * Evidence basis: Attached file + verified project context
 * Documentation coverage: Complete
 * Validation: Passed focused Prettier and ESLint checks. The repository-wide
 * type check remains blocked by pre-existing missing barrels and aliases.
 * Known limitations: No controlled `open` prop and no explicit ARIA expanded/controls attributes in this file.
 */
