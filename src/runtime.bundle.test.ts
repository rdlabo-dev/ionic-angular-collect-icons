import { build } from "esbuild";
import { describe, expect, it } from "vitest";

const bundleRuntime = async (ngDevMode: boolean) =>
  build({
    bundle: true,
    define: { ngDevMode: String(ngDevMode) },
    format: "esm",
    metafile: true,
    minify: true,
    platform: "browser",
    splitting: true,
    stdin: {
      contents: `
        import { initializeIonicons } from "./src/runtime";
        import { add } from "ionicons/icons";
        void initializeIonicons({ add });
      `,
      loader: "ts",
      resolveDir: process.cwd(),
      sourcefile: "runtime-bundle-entry.ts",
    },
    treeShaking: true,
    write: false,
    outdir: "out",
  });

describe("initializeIonicons production bundle", () => {
  it("removes the complete catalog from optimized production output", async () => {
    const production = await bundleRuntime(false);
    const totalBytes = production.outputFiles.reduce(
      (total, output) => total + output.contents.byteLength,
      0,
    );
    const catalogBytes = Object.values(production.metafile.outputs).reduce(
      (total, output) =>
        total +
        (output.inputs["node_modules/ionicons/icons/index.mjs"]
          ?.bytesInOutput ?? 0),
      0,
    );

    expect(totalBytes).toBeLessThan(100_000);
    expect(catalogBytes).toBeLessThan(10_000);
  });

  it("keeps the complete catalog available in development output", async () => {
    const development = await bundleRuntime(true);
    const totalBytes = development.outputFiles.reduce(
      (total, output) => total + output.contents.byteLength,
      0,
    );
    const catalogBytes = Object.values(development.metafile.outputs).reduce(
      (total, output) =>
        total +
        (output.inputs["node_modules/ionicons/icons/index.mjs"]
          ?.bytesInOutput ?? 0),
      0,
    );

    expect(development.outputFiles.length).toBeGreaterThan(1);
    expect(totalBytes).toBeGreaterThan(500_000);
    expect(catalogBytes).toBeGreaterThan(500_000);
  });
});
