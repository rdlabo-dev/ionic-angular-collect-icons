# Migration Guide

## Migrating to Ionic Angular 9

This version targets Ionic Angular 9 and follows the
[Ionic Framework 9 breaking changes](https://github.com/ionic-team/ionic-framework/blob/main/BREAKING.md#version-9x).

### Requirements

- Ionic Angular 9 or later
- Angular 18 or later
- Capacitor 7 or later for native applications
- TypeScript 5.4 or later
- Ionicons 8 or later
- Node.js 20 or later

### Run the official migrator

Ionic recommends using its official migration tool. Commit the application's
current changes first: the migrator edits files in place and requires a clean
Git working tree so the commit can be used to review or undo its changes.

Run it from the root of the Ionic application:

```bash
npx @ionic/migrate
```

The migrator detects the installed Ionic major version, updates dependencies,
applies safe automatic fixes, formats changed files, reinstalls dependencies,
and prints a checklist of changes that require manual review.

To preview the migration without writing files, run:

```bash
npx @ionic/migrate --dry-run
```

After the official migration finishes, update this collector and confirm that
the resulting dependency versions meet the requirements above:

```bash
npm install --save-dev @rdlabo/ionic-angular-collect-icons@latest
```

The remaining sections explain the important Ionic Angular 9 changes to verify
in the generated diff and in the migrator's manual-review checklist.

### Update standalone imports

Ionic 9 exports standalone Angular components from `@ionic/angular`. Replace
the Ionic 8 standalone entry point:

```diff
- import { IonApp, IonIcon, provideIonicAngular } from '@ionic/angular/standalone';
+ import { IonApp, IonIcon, provideIonicAngular } from '@ionic/angular';
```

Lazy-loaded Ionic components now use `@ionic/angular/lazy` instead of the
package root:

```diff
- import { IonModal } from '@ionic/angular';
+ import { IonModal } from '@ionic/angular/lazy';
```

Only use the lazy entry point when the application intentionally uses Ionic's
lazy-loaded component proxies. Regular standalone Angular components should be
imported from `@ionic/angular`.

### Replace `IonicModule`

`IonicModule` remains functional in Ionic 9 but is deprecated. Use
`provideIonicAngular()` for new and migrated applications. In an NgModule-based
application, move the Ionic configuration from `imports` to `providers`:

```diff
 @NgModule({
-  imports: [IonicModule.forRoot(config)],
+  providers: [provideIonicAngular(config)],
 })
```

### Use exports-aware module resolution

Ionic 9 publishes package subpaths through `exports`. Applications should use
the Angular default bundler resolution:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022"
  }
}
```

Replace webpack-style CSS imports that use `~`:

```diff
- @import '~@ionic/angular/css/core.css';
+ @import '@ionic/angular/css/core.css';
```

### Run the icon collector

Initialize the generated icon registration if the application has not already
done so:

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

Continue running the collector before production builds as described in the
[usage guide](./usage.md).

### Review other Ionic 9 changes

The collector finds `ion-icon` usage in Angular templates and updates its own
icon registration files. It does not depend on Ionic component behavior or
internal DOM, so those Ionic 9 changes do not require collector-specific code
changes. Consuming applications must still review the official migration notes,
particularly the new browser and mobile platform minimums and these changes:

- Native applications require Capacitor 7+ and iOS 16+.
- Supported desktop browsers are Chrome 89+, Safari 16+, Edge 89+, and Firefox 75+.
- `ion-input` and `ion-searchbar` now use a boolean `autocorrect` property.
- Legacy picker components and `PickerController` were removed.
- Sheet modal handles now default to `handleBehavior="cycle"`.
- `ion-nav` no longer integrates with `ion-router`.
- `ion-select` emits `ionChange` only when its value changes.
- Input, select, and textarea internal DOM and styling hooks changed.
- Angular 21 applications use zoneless change detection by default.

After migrating, run the application's lint, test, and production build commands
and verify any customized Ionic component styles visually.
