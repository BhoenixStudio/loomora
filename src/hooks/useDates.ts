"use client";

/**
 * `useDates.ts` provides the client-side date and month utilities used by the
 * application.
 *
 * ## File overview
 * `useDates` combines the application's translated month names with the
 * date-fns operations needed by client components. It is responsible for
 * parsing validity checks, formatting, comparison, range display, date
 * arithmetic, and relative-date text. It does not fetch, persist, or mutate
 * application data, and it does not expose a timezone or date-parsing
 * configuration API.
 *
 * ## When to use
 * Use this hook inside a client component when a date value must be formatted,
 * checked, compared, shifted, or displayed as a range or relative distance.
 * Use `GetMonths` or `GetMonth` for translated month options. Prefer date-fns
 * directly when a required date-fns operation or option is not exposed here,
 * or when the calling code cannot use a client hook.
 *
 * ## Developer guide
 * The verified project import is `import { useDates } from '@hooks'`; the
 * barrel at `src/hooks/index.ts` re-exports this file. Call `useDates()` at the
 * top level of a client React component. The hook requires the application's
 * next-intl context because month names come from
 * `common.data.months`. The supported `niceDate` locale values are `en` and
 * `ar`, from the project's `LocaleType`.
 *
 * Returned API:
 * - `GetMonths(props?)` returns all twelve months by default, sorted by their
 *   `order`. `only` includes selected `MonthKey` values, `except` removes
 *   selected values, and `extra` adds or overrides fields per month. When both
 *   filters are supplied, `only` is applied before `except`; the final list is
 *   sorted by the resulting `order` values.
 * - `GetMonth(key, { extra }?)` returns one translated month and its `key`.
 * - `isValid(date)` accepts a string, `Date`, `null`, or `undefined` and
 *   returns a boolean based on native `Date` parsing plus the explicit zero
 *   date sentinels handled in this file.
 * - `format(date, props?)` returns a string or number. Its default is the
 *   custom date-fns format `yyyy-MM-dd HH:mm:ss`; supported named formats are
 *   listed by `FormatDateType`. `number` returns a `yyyyMMdd` string;
 *   `fullYear`, `hour`, `minutes`, and `seconds` return numbers; the other
 *   named formats return strings.
 * - `compare(first, second, props?)` compares the first date with the second
 *   date after optional `addDays` and `removeDays` adjustments to the second
 *   date. The default comparison type is `before`. It returns `match` and
 *   differences in hours, days, weeks, months, and years.
 * - `dateRange({ first, second }, type?)` returns `match`, a compact `range`,
 *   and a full `fallback` string for `sameHour`, `sameDay`, `sameWeek`,
 *   `sameMonth`, `sameYear`, or the default `dynamic` mode.
 *   Compact formats are `HH:mm - HH:mm dd-MM-yyyy` for same hour,
 *   `dd - dd-MM-yyyy` for same day, and `dd MMM - dd MMM yyyy` for the other
 *   fixed modes; the fallback includes the full date on both sides.
 * - `addDays` and `subDays` return a new `Date` for valid input and `''` for
 *   invalid or missing input.
 * - `niceDate(date, { earlierDate, locale }?)` returns date-fns relative text
 *   with a suffix and seconds included. Without `earlierDate`, the current
 *   time is used as the comparison base; `locale` defaults to `en`.
 *
 * ## Usage examples
 * The following snippets are illustrative examples and require the existing
 * client and next-intl context.
 *
 * Minimal formatting:
 * ```tsx
 * const { format } = useDates()
 * const currentYear = format(new Date(), { type: 'fullYear' })
 * ```
 *
 * Month options with application-specific fields:
 * ```tsx
 * const { GetMonths } = useDates()
 * const months = GetMonths({
 *   only: ['JAN', 'FEB', 'MAR'],
 *   extra: {
 *     JAN: { value: 1 },
 *     FEB: { value: 2 },
 *     MAR: { value: 3 },
 *   },
 * })
 * ```
 * Each returned item retains `key`, translated `name`, `shortName`, and
 * `order`, and also contains the supplied `value` field.
 *
 * Range and relative display:
 * ```tsx
 * const { dateRange, niceDate } = useDates()
 * const result = dateRange(
 *   { first: '2026-09-18T09:00:00', second: '2026-09-18T12:00:00' },
 *   'sameDay'
 * )
 * const label = result.match ? result.range : result.fallback
 * const relative = niceDate('2026-09-18T09:00:00', {
 *   earlierDate: '2026-09-18T08:00:00',
 *   locale: 'en',
 * })
 * ```
 *
 * Invalid-input behavior:
 * ```tsx
 * const { isValid, addDays, format } = useDates()
 * isValid('0000-00-00') // false
 * addDays('not-a-date', 1) // ''
 * format(null) // ''
 * ```
 *
 * ## Errors, edge cases, and limitations
 * - Missing, invalid, or explicitly supported zero-date sentinel values are
 *   not thrown as errors. `format`, `niceDate`, and `dateRange` return empty
 *   strings or empty range fields; `compare` returns `match: false` with zero
 *   differences; `addDays` and `subDays` return `''`.
 * - Validity is based on `new Date(value)`, so accepted string formats and
 *   timezone interpretation follow the runtime's native Date behavior. No
 *   timezone option is exposed.
 * - `compare` applies both adjustments to the second date, in the order
 *   `addDays` then `removeDays`.
 * - `dynamic` range selection checks same hour, day, week, month, then year.
 *   If none match, it returns empty `range` and `fallback` fields. Explicit
 *   range modes still return their formatted strings when `match` is false.
 * - The selected `niceDate` locale is not passed to the other date-fns
 *   formatting calls. `format` day names and `dateRange` month names therefore
 *   use date-fns' default formatting locale, while `niceDate` maps `en` and
 *   `ar` explicitly.
 * - `format` with `type: 'niceDate'` calls `niceDate` without locale props and
 *   therefore uses `niceDate`'s default `en` locale.
 * - `dateRange` strings are created with multiline template literals and can
 *   contain surrounding whitespace. Callers that need a single-line label may
 *   trim the selected string.
 * - Errors from next-intl or date-fns are not caught by this hook. In
 *   particular, a malformed custom format can propagate an error from
 *   date-fns.
 * - The inspected `src/i18n/messages/ar.json` currently has empty values for
 *   the month keys, so Arabic `GetMonths` and `GetMonth` labels depend on
 *   those translations being populated.
 *
 * ## AI agent guide
 * - Preserve the `'use client'` directive, the exported type names, and every
 *   property in the object returned by `useDates`.
 * - Reuse this hook instead of duplicating its validity, translation, or date
 *   range logic. Keep translation keys literal and verify both message files
 *   before changing month translations.
 * - Treat invalid-input return values, second-date comparison adjustments,
 *   dynamic range precedence, and the `niceDate` locale behavior as public
 *   invariants.
 * - Before changing the hook, check `src/hooks/index.ts`, the verified direct
 *   consumers `src/components/UI/Image.tsx`,
 *   `src/components/Layouts/Copyrights.tsx`, and
 *   `src/components/Partials/Elements/Modules/Dates.tsx`, plus the i18n files
 *   listed below.
 * - The file appears manually maintained; no generated-file marker is present.
 *   The inspected project exposes `pnpm type:check`, `pnpm lint`, and
 *   `pnpm format:check`; no dedicated `useDates` test/spec file was found in
 *   the inspected test paths.
 * - Confirm behavior/API changes with the user before changing return shapes,
 *   sentinel handling, date-fns format strings, supported locales, or the
 *   translated month contract.
 *
 * ## Related references
 * - `src/hooks/index.ts` - public `@hooks` re-export.
 * - `src/i18n/index.ts` and `src/i18n/configs.ts` - `LocaleType` and locale
 *   values used by this hook.
 * - `src/i18n/messages/en.json` and `src/i18n/messages/ar.json` - translated
 *   `common.data.months` keys consumed by `Months`.
 * - `src/components/UI/Image.tsx`, `src/components/Layouts/Copyrights.tsx`,
 *   and `src/components/Partials/Elements/Modules/Dates.tsx` - inspected
 *   consumers.
 * - `instructions/code-rules.md`, `tsconfig.json`, and `package.json` -
 *   inspected project rules, path aliases, and validation scripts.
 */

