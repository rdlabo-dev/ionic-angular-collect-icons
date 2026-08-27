Install the CLI and wire icon registration. See also [Usage](./usage.md).

```bash
npm install @rdlabo/ionic-angular-collect-icons
```

Install the collector as an application dependency because the generated
application code imports its browser runtime. Build environments must also
install the package before compiling the application.

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

`initializeIonicons` registers the collected icons synchronously. In Angular
development builds it then loads the complete Ionicons catalog; Angular removes
that development-only import from optimized production builds.

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
