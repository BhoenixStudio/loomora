"use client";

import { ReactNode } from "react";
import { useLoomoraConfig } from "../../../config";
import { cn } from "../../../hooks";
import { CSSProps } from "../../../types";
import { ButtonProps, ButtonVariant, LinkButtonProps, RegularButtonProps } from "./helper";

export function Button(props: Readonly<ButtonProps>) {
  const {
    variant = "fill",
    size = "default",
    color,
    corner = "default",
    borderThick = 1,
    animate = true,
    className: customClass = "",
    style: customStyle,
    title,
    startIcon,
    endIcon,
    loading,
    loaderTitle,
    loaderStartIcon,
    loaderEndIcon,

    children,
    condition,
  } = props;

  const {
    ref: linkRef,
    href,
    referrerPolicy,
    target,
    onClick: linkClick,
    attributes: linkAttrs,
    download = false,
  } = props as LinkButtonProps;

  const {
    ref: buttonRef,
    onClick: buttonClick,
    type = "button",
    attributes: buttonAttrs,
    disabled = false,
  } = props as RegularButtonProps;

  const { LinkType, button } = useLoomoraConfig();

  const { defaultType, defaultColor, defaultLoadingTitle, sizes, colors, corners } = button ?? {};

  // Configs
  const sVariant = variant as Exclude<ButtonVariant, "none">;
  const { border, background, text } = colors?.[sVariant]?.[color ?? defaultColor ?? ""] ?? {};

  const className = cn([
    // Core
    "loomora-btn select-none transition-all duration-200 ease-in-out whitespace-nowrap",
    { value: "inline-flex", condition: !/^d-(flex|block|grid|inline)/.test(customClass) },
    {
      value: "justify-center",
      condition: !/^justify-(center|start|end|between|around|evenly)/.test(customClass),
    },
    // Sizes
    {
      value: [
        ...sanitizeItem(sizes?.[size]?.fill?.textSize),
        ...sanitizeItem(sizes?.[size]?.fill?.textWeight),
        ...sanitizeItem(sizes?.[size]?.fill?.gap),
        ...sanitizeItem(sizes?.[size]?.fill?.padding),
      ],
      condition: ["fill"].includes(variant),
    },
    {
      value: [
        ...sanitizeItem(sizes?.[size]?.outline?.textSize),
        ...sanitizeItem(sizes?.[size]?.outline?.textWeight),
        ...sanitizeItem(sizes?.[size]?.outline?.gap),
        ...sanitizeItem(sizes?.[size]?.outline?.padding),
      ],
      condition: ["outline"].includes(variant),
    },
    {
      value: [
        ...sanitizeItem(sizes?.[size]?.text?.textSize),
        ...sanitizeItem(sizes?.[size]?.text?.textWeight),
        ...sanitizeItem(sizes?.[size]?.text?.gap),
        ...sanitizeItem(sizes?.[size]?.text?.padding),
      ],
      condition: ["text"].includes(variant),
    },
    // Colors
    {
      value: [
        { value: String(border), condition: Boolean(border) },
        { value: String(background), condition: Boolean(background) },
        { value: String(text), condition: Boolean(text) },
      ],
      fallback: [
        { value: "bg-inherit", condition: variant === "fill" },
        { value: "border-inherit text-inherit", condition: variant === "outline" },
        { value: "text-inherit", condition: variant === "text" },
      ],
      condition: color !== "inherit",
    },
    // Corners
    { value: corners?.[corner], condition: !["none"].includes(variant) },
    // Others
    { value: "cursor-not-allowed", fallback: "cursor-pointer", condition: loading || disabled },
    {
      value:
        "hover:transform hover:-translate-y-[3px] hover:scale-[0.99] focus:transform focus:-translate-y-[3px] focus:scale-[0.99]",
      condition: !loading && !disabled && !["none", "text"].includes(variant) && animate,
    },
    customClass,
  ]);

  const style: CSSProps = {
    ...customStyle,
    ...(variant === "outline" && { borderWidth: borderThick }),
  };

  // Components
  let content: ReactNode = children;
  if (loading)
    content = (
      <>
        {loaderStartIcon}
        {title && (loaderTitle ?? defaultLoadingTitle)}
        {loaderEndIcon}
      </>
    );
  else if (title || startIcon || endIcon)
    content = (
      <>
        {startIcon}
        {title}
        {endIcon}
      </>
    );

  let wrapper: ReactNode = (
    <button
      ref={buttonRef}
      onClick={buttonClick}
      type={type ?? defaultType}
      {...{ className, disabled, style, ...buttonAttrs }}
    >
      {content}
    </button>
  );
  if (href)
    wrapper = (
      <LinkType
        ref={linkRef}
        href={String(href)}
        onClick={linkClick}
        {...{ className, target, referrerPolicy, download, style, ...linkAttrs }}
      >
        {content}
      </LinkType>
    );

  // Functions
  function sanitizeItem<T>(item: "" | T | undefined) {
    if (!item) return [];
    if (typeof item === "string") return [item];
    return item;
  }

  if (condition === false) return null;
  return <>{wrapper}</>;
}