import {
  addDays as add,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format as formatDate,
  formatDistance,
  isSameDay,
  isSameHour,
  isSameMonth,
  isSameWeek,
  isSameYear,
  subDays as sub,
} from "date-fns";
import { useLoomoraConfig } from "../config";

/** The twelve translated month keys currently produced by `Months`. */
export type MonthKey = keyof ReturnType<typeof Months>;

/** The translated name, short name, and sort order returned for one month. */
export type MonthItem = ReturnType<typeof Months>[MonthKey];

/**
 * Options for retrieving translated months.
 *
 * @typeParam T Additional fields merged into each returned month item.
 */
export type GetMonths<T extends object = object> = {
  extra?: Partial<Record<MonthKey, T>>;
  only?: MonthKey[];
  except?: MonthKey[];
};

/** Values accepted by the date helpers in this file. */
export type DateType = string | Date | undefined | null;

/** Named output formats supported by `format`. */
export type FormatDateType =
  | "number"
  | "fullYear"
  | "smallYear"
  | "month"
  | "day"
  | "dayName"
  | "shortDayName"
  | "fullTime12"
  | "fullTime24"
  | "time12"
  | "time24"
  | "hour"
  | "minutes"
  | "seconds"
  | "niceDate"
  | "custom";

/** Options for `format`; `format` is required only for the `custom` type. */
export type FormatDate =
  { type?: Exclude<FormatDateType, "custom">; format?: never } | { type: "custom"; format: string };

