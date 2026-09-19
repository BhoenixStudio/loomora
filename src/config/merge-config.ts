import type { LoomoraConfig, LoomoraConfigInput } from "./config-types";

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function mergeValues(base: unknown, override: unknown): unknown {
  if (override === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override;

  const result: PlainObject = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    result[key] = mergeValues(base[key], value);
  }

  return result;
}

/** Recursively merges provider values without mutating either input object. */
export function mergeConfig(base: LoomoraConfig, override?: LoomoraConfigInput): LoomoraConfig {
  if (!override) return base;
  return mergeValues(base, override) as LoomoraConfig;
}
