import { cwd } from "node:process";
import { Project } from "ts-morph";
import { dedent } from "ts-dedent";
import { describe, expect, it, vi } from "vitest";
import {
  checkInstalledIonicVersion,
  isSupportedIonicVersion,
  migrateInitializerWithConsent,
} from ".";

const createLegacyInitializer = () => {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile(
    cwd() + "/src/main.ts",
    dedent(`
      import { addIcons } from "ionicons";
      import * as allIcons from "ionicons/icons";
      import * as useIcons from "use-icons";

      addIcons(environment.production ? useIcons : allIcons);
    `),
  );
  return { project, sourceFile };
};

const migrationOptions = {
  dryRun: false,
  iconPath: "src/use-icons.ts",
  projectPath: cwd(),
  interactive: false,
  initialize: false,
};

describe("migrateInitializerWithConsent", () => {
  it("migrates after the user accepts the default-yes prompt", async () => {
    const { project, sourceFile } = createLegacyInitializer();
    const confirmInitializerMigration = vi.fn().mockResolvedValue(true);

    await migrateInitializerWithConsent({
      project,
      cliOptions: migrationOptions,
      confirmInitializerMigration,
    });

    expect(confirmInitializerMigration).toHaveBeenCalledOnce();
    expect(sourceFile.getText()).toContain("initializeIonicons(useIcons)");
  });

  it("does not change the initializer when the user selects no", async () => {
    const { project, sourceFile } = createLegacyInitializer();
    const before = sourceFile.getText();

    const result = await migrateInitializerWithConsent({
      project,
      cliOptions: migrationOptions,
      confirmInitializerMigration: vi.fn().mockResolvedValue(false),
    });

    expect(result).toBe("declined");
    expect(sourceFile.getText()).toBe(before);
  });

  it("requires --migrate in a non-interactive environment", async () => {
    const { project, sourceFile } = createLegacyInitializer();
    const before = sourceFile.getText();

    const result = await migrateInitializerWithConsent({
      project,
      cliOptions: migrationOptions,
    });

    expect(result).toBe("permission-required");
    expect(sourceFile.getText()).toBe(before);
  });
});

describe("isSupportedIonicVersion", () => {
  it.each(["9.0.0", "9.1.0-dev.1", "10.0.0"])(
    "accepts supported Ionic version %s",
    (version) => {
      expect(isSupportedIonicVersion(version)).toBe(true);
    },
  );

  it.each(["8.7.0", "7.5.0", "latest", "", "NaN.0.0"])(
    "rejects unsupported or invalid Ionic version %s",
    (version) => {
      expect(isSupportedIonicVersion(version)).toBe(false);
    },
  );
});

describe("checkInstalledIonicVersion", () => {
  it("checks the project directory and accepts Ionic 9", async () => {
    const getVersion = vi.fn().mockResolvedValue("9.0.0");

    await expect(
      checkInstalledIonicVersion("/path/to/project", getVersion),
    ).resolves.toBe(true);
    expect(getVersion).toHaveBeenCalledWith(
      "/path/to/project",
      "@ionic/angular",
    );
  });

  it.each(["8.7.0", "invalid"])("rejects Ionic version %s", async (version) => {
    await expect(
      checkInstalledIonicVersion("/path/to/project", async () => version),
    ).resolves.toBe(false);
  });
});
