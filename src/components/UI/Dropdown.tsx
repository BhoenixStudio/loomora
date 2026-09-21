"use client";

/**
 * # Dropdown
 *
 * `Dropdown.tsx` defines a client-side menu primitive with local open state.
 * It renders a shared `Button` trigger and an absolutely positioned,
 * CSS-animated menu inside a relative wrapper.
 *
 * ## File overview
 *
 * `DropdownProps` describes the trigger content, render-prop menu content,
 * wrapper and trigger passthrough props, menu classes, open-state notification,
 * and placement options. `Dropdown` owns the open/closed state, composes
 * `UseClickOutside` and `UseCalculatePosition`, and passes a close callback to
 * the menu content.
 *
 * Confirmed responsibilities:
 * - Toggle the menu when the shared button is activated.
 * - Close the menu after a mouse or touch start outside the wrapper.
 * - Choose a calculated or static logical placement for the menu.
 * - Animate menu entry and exit with native CSS animations.
 *
 * This file does not own application data, network requests, authentication,
 * persistence, loading or error state for menu content, focus management,
 * keyboard Escape handling, or a controlled `open` prop. The caller supplies
 * the trigger and menu content.
 *
 * ## When to use
 *
 * - Use `Dropdown` for a compact action menu, filter menu, account menu, or
 *   other content that should be anchored to a button and dismissed outside
 *   its wrapper.
 * - Use the function-valued `children` prop when a menu item needs to close
 *   the menu after its action by calling the supplied `close` callback.
 * - Use `staticPosition` when a known placement should be used instead of the
 *   viewport calculation. Leave it `false` when the menu should react to the
 *   available viewport space.
 * - Prefer `Dialog` for modal content, focus-oriented workflows, or content
 *   that should not be treated as a button-anchored menu.
 * - Prefer a controlled disclosure abstraction when a parent must own the
 *   open state; `Dropdown` exposes `onToggle` as a notification, not a state
 *   setter or controlled value.
 *
 * ## Developer guide
 *
 * Import `Dropdown` from the `@components` barrel. Because the public
 * `children` contract is a function-valued render prop, the consuming
 * interactive component must be able to provide a client-side callback in the
 * Next.js application.
 *
 * The default configuration is:
 *
 * - `menuClassName`: `w-56 rounded-2xl border border-third bg-main p-2
 *   shadow-lg`.
 * - `staticPosition`: `false`, so `UseCalculatePosition` supplies placement.
 * - `position`: `TOP_START`, used when `staticPosition` is `true`.
 * - The wrapper always includes `relative` and combines it with
 *   `wrapperProps.className`.
 * - The menu always includes `absolute z-50`, then adds its calculated or
 *   static side classes and `menuClassName`.
 *
 * The interaction flow is:
 *
 * 1. The shared `Button` receives `trigger` as its children. Its internal
 *    click handler toggles local state and then invokes `triggerProps.onClick`
 *    when supplied.
 * 2. While open, `UseClickOutside` listens for `mousedown` and `touchstart`
 *    events outside the wrapper and requests a close.
 * 3. While open, `UseCalculatePosition` measures the wrapper and menu and
 *    returns `{ v: 'top' | 'bottom', h: 'start' | 'end' }`. The menu uses
 *    `bottom-full` or `top-full` and logical `inset-s-0` or `inset-e-0` to
 *    apply that result.
 * 4. The menu is mounted while open and remains mounted until its CSS exit
 *    animation completes. The render-prop child receives a `close: () => void`,
 *    which requests `handleToggle(false)`.
 * 5. `onToggle`, when supplied, is called with the requested next state for
 *    every internal toggle path. It reports the state request immediately; it
 *    does not wait for the 150 ms exit animation to finish.
 *
 * `wrapperProps` are forwarded to the outer `div` except for `children`, while
 * `triggerProps` are forwarded to the shared regular-button `Button` except
 * that `onClick` is composed by this component. The trigger type does not
 * expose link-specific `href` props. The shared `Button` still applies its
 * own content, loading, tooltip, and attribute behavior to `triggerProps`.
 *
 * ## Usage examples
 *
 * Minimal render-prop menu:
 *
 * ```tsx
 * import { Dropdown } from '@components'
 *
 * export function ActionsMenu() {
 *   return (
 *     <Dropdown trigger='Actions'>
 *       {(close) => (
 *         <button type='button' onClick={close}>
 *           Close menu
 *         </button>
 *       )}
 *     </Dropdown>
 *   )
 * }
 * ```
 *
 * Illustrative example: the surrounding component supplies the client-side
 * event handlers and decides what `onToggle` should do.
 *
 * Static placement with shared button options and a custom menu class:
 *
 * ```tsx
 * import { Dropdown } from '@components'
 *
 * export function MoreMenu() {
 *   return (
 *     <Dropdown
 *       trigger='More'
 *       staticPosition
 *       position='BOTTOM_END'
 *       wrapperProps={{ id: 'more-menu', className: 'inline-block' }}
 *       triggerProps={{
 *         variant: 'outline',
 *         color: 'second',
 *         attributes: { 'aria-label': 'More actions' },
 *       }}
 *       menuClassName='w-64 rounded-xl border border-third bg-main p-2 shadow-lg'
 *       onToggle={(opened) => console.log('menu opened:', opened)}
 *     >
 *       {(close) => (
 *         <button type='button' onClick={close}>
 *           Archive
 *         </button>
 *       )}
 *     </Dropdown>
 *   )
 * }
 * ```
 *
 * Illustrative example: the shown props and values are verified against the
 * public type, but the surrounding event policy and menu item styling are not
 * defined by this file.
 *
 * ## AI agent guide
 *
 * Preserve the `'use client'` directive, the exported `Dropdown` and
 * `DropdownProps` names, and the required `trigger` and function-valued
 * `children` contract. Preserve the ordering of toggle behavior: local state
 * is updated before `onToggle`, and the internal toggle runs before the
 * caller's `triggerProps.onClick`.
 *
 * Reuse the existing `Button`, `cn`, `UseClickOutside`, and
 * `UseCalculatePosition` abstractions. Safe extension
 * points are the documented wrapper props, trigger props, menu class override,
 * placement options, and caller-owned menu content. Check the shared Button
 * contract before changing trigger content or attributes, and check
 * `src/hooks/ElementFns.ts` before changing outside-event or placement logic.
 *
 * This is manually maintained source; no generated marker is present. Changes
 * to the open-state contract, outside-event behavior, placement mapping,
 * animation timing, or accessibility behavior affect every consumer and
 * require consumer review when the requested work is documentation-only.
 * Relevant project validation commands are `pnpm type:check`,
 * `pnpm lint`, and `pnpm format:check`.
 *
 * ## Errors, edge cases, and limitations
 *
 * - There is no runtime validation for missing or invalid prop values. The
 *   public type requires a function for `children`; the runtime fallback for a
 *   non-function child is only reachable through a type escape or JavaScript
 *   usage and is not part of the typed contract.
 * - `Dropdown` has no controlled `open` or `setOpen` prop. `onToggle` observes
 *   internal requests and cannot prevent or directly control them.
 * - Outside dismissal handles `mousedown` and `touchstart` only. Escape,
 *   focus changes, and focus restoration are not implemented here.
 * - This file does not add `aria-expanded`, `aria-controls`, a menu role,
 *   roving focus, focus trapping, or keyboard handlers for menu items. The
 *   caller must provide suitable accessible names, semantics, and interaction
 *   behavior for the supplied content.
 * - Dynamic placement is recalculated when the menu opens and on window
 *   resize or captured scroll through `UseCalculatePosition`. Changes to menu
 *   content size alone are not observed by that hook.
 * - With `staticPosition`, vertical placement treats `TOP_*` as above and
 *   `BOTTOM_*` as below. Horizontal placement treats only `*_START` as
 *   `start`; `TOP_LEFT`, `TOP_RIGHT`, `BOTTOM_LEFT`, and `BOTTOM_RIGHT` all
 *   resolve to the `end` class in the current implementation.
 * - `wrapperProps.ref` is spread after the internal wrapper ref and can
 *   replace it. Supplying that ref can prevent outside-click handling and
 *   calculated positioning from observing the wrapper.
 * - Because the trigger is the shared `Button`, a truthy `triggerProps.title`
 *   follows Button's content precedence and can replace the `trigger` node;
 *   `triggerProps.loading` can likewise replace normal trigger content.
 * - No network, authentication, persistence, or Dropdown-specific loading or
 *   error handling is performed here.
 *
 * ## Related references
 *
 * - `src/components/index.ts`: re-exports `Dropdown` and `DropdownProps`
 *   through `@components`.
 * - `src/components/UI/Button/index.tsx`: defines the Button prop contracts
 *   and rendering behavior used by the trigger.
 * - `src/hooks/ElementFns.ts`: defines the outside-event and viewport
 *   placement hooks used by this component.
 * - `src/hooks/index.ts`: re-exports the hooks through `@hooks`.
 * - `src/@types/Global.ts`: defines `GlobalElement` used by `wrapperProps`.
 * - `src/@types/index.ts`: re-exports `GlobalElement` through `@types`.
 * - `tsconfig.json`: confirms the `@components`, `@hooks`, and `@types` path
 *   aliases.
 * - `instructions/code-rules.md`: applicable TypeScript, React, client-side,
 *   animation, semantic-color, and logical RTL project rules.
 * - `instructions/UI-UX skill.md`: inspected project guidance for keyboard,
 *   accessibility, animation, responsive, and RTL considerations.
 *
 * ## Assumptions and unknowns
 *
 * - Confirmed: `Dropdown` is re-exported from the UI barrel.
 * - Confirmed: no direct in-project `<Dropdown>` consumer was found in the
 *   scoped `src` search, so consumer-specific menu semantics are unknown.
 * - Unknown: browser-specific layout behavior and the accessibility of caller-
 *   supplied menu content are not tested by this file.
 */
