"use client";

import { ReactNode } from "react";
import { useLoomoraConfig } from "../../config";
import { cn } from "../../hooks";
import { Button, ButtonProps } from "../index";

export type BreadcrumbProps = Pick<
  ButtonProps,
  "title" | "startIcon" | "endIcon" | "href" | "className"
> & { separator?: ReactNode; showSeparator?: boolean; active?: boolean; condition?: boolean };

export type BreadcrumbsProps = {
  items: BreadcrumbProps[];
  separator?: ReactNode;
  className?: string;
};

export function Breadcrumb(props: Readonly<BreadcrumbProps>) {
  const {
    title,
    href,
    startIcon,
    endIcon,
    separator,
    showSeparator,
    active = false,
    condition,
    className = "align-self:stretch",
  } = props;

  // Configs
  const isLink = Boolean(href);
  const classes = cn([
    "breadcrumb text-xs border-none",
    {
      value: "text-primary p-1",
      fallback: {
        value: "text-title-2 hover:text-primary text-underline rounded font-medium",
        fallback: "text-body-2 p-0",
        condition: isLink,
      },
      condition: active,
    },
    className,
  ]);

  if (condition === false) return null;
  return (
    <>
      <Button
        variant="none"
        className={classes}
        {...{ title, startIcon, endIcon, ...(href && { href }) }}
      />
      {showSeparator && separator}
    </>
  );
}

export function Breadcrumbs(props: Readonly<BreadcrumbsProps>) {
  const { items, separator, className = "flex flex-wrap gap-2", ...attrs } = props;

  const { breadcrumbs } = useLoomoraConfig();
  const dSeparator = separator ?? breadcrumbs?.defaultSeparator;

  // Configs
  const dItems: BreadcrumbProps[] = [];
  items?.filter(({ condition }) => condition !== false)?.forEach((item) => dItems.push(item));

  return (
    <section className={cn(["breadcrumbs items-center", className])} {...attrs}>
      {dItems.map((item, i: number) => (
        <Breadcrumb
          key={i}
          showSeparator={i !== dItems.length - 1}
          separator={dSeparator}
          {...item}
        />
      ))}
    </section>
  );
}
