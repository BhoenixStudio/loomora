"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { ResponsiveProvider, ThemeProvider } from "../utils";
import type { LoomoraConfig, LoomoraConfigInput } from "./config-types";
import { defaultConfig } from "./default-config";
import { mergeConfig } from "./merge-config";

import "../styles/index.css";

const ConfigContext = createContext<Required<LoomoraConfig>>(defaultConfig);

/** Provides optional project or section-level Loomora configuration overrides. */
export function LoomoraProvider({
  children,
  config,
}: Readonly<{ children: ReactNode; config?: LoomoraConfigInput }>) {
  const parentConfig = useContext(ConfigContext);

  const resolved = useMemo(() => mergeConfig(parentConfig, config), [parentConfig, config]);

  return (
    <ResponsiveProvider>
      <ThemeProvider>
        <ConfigContext.Provider value={resolved}>{children}</ConfigContext.Provider>
      </ThemeProvider>
    </ResponsiveProvider>
  );
}

/** Reads the fully resolved Loomora configuration, including built-in defaults. */
export function useLoomoraConfig() {
  return useContext(ConfigContext);
}