/** Direction used by `compare`. */
export type CompareDateType = "before" | "after";

/** Comparison direction and optional day adjustments for the second date. */
export type CompareDate = { type?: CompareDateType; addDays?: number; removeDays?: number };

/** Supported fixed granularity's and automatic range selection. */
export type DateRangeType =
  "sameHour" | "sameDay" | "sameWeek" | "sameMonth" | "sameYear" | "dynamic";

/** The two values compared by `dateRange`. */
export type DateRange = { first: DateType; second: DateType };

/** The match flag and formatted strings returned by `dateRange`. */
export type DateRangeResult = { match: boolean; range: string; fallback: string };

type NiceDate = { earlierDate?: DateType; locale?: string };

function Months() {
  const months = {
    JAN: { order: 1 },
    FEB: { order: 2 },
    MAR: { order: 3 },
    APR: { order: 4 },
    MAY: { order: 5 },
    JUN: { order: 6 },
    JUL: { order: 7 },
    AUG: { order: 8 },
    SEP: { order: 9 },
    OCT: { order: 10 },
    NOV: { order: 11 },
    DEC: { order: 12 },
  } as const;

  return months;
}

/**
 * Provides translated month data and date utilities for client components.
 *
 * Call this hook at the top level of a client component. It has no arguments;
 * date values and operation options are supplied to the returned methods.
 * Month labels are read from `common.data.months`, and relative dates support
 * the configured `en` and `ar` locales.
 *
 * @returns The `GetMonths`, `GetMonth`, `isValid`, `format`, `compare`,
 * `dateRange`, `addDays`, `subDays`, and `niceDate` helpers described in the
 * module documentation above.
 */
