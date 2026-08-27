import { afterEach, describe, expect, it, vi } from "vitest";

const { addIcons } = vi.hoisted(() => ({ addIcons: vi.fn() }));

vi.mock("ionicons", () => ({ addIcons }));
vi.mock("ionicons/icons", () => ({
  default: undefined,
  add: "all-add",
  close: "all-close",
}));

import { initializeIonicons } from "./runtime";

describe("initializeIonicons", () => {
  afterEach(() => {
    addIcons.mockClear();
    vi.unstubAllGlobals();
  });

  it("registers only collected icons in production", async () => {
    vi.stubGlobal("ngDevMode", false);
    const collected = { add: "collected-add" };

    await initializeIonicons(collected);

    expect(addIcons).toHaveBeenCalledTimes(1);
    expect(addIcons).toHaveBeenCalledWith(collected);
  });

  it("registers collected icons before the complete development catalog", async () => {
    vi.stubGlobal("ngDevMode", true);
    const collected = { add: "collected-add" };

    const initialized = initializeIonicons(collected);

    expect(addIcons).toHaveBeenNthCalledWith(1, collected);
    await initialized;
    expect(addIcons).toHaveBeenNthCalledWith(2, {
      add: "all-add",
      close: "all-close",
    });
  });
});
