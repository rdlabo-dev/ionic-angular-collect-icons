import { describe, expect, it, vi } from "vitest";
import { checkInstalledIonicVersion, isSupportedIonicVersion } from ".";

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
