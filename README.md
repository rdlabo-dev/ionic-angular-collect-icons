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
- ionicons >= 6.0.0

## Quick start

After [Installation](#installation), initialize `addIcons` and collect icons before production builds:

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

Details: [Initialize](./docs/initialize.md) and [Usage](./docs/usage.md).

## Installation

```bash
npm install @rdlabo/ionic-angular-collect-icons --save-dev
```

## Documentation

Start with [Installation](#installation), then [Initialize](./docs/initialize.md) and [Usage](./docs/usage.md).

- [Initialize](./docs/initialize.md) — wire `addIcons` automatically or by hand.
- [Usage](./docs/usage.md) — run the collector before production builds.
- [CLI Options](./docs/options.md) — `--dry-run`, `--initialize`, paths.
- [FAQ](./docs/faq.md) — tests, binding, and `main.ts`.

<!-- rdlabo-docs-omit -->

**Full documentation:** [https://docs.rdlabo.dev/projects/ionic-angular-collect-icons](https://docs.rdlabo.dev/projects/ionic-angular-collect-icons)

## License

This project is licensed under the [MIT License](./LICENSE).

<!-- /rdlabo-docs-omit -->
