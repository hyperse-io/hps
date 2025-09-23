# HPS Pack Plugin

Utilities for packaging and metadata in the HPS (Hyperse) ecosystem. This package currently exposes lightweight metadata that can be used by tooling and scripts, and provides a foundation for future packaging-related features.

## Features

- **Lightweight Metadata**: Exposes `HPS` metadata for tooling
- **TypeScript Types**: Ships with TypeScript type definitions
- **Zero-config**: No setup required

## Installation

```bash
# yarn
yarn add @hyperse/hps-plugin-pack
# npm
npm install @hyperse/hps-plugin-pack
# pnpm
pnpm add @hyperse/hps-plugin-pack
```

## Quick Start

```typescript
import { HPS } from '@hyperse/hps-plugin-pack';

console.log(HPS.name); // "HPS"
console.log(HPS.version); // e.g. "0.0.1"
```

## Usage

Use the exported metadata in your build or release scripts:

```typescript
import { HPS } from '@hyperse/hps-plugin-pack';

function printBanner() {
  return `Building ${HPS.name} v${HPS.version}`;
}

console.log(printBanner());
```

## API Reference

### `HPS`

An object exposing basic metadata.

Properties:

- `name`: The product name string
- `version`: The product version string

## Roadmap

Planned capabilities include:

- Packaging helpers for release artifacts
- Version and changelog utilities
- Integration hooks for CI/CD pipelines

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the [GPLv3 LICENSE](./LICENSE).
