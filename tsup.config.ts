import { defineConfig } from "tsup";

export default defineConfig([
  {
    dts: true,
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    target: "node22",
  },
  {
    dts: true,
    entry: ["src/runtime.ts"],
    format: ["cjs", "esm"],
    target: "es2022",
  },
]);
