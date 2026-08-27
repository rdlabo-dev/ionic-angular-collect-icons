Install the CLI and wire icon registration. See also [Usage](./usage.md).

```bash
npm install --save-dev @rdlabo/ionic-angular-collect-icons
```

The generated application code imports the package's browser runtime, so build
environments must install development dependencies before compiling the
application. The runtime is then bundled into the application output.

### 🤖 Automatic Configuration

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

### 📝 Manual Configuration

#### 1. Run the CLI

```bash
npx @rdlabo/ionic-angular-collect-icons
```

This will generate `src/use-icons.ts`.

#### 2. Import the generated file in your `main.ts` ( or `app.config.ts` ) file:

```diff
+ import { initializeIonicons } from '@rdlabo/ionic-angular-collect-icons/runtime';
+ import * as useIcons from './use-icons';

  if (environment.production) {
    enableProdMode();
  }

+  void initializeIonicons(useIcons);
```

`initializeIonicons` registers the collected icons synchronously. Angular's
`isDevMode()` then enables the complete catalog from an isolated lazy bundle in
development. Production starts without downloading that catalog bundle.

When an interactive collector run detects the ternary initializer emitted by
older releases, it asks whether to migrate it. The default answer is **Yes**.
Selecting **No** leaves the initializer unchanged. Existing custom
`addIcons(...)` calls are also left unchanged. See
[Migration](./migration.md#upgrade-the-icon-initializer) for preview,
non-interactive, and matching details.

#### 3. Remove other `addIcons` calls in class constructor

```diff
  @Component(/* ... */)
  export class ExampleComponent {
    constructor() {
-     addIcons(useIcons);
    }
  }
```
