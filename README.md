# @rdlabo/ionic-angular-collect-icons

<!-- rdlabo-docs-omit -->

[![npm version](https://badge.fury.io/js/@rdlabo%2Fionic-angular-collect-icons.svg)](https://badge.fury.io/js/@rdlabo%2Fionic-angular-collect-icons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- /rdlabo-docs-omit -->

## What is this?

This library is used to uniquely group the ionIcons in a project, and generate for export ionIcons file. In small projects, it is difficult to manage `addIcons()` of ionIcons each time, so we automated it.

- development: Stress-free development by add all icons at `addIcons`.
- Production: Automatically collect and update the ionIcon used in the template prior to build.

Of course, to maximize bundle size reduction, it is important to load a minimum number of icons at each Component lazy loading. This is a compromise to speed up development.

This project is based [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods) .

## Requirements

- Node.js >= 20
- Ionic Angular >= 9.0.0
- Angular >= 18.0.0
- TypeScript >= 5.4.0
- ionicons >= 8.0.0

## Quick start

After [Installation](#installation), initialize `addIcons` and collect icons before production builds:

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

Details: [Initialize](./docs/initialize.md) and [Usage](./docs/usage.md).

## Migrating from Ionic Angular 8

Commit the consuming application's current changes, then run Ionic's official
migration tool from the application root:

```bash
npx @ionic/migrate
```

It applies safe automatic changes and reports items that require manual review.
After it finishes, update this package and follow the
[Ionic Angular 9 migration guide](./docs/migration.md) for the remaining checks.

## Installation

```bash
npm install @rdlabo/ionic-angular-collect-icons --save-dev
```

## Documentation

Start with [Installation](#installation), then [Initialize](./docs/initialize.md) and [Usage](./docs/usage.md).

- [Initialize](./docs/initialize.md) — wire `addIcons` automatically or by hand.
- [Usage](./docs/usage.md) — run the collector before production builds.
- [Migration](./docs/migration.md) — migrate an existing project to Ionic Angular 9.
- [CLI Options](./docs/options.md) — `--dry-run`, `--initialize`, paths.
- [FAQ](./docs/faq.md) — tests, binding, and `main.ts`.

<!-- rdlabo-docs-omit -->

**Full documentation:** [https://docs.rdlabo.dev/projects/ionic-angular-collect-icons](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons)

## License

This project is licensed under the [MIT License](./LICENSE).

<!-- /rdlabo-docs-omit -->
