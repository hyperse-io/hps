# HPS CLI

Next-generation CLI for the Hyperse (HPS) ecosystem. It orchestrates plugins for development, build, deployment, updates, and diagnostics with a consistent developer experience.

[![Build](https://img.shields.io/github/actions/workflow/status/hyperse-io/hps/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-square&labelColor=000000)](https://github.com/hyperse-io/hps/actions?query=workflow%3ACI)
[![Version](https://img.shields.io/npm/v/%40hyperse%2Fhps?branch=main&label=version&logo=npm&style=flat-square&labelColor=000000)](https://www.npmjs.com/package/@hyperse/hps)
[![Top Language](https://img.shields.io/github/languages/top/hyperse-io/hps?style=flat-square&labelColor=000&color=blue)](https://github.com/hyperse-io/hps/search?l=typescript)
[![License](https://img.shields.io/badge/license-GPLv3-brightgreen.svg)](https://github.com/hyperse-io/hps/blob/main/LICENSE)

## Features

- **Plugin Architecture**: Modular commands via first-party plugins
- **Zero-Config Defaults**: Sensible defaults with override capability
- **Typed Config**: Strongly-typed config via `defineConfig`
- **Multi-Environment**: Works across development and production
- **Helpful Output**: Clear logs, errors, and timing info

## Installation

```bash
# npm
npm install @hyperse/hps
# yarn
yarn add @hyperse/hps
# pnpm
pnpm add @hyperse/hps
```

## Quick Start

```typescript
import { cli, defineConfig } from '@hyperse/hps';

export default defineConfig((env) => ({
  projectCwd: process.cwd(),
  devServer: {
    port: 3000,
  },
}));

// run in terminal
// npx hps --help
```

## Commands

The CLI bundles these commands via plugins:

- `hps info` — Show banner, CLI, system, and Hyperse dependency versions
- `hps serve evolve` — Start dev server (Rspack), with mocks support
- `hps build evolve` — Build for production (Rspack)
- `hps mock` — Run standalone mock server
- `hps deploy` — Deploy static assets to supported providers
- `hps update` — Update workspace package dependencies

Use `hps --help` or `<command> --help` for detailed usage.

## Configuration

HPS reads `hps.config.ts` (or `.js`) and provides a typed `defineConfig` helper.

```typescript
import { defineConfig } from '@hyperse/hps';

export default defineConfig((env) => ({
  projectCwd: process.cwd(),
  resolve: env.resolve,
  devServer: {
    https: true,
    mockOptions: {
      mockFilters: ['.*'],
    },
  },
}));
```

### Type-Safe Context

The `defineConfig` helper infers the CLI command contexts so IDEs can provide autocomplete and type checking.

## Built-in Plugins

HPS integrates first-party plugins out of the box:

- [`@hyperse/hps-plugin-info`](../hps-plugin-info/README.md)
- [`@hyperse/hps-plugin-serve`](../hps-plugin-serve/README.md)
- [`@hyperse/hps-plugin-build`](../hps-plugin-build/README.md)
- [`@hyperse/hps-plugin-mock`](../hps-plugin-mock/README.md)
- [`@hyperse/hps-plugin-deploy`](../hps-plugin-deploy/README.md)
- [`@hyperse/hps-plugin-update`](../hps-plugin-update/README.md)

Plus helpful middleware:

- [`@hyperse/wizard-plugin-help`](https://www.npmjs.com/package/@hyperse/wizard-plugin-help)
- [`@hyperse/wizard-plugin-version`](https://www.npmjs.com/package/@hyperse/wizard-plugin-version)
- [`@hyperse/wizard-plugin-error`](https://www.npmjs.com/package/@hyperse/wizard-plugin-error)
- [`@hyperse/wizard-plugin-loader`](https://www.npmjs.com/package/@hyperse/wizard-plugin-loader) (auto-load community plugins by pattern `hps-plugin-*`)

## Programmatic Usage

```typescript
import { cli } from '@hyperse/hps';

// start the CLI
cli.parse(process.argv);
```

## Node Requirements

- Node.js >= 20

## License

This project is licensed under the [GPLv3 LICENSE](./LICENSE).
