Run the collector before production builds. Call this after [Initialize](./initialize.md).

```bash
npx @rdlabo/ionic-angular-collect-icons
```

### Let's automate run

It is inefficient to run commands each time before running a production build, so put them in an npm script to automate the process. Example:

```diff
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
+   "prebuild": "npx @rdlabo/ionic-angular-collect-icons",
```

> [!WARNING]
> This method cannot be used for production builds without using the npm script.