import { Button, ButtonBaseProps, RegularButtonProps } from "../index";
import { UseCalculatePosition, UseClickOutside, cn } from "../../hooks";
import { GlobalElement } from "../../types";
import { AnimationEvent, MouseEvent, ReactNode, useRef, useState } from "react";

/**
 * Public configuration for `Dropdown`.
 *
 * @property trigger Content rendered by the shared `Button` trigger. It is
 *   passed as Button children unless a truthy `triggerProps.title` takes
 *   precedence through the shared Button contract.
 * @property children Required function-valued menu content. The callback
 *   receives a close function that requests the menu to close and returns the
 *   content rendered inside the animated menu.
 * @property wrapperProps Native and shared `div` props forwarded to the outer
 *   wrapper, except for `children`. Its `className` is combined with the
 *   component's required `relative` class.
 * @property triggerProps Shared Button options and regular-button props. Its
 *   `onClick` is called after Dropdown toggles its local state; link-specific
 *   `href` props are not part of the trigger contract.
 * @property menuClassName Classes appended to the menu after its required
 *   absolute-positioning classes. Defaults to
 *   `w-56 rounded-2xl border border-third bg-main p-2 shadow-lg`.
 * @property onToggle Optional notification called with the requested next
 *   open state whenever Dropdown toggles or closes.
 * @property staticPosition When true, use the `position` token directly
 *   instead of the viewport calculation. Defaults to `false`.
 * @property position Static placement token. Defaults to `TOP_START`; it is
 *   used for layout only when `staticPosition` is true.
 */
