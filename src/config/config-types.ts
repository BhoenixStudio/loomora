import { SocialPlatform, SocialType } from "../database/useSocialMedia";

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
  socials: Record<SocialType, Pick<SocialPlatform, "name" | "placeholder">>;
};

/** Partial configuration accepted by `LoomoraProvider`. */
export type LoomoraConfigInput = DeepPartial<LoomoraConfig>;
