import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  outDir: "dist",
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  target: "es2020",
});