export function useDates() {
  const monthList = Months();

  const { useDates: useDatesConfig } = useLoomoraConfig();

  const GetMonths = <T extends object = object>(props?: GetMonths<T>): (MonthItem & T)[] => {
    const { only = [], extra, except = [] } = props ?? {};

    let months = Object.entries(monthList).map(([key, month]) => ({
      key: key as MonthKey,
      ...month,
      ...useDatesConfig.months?.[key as MonthKey],
      ...extra?.[key as MonthKey],
    }));

    if (only.length > 0) months = months.filter(({ key }) => only.includes(key));
    if (except.length > 0) months = months.filter(({ key }) => !except.includes(key));

    return months.sort((a, b) => a.order - b.order);
  };

  const GetMonth = <T extends object = object>(
    key: MonthKey,
    props?: Pick<GetMonths<T>, "extra">,
  ): MonthItem & T => ({
    key,
    ...monthList[key],
    ...useDatesConfig.months?.[key as MonthKey],
    ...props?.extra?.[key],
  });

  const isValid = (date: DateType): boolean => {
    if (
      !date ||
      [
        undefined,
        null,
        "",
        "0000:00:00",
        "0000:00:00 00:00:00",
        "0000-00-00",
        "0000-00-00 00:00:00",
        "0000/00/00",
        "0000/00/00 00:00:00",
      ].includes(String(date))
    )
      return false;
    const d = new Date(date);
    return d instanceof Date && !Number.isNaN(d.getTime());
  };

  const compare = (first: DateType, second: DateType, props?: CompareDate) => {
    const { type = "before", addDays = 0, removeDays = 0 } = props ?? {};

    if (!first || !isValid(first) || !second || !isValid(second))
      return {
        match: false,
        differenceInHours: 0,
        differenceInDays: 0,
        differenceInWeeks: 0,
        differenceInMonths: 0,
        differenceInYears: 0,
      };

    const firstDate = new Date(first);
    const secondDate = new Date(second);

    if (addDays) secondDate.setDate(secondDate.getDate() + addDays);
    if (removeDays) secondDate.setDate(secondDate.getDate() - removeDays);

    if (type === "before")
      return {
        match: firstDate < secondDate,
        differenceInHours: differenceInHours(secondDate, firstDate),
        differenceInDays: differenceInDays(secondDate, firstDate),
        differenceInWeeks: differenceInWeeks(secondDate, firstDate),
        differenceInMonths: differenceInMonths(secondDate, firstDate),
        differenceInYears: differenceInYears(secondDate, firstDate),
      };
    if (type === "after")
      return {
        match: firstDate > secondDate,
        differenceInHours: differenceInHours(firstDate, secondDate),
        differenceInDays: differenceInDays(firstDate, secondDate),
        differenceInWeeks: differenceInWeeks(firstDate, secondDate),
        differenceInMonths: differenceInMonths(firstDate, secondDate),
        differenceInYears: differenceInYears(firstDate, secondDate),
      };
    return {
      match: false,
      differenceInHours: 0,
      differenceInDays: 0,
      differenceInWeeks: 0,
      differenceInMonths: 0,
      differenceInYears: 0,
    };
  };

  const dateRange = (dates: DateRange, type: DateRangeType = "dynamic") => {
    const { first, second } = dates;

    if (!first || !isValid(first) || !second || !isValid(second))
      return { match: false, range: "", fallback: "" };

    const firstDate = new Date(first);
    const secondDate = new Date(second);

    const sameHour = isSameHour(firstDate, secondDate);
    const sameDay = isSameDay(firstDate, secondDate);
    const sameWeek = isSameWeek(firstDate, secondDate);
    const sameMonth = isSameMonth(firstDate, secondDate);
    const sameYear = isSameYear(firstDate, secondDate);

    const types: Record<Exclude<DateRangeType, "dynamic">, DateRangeResult> = {
      sameHour: {
        match: sameHour,
        range: `
          ${format(first, { type: "custom", format: "HH:mm" })}
            - ${format(second, { type: "custom", format: "HH:mm dd-MM-yyyy" })}
        `,
        fallback: `
          ${format(first, { type: "custom", format: "HH:mm dd-MM-yyyy" })}
            - ${format(second, { type: "custom", format: "HH:mm dd-MM-yyyy" })}
        `,
      },
      sameDay: {
        match: sameDay,
        range: `
          ${format(first, { type: "custom", format: "dd" })}
            - ${format(second, { type: "custom", format: "dd-MM-yyyy" })}
        `,
        fallback: `
          ${format(first, { type: "custom", format: "dd-MM-yyyy" })}
            - ${format(second, { type: "custom", format: "dd-MM-yyyy" })}
        `,
      },
      sameWeek: {
        match: sameWeek,
        range: `
          ${format(first, { type: "custom", format: "dd MMM" })}
            - ${format(second, { type: "custom", format: "dd MMM yyyy" })}
        `,
        fallback: `
          ${format(first, { type: "custom", format: "dd MMM yyyy" })}
            - ${format(second, { type: "custom", format: "dd MMM yyyy" })}
        `,
      },
      sameMonth: {
        match: sameMonth,
        range: `
          ${format(first, { type: "custom", format: "dd MMM" })}
            - ${format(second, { type: "custom", format: "dd MMM yyyy" })}
        `,
        fallback: `
          ${format(first, { type: "custom", format: "dd MMM yyyy" })}
            - ${format(second, { type: "custom", format: "dd MMM yyyy" })}
        `,
      },
      sameYear: {
        match: sameYear,
        range: `
          ${format(first, { type: "custom", format: "dd MMM" })}
            - ${format(second, { type: "custom", format: "dd MMM yyyy" })}
        `,
        fallback: `
          ${format(first, { type: "custom", format: "dd MMM yyyy" })}
            - ${format(second, { type: "custom", format: "dd MMM yyyy" })}
        `,
      },
    };

    if (type === "dynamic") {
      if (sameHour) return types.sameHour;
      if (sameDay) return types.sameDay;
      if (sameWeek) return types.sameWeek;
      if (sameMonth) return types.sameMonth;
      if (sameYear) return types.sameYear;
      return { match: false, range: "", fallback: "" };
    }
    return types[type];
  };

  const addDays = (date: DateType, days: number) => {
    if (!date || !isValid(date)) return "";
    return add(new Date(date ?? ""), days);
  };

  const subDays = (date: DateType, days: number) => {
    if (!date || !isValid(date)) return "";
    return sub(new Date(date ?? ""), days);
  };

  const niceDate = (date: DateType, props?: NiceDate): string => {
    const { earlierDate, locale = "en" } = props ?? {};

    if (!date || !isValid(date)) return "";

    let baseDate = new Date();
    if (earlierDate) {
      if (!isValid(earlierDate)) return "";
      baseDate = new Date(earlierDate);
    }

    return formatDistance(new Date(date), baseDate, {
      addSuffix: true,
      includeSeconds: true,
      locale: useDatesConfig.locales?.[locale],
    });
  };

  const format = (date: DateType, props?: FormatDate): string | number => {
    const { type = "custom", format = "yyyy-MM-dd HH:mm:ss" } = props ?? {};

    if (!date || !isValid(date)) return "";
    const sanitizedDate = new Date(date);
    const dateMonth =
      sanitizedDate?.getMonth() + 1 <= 9
        ? "0" + (sanitizedDate?.getMonth() + 1)
        : sanitizedDate?.getMonth() + 1;
    const dateDay =
      sanitizedDate?.getDate() <= 9 ? "0" + sanitizedDate?.getDate() : sanitizedDate?.getDate();

    const types: Record<FormatDateType, string | number> = {
      number: `${sanitizedDate?.getFullYear()}${dateMonth}${dateDay}`,
      fullYear: sanitizedDate?.getFullYear(),
      smallYear: sanitizedDate?.getFullYear().toString().slice(-2),
      month: dateMonth,
      day: dateDay,
      dayName: formatDate(sanitizedDate, "EEEE"),
      shortDayName: formatDate(sanitizedDate, "EEE"),
      fullTime24: formatDate(sanitizedDate, "HH:mm:ss"),
      fullTime12: formatDate(sanitizedDate, "hh:mm:ss aa"),
      time24: formatDate(sanitizedDate, "HH:mm"),
      time12: formatDate(sanitizedDate, "hh:mm aa"),
      hour: sanitizedDate?.getHours(),
      minutes: sanitizedDate?.getMinutes(),
      seconds: sanitizedDate?.getSeconds(),
      niceDate: niceDate(sanitizedDate),
      custom: formatDate(sanitizedDate, format),
    };

    return types[type];
  };

  return { GetMonths, GetMonth, isValid, format, compare, dateRange, addDays, subDays, niceDate };
}

/**
 * Documentation metadata
 * - Last documentation update: 2026-09-18
 * - Documentation audience: Developers and AI agents
 * - Evidence basis: Attached file + verified project context
 * - Documentation coverage: Complete
 * - Validation: Prettier check, ESLint, type check, and `git diff --check` passed
 * - Known limitations: Native Date parsing/timezone behavior and default
 *   date-fns formatting locale remain controlled by the runtime; Arabic month
 *   message values are empty in the inspected messages file; no dedicated
 *   useDates test/spec file was found in the inspected test paths.
 */
