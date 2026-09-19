import { ComponentPropsWithRef, CSSProperties, ElementType } from "react";

export type CSSProps = CSSProperties & Record<`--${string}`, string | undefined>;

export type GlobalElement<T extends ElementType> = ComponentPropsWithRef<T> & {
  style?: CSSProps;
  clearDefaultClassName?: boolean;
};

export type GlobalElementEssentials<T extends ElementType> = {
  className?: string;
  clearDefaultClassName?: boolean;
  style?: CSSProps;
  ref?: ComponentPropsWithRef<T>["ref"];
  id?: string;
  dir?: "ltr" | "rtl";
  attributes?: Omit<ComponentPropsWithRef<T>, "className" | "style" | "ref" | "id">;
};

export type GlobalElementMinimal<T extends ElementType> = Pick<
  GlobalElementEssentials<T>,
  "className" | "style" | "ref" | "id"
>;

export type SingleOrArray<T> = T | T[];

export type SpaceSize = "sm" | "md" | "lg" | "xl" | "2xl";
export type WrapperSize = `${SpaceSize}:grid-cols-${number}` | `grid-cols-${number}`;
export type ChildSize = `${SpaceSize}:col-span-${number}` | `col-span-${number}`;

export type Enumerate<
  N extends number,
  E extends number[] = [],
  T extends number[] = [],
> = T["length"] extends N ? Exclude<T[number], E[number]> : Enumerate<N, E, [...T, T["length"]]>;

export type Neverify<T> = { [K in keyof T]?: never };

export type PageParams<P extends object, Ex = unknown> = Readonly<{ params: Promise<P> } & Ex>;
export type PageQueries<S extends object, Ex = unknown> = Readonly<
  { searchParams: Promise<S> } & Ex
>;
export type PageParamsQueries<P extends object, S extends object, Ex = unknown> = Readonly<
  { params: Promise<P>; searchParams: Promise<S> } & Ex
>;