export type DropdownProps = {
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  wrapperProps?: Omit<GlobalElement<"div">, "children">;
  triggerProps?: ButtonBaseProps & Omit<RegularButtonProps, "children" | "title" | "icon" | "href">;
  menuClassName?: string;
  onToggle?: (opened: boolean) => void;
  staticPosition?: boolean;
  position?:
    | "TOP_START"
    | "TOP_END"
    | "TOP_LEFT"
    | "TOP_RIGHT"
    | "BOTTOM_START"
    | "BOTTOM_END"
    | "BOTTOM_LEFT"
    | "BOTTOM_RIGHT";
};

/**
 * Renders a locally controlled, animated button-anchored dropdown menu.
 *
 * @param props Trigger, menu, wrapper, placement, and toggle configuration.
 * @returns The wrapper, trigger button, and conditionally mounted animated
 *   menu.
 * @remarks The component closes on outside mouse/touch starts and exposes a
 *   close callback through its function-valued `children` prop. It does not
 *   provide controlled state, focus management, or menu-item keyboard
 *   behavior.
 */
export function Dropdown(props: Readonly<DropdownProps>) {
  const {
    wrapperProps,
    trigger,
    triggerProps,
    children,
    menuClassName = "w-56 rounded-2xl border border-third bg-main p-2 shadow-lg",
    onToggle,
    staticPosition = false,
    position: sPosition = "TOP_START",
  } = props;

  const { className = "", ...wrapperRestProps } = wrapperProps ?? {};
  const { onClick, ...triggerRestProps } = triggerProps ?? {};

  // Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // States
  const [open, setOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);

  // Functions
  const handleToggle = (newState: boolean) => {
    setOpen(newState);
    if (newState) setMenuMounted(true);
    onToggle?.(newState);
  };
  const handleMenuAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (
      event.animationName === "loomora-dropdown-exit" &&
      !open &&
      event.target === event.currentTarget
    )
      setMenuMounted(false);
  };
  const getStaticPosition = (pos: DropdownProps["position"]) => {
    if (!pos) pos = sPosition;
    return {
      v: (pos.startsWith("TOP_") ? "top" : "bottom") as "top" | "bottom",
      h: (pos.endsWith("_START") ? "start" : "end") as "start" | "end",
    };
  };

  // Hooks
  UseClickOutside(open, wrapperRef, () => handleToggle(false));
  const calculatedPosition = UseCalculatePosition(open, wrapperRef, menuRef);
  const position = staticPosition ? getStaticPosition(sPosition) : calculatedPosition;

  return (
    <div ref={wrapperRef} className={cn(["relative", className])} {...wrapperRestProps}>
      <Button
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          handleToggle(!open);
          onClick?.(e);
        }}
        {...triggerRestProps}
      >
        {trigger}
      </Button>

      {menuMounted && (
        <div
          ref={menuRef}
          onAnimationEnd={handleMenuAnimationEnd}
          className={cn([
            "loomora-dropdown absolute z-50",
            open ? "loomora-dropdown--enter" : "loomora-dropdown--exit",
            position.v === "top"
              ? "loomora-dropdown--top bottom-full mb-2"
              : "loomora-dropdown--bottom top-full mt-2",
            position.h === "start" ? "inset-s-0" : "inset-e-0",
            menuClassName,
          ])}
        >
          {typeof children === "function" ? children(() => handleToggle(false)) : children}
        </div>
      )}
    </div>
  );
}

/**
 * Documentation metadata
 *
 * Last documentation update: 2026-09-18
 * Documentation audience: Developers and AI agents
 * Evidence basis: Attached file + verified project context
 * Documentation coverage: Complete
 * Validation: Passed `pnpm exec prettier --check src/components/UI/Dropdown.tsx`,
 * `pnpm exec eslint src/components/UI/Dropdown.tsx`, and `pnpm type:check`.
 * Known limitations: No direct in-project Dropdown consumer or dedicated
 * Dropdown test was found; browser layout and caller-supplied menu semantics
 * remain unvalidated.
 */
