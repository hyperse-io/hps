# @hyperse/hps-srv-common

Shared utilities for Hyperse service/tooling packages: logging, colors, cache, domain/port helpers, array and path utilities, option merging, and URL helpers. Designed for Node.js toolchains and servers.

- **Logger**: Lightweight logger wrapper with stdout plugin support.
- **Chalk**: Consistent color utilities for CLI output.
- **Data cache**: In-memory and file-system caching strategies.
- **Domain/port helpers**: Find available domains/ports for dev servers.
- **Array utils**: Chunk, flatten, unique, intersect, pad.
- **Path/URL utils**: Normalize paths/URLs, join, query-string helpers.
- **Helpers**: Deep-equal check, safe require/resolve, options merge.

## Installation

Requires Node.js >= 20.

```bash
# yarn
yarn add -D @hyperse/hps-srv-common
# npm
npm i -D @hyperse/hps-srv-common
# pnpm
pnpm add -D @hyperse/hps-srv-common
```
