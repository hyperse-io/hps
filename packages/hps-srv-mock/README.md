# @hyperse/hps-srv-mock

Mock service toolkit for local development and testing. It provides a pluggable mock runtime, Express middlewares, decorators for defining mock domains, live watching and hot updates, proxy support, and helpers to transform/validate responses.

- **Express-based mock server**: Easy to attach into an existing app or start standalone.
- **File watching & hot updates**: Watch mock files and rebuild only what changed.
- **ESM build pipeline**: Esbuild-based tasks to cache/compile mock modules for fast startup.
- **Flexible route definitions**: Standard REST API mocks, simple/standard function handlers, and decorators.
- **Domain decorators**: `@mockable`, `@alias`, and validation decorators to structure mock domains.
- **Response helpers**: JSON transformers, validation utilities, and error helpers.
- **Proxy & CORS**: Built-in CORS and optional proxy passthrough for selective routes.
- **Config loader**: Load and merge mock config from files with sensible defaults.

## Installation

Requires Node.js >= 20.

```bash
# yarn
yarn add -D @hyperse/hps-srv-mock
# npm
npm i -D @hyperse/hps-srv-mock
# pnpm
pnpm add -D @hyperse/hps-srv-mock
```
