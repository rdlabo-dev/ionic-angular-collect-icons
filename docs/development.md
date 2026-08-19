# Developing

This project is a TypeScript CLI built on top of `ts-morph` and `clack`. It is designed for local development workflows and is published to npm as `@rdlabo/ionic-angular-collect-icons`.

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Common commands

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Build and watch for changes               |
| `npm run start`      | Run the CLI against the local source      |
| `npm run test`       | Run all Vitest tests                      |
| `npm run test:watch` | Run tests in watch mode                   |
| `npm run coverage`   | Run tests with coverage                   |
| `npm run lint`       | Run ESLint                                |
| `npm run fmt`        | Format files with Prettier                |
| `npm run build`      | Build the `dist/` output for both CJS/ESM |

## Useful resources

- [TypeScript AST Explorer](https://ts-ast-explorer.com/)
- [ts-morph API Docs](https://ts-morph.com/)
- [Clack Prompts Docs](https://github.com/natemoo-re/clack/tree/main/packages/prompts#readme)

## Contributing

Contributions are welcome. Please run `npm run fmt`, `npm run lint`, and `npm test` before opening a pull request.
