import type {
  CountryProps,
  CountryType,
  SocialPlatform,
  SocialType,
  TimezoneProps,
  TimezoneType,
} from "../database";

/** Recursively optional configuration values accepted by a provider. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

/** Fully resolved Loomora configuration. */
export type LoomoraConfig = {
  socials?: Partial<Record<SocialType, Pick<SocialPlatform, "name" | "placeholder">>>;
  countries?: Partial<Record<CountryType, Pick<CountryProps, "name">>>;
  timezones?: Record<Exclude<TimezoneType, "none">, Pick<TimezoneProps, "name" | "region">>;
};

/** Partial configuration accepted by `LoomoraProvider`. */
export type LoomoraConfigInput = DeepPartial<LoomoraConfig>;
