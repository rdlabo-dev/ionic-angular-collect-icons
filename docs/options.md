Flags for `npx @rdlabo/ionic-angular-collect-icons`. The compact table is on the [CLI API](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons/docs/api) page.

### --dry-run [boolean]

If you want to see what changes would be made without actually writing them to files, set `true`. The default is `false`.

```bash
npx @rdlabo/ionic-angular-collect-icons --dry-run true
```

### --interactive [boolean]

If you want to set all CLI option using the prompts, set `true`. This can be used to check only the results in a Dry run.
The default is `false`.

```bash
npx @rdlabo/ionic-angular-collect-icons --interactive true
```

### --initialize [boolean]

If you want to initialize `addIcons` automatically, you can use the `--initialize` flag. The default is `false`. The CLI add lines:

```diff
+ import { addIcons } from 'ionicons';
+ import * as allIcons from 'ionicons/icons';
+ import * as useIcons from './use-icons';

  if (environment.production) {
    enableProdMode();
  }

+  addIcons(environment.production ? useIcons : allIcons);
```

the CLI will add lines at the file that has `enableProdMode()`. Of course, it can also be set manually.

And remove other `addIcons` calls in class constructor.

```diff
  @Component(/* ... */)
  export class ExampleComponent {
    constructor() {
-     addIcons(useIcons);
    }
  }
```

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

### --project-path [string]

If you want to specify the path to the project, you can use the `--project-path` flag. The default is the current directory.

```bash
npx @rdlabo/ionic-angular-collect-icons --project-path /path/to/project
```

Target files are under the `src` directory from the specified path.

- path/to/project + `src/**/*.ts`
- path/to/project + `src/**/*.html`

### --icon-path [string]

Default create file is (path/to/project +) `src/use-icons.ts`. If you want to specify the file name, you can use the `--icon-path` flag.

```bash
npx @rdlabo/ionic-angular-collect-icons  --icon-path src/other-use-icons.ts
```
