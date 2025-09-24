# HPS Info Plugin

A CLI information plugin for the HPS (Hyperse) build system. It prints a banner, CLI version, system information, and the versions of installed `@hyperse/*` dependencies.

## Features

- **Beautiful Banner**: ASCII banner using gradients
- **CLI Version**: Displays the current CLI version
- **System Information**: OS and Node.js version details
- **Hyperse Dependencies**: Lists installed `@hyperse/*` dependency versions
- **No-Color Mode**: Respects global `--no-color` settings

## Installation

```bash
# yarn
yarn add @hyperse/hps-plugin-info
# npm
npm install @hyperse/hps-plugin-info
# pnpm
pnpm add @hyperse/hps-plugin-info
```

## Quick Start

```typescript
import { createInfoPlugin } from '@hyperse/hps-plugin-info';

const infoPlugin = createInfoPlugin({
  cliPackage: require('./package.json'),
});

// Register with your HPS wizard
wizard.use(infoPlugin);
```

## Usage

```bash
# Show CLI and system information
hps info
```

### Output Example

```
hyperse  (styled banner)
  ✨ Next-Generation CLI • Powered by Hyperse

  ✔ @hyperse CLI
   @hyperse CLI Version : 0.1.0

  ✔ System Information
   OS Version     : macOS 14.6.1
   NodeJS Version : v20.12.2

  ✔ @hyperse Platform Information
   hps-srv-common ➞ version : 1.2.3
   hps-plugin-serve ➞ version : 0.0.2
```

## Command Options

This command doesn’t take specific flags. It respects global CLI flags like:

- `--no-color`: Disable colored output

## API Reference

### `createInfoPlugin(options)`

Creates and returns the info plugin instance for HPS.

**Parameters:**

- `options.cliPackage`: Optional `package.json` object to read versions from

**Returns:** A configured HPS plugin that adds the `info` command.

## What It Shows

- Banner rendered with gradient and fixed font
- CLI version from `options.cliPackage.version`
- System information via `os-name` and `process.version`
- Hyperse dependency versions aggregated from dependencies, devDependencies, and peerDependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the [GPLv3 LICENSE](./LICENSE).
