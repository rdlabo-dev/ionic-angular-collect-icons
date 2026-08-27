import { addIcons } from "ionicons";

declare const ngDevMode: boolean;

export type IoniconDictionary = Parameters<typeof addIcons>[0];

/**
 * Registers the collected icons synchronously and supplements them with the
 * complete Ionicons catalog only in Angular development builds.
 *
 * Angular's production optimizer removes the `ngDevMode` branch, so
 * `ionicons/icons` is not part of the production dependency graph.
 */
export async function initializeIonicons(
  useIcons: IoniconDictionary,
): Promise<void> {
  addIcons(useIcons);

  if (typeof ngDevMode === "undefined" || ngDevMode) {
    const { default: _default, ...allIcons } = await import("ionicons/icons");
    void _default;
    addIcons(allIcons);
  }
}
