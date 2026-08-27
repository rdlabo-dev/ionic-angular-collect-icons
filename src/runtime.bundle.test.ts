import { build, type Metafile } from "esbuild";
import { describe, expect, it } from "vitest";

const IONICONS_CATALOG_ENTRY = /(?:^|\/)ionicons\/icons\/index\.[cm]?js$/;

const getIoniconsCatalogBytes = (metafile: Metafile): number =>
  Object.values(metafile.outputs).reduce(
    (outputTotal, output) =>
      outputTotal +
      Object.entries(output.inputs).reduce(
        (inputTotal, [inputPath, input]) =>
          inputTotal +
          (IONICONS_CATALOG_ENTRY.test(inputPath.replaceAll("\\", "/"))
            ? input.bytesInOutput
            : 0),
        0,
      ),
    0,
  );

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
    const catalogBytes = getIoniconsCatalogBytes(production.metafile);

    expect(totalBytes).toBeLessThan(100_000);
    expect(catalogBytes).toBeLessThan(10_000);
  });

  it("keeps the complete catalog available in development output", async () => {
    const development = await bundleRuntime(true);
    const totalBytes = development.outputFiles.reduce(
      (total, output) => total + output.contents.byteLength,
      0,
    );
    const catalogBytes = getIoniconsCatalogBytes(development.metafile);

    expect(development.outputFiles.length).toBeGreaterThan(1);
    expect(totalBytes).toBeGreaterThan(500_000);
    expect(catalogBytes).toBeGreaterThan(500_000);
  });
});
