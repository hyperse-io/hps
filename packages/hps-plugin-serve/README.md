# HPS Serve Plugin

A development server plugin for the HPS (Hyperse) build system that provides hot-reload development servers with integrated mocking capabilities and static serving options.

## Features

- **Hot Reload Development**: Fast development server with hot module replacement
- **Integrated Mocking**: Built-in mock server with configurable filters
- **Static Mode**: Serve pre-built static assets for production-like testing
- **Module Filtering**: Selective module loading for better performance
- **Rspack Integration**: Powered by `@hyperse/hps-srv-rspack` for fast builds
- **Configurable Options**: Flexible configuration through HPS config system

## Installation

```bash
# yarn
yarn add @hyperse/hps-plugin-serve
# npm
npm install @hyperse/hps-plugin-serve
# pnpm
pnpm add @hyperse/hps-plugin-serve
```

## Quick Start

```typescript
import { createServePlugin } from '@hyperse/hps-plugin-serve';

const servePlugin = createServePlugin();

// Register with your HPS wizard
wizard.use(servePlugin);
```

## Usage

### Development Server

```bash
# Start development server with hot reload
hps serve evolve

# Start with specific modules only (better performance)
hps serve evolve --modules home dashboard

# Start with static mode (serve pre-built assets)
hps serve evolve --static-mode

# Configure mock filters
hps serve evolve --mock-filters "api/.*" "!api/test/.*"
```

### Command Options

| Option           | Alias | Description                            | Default  |
| ---------------- | ----- | -------------------------------------- | -------- |
| `--static-mode`  | `-s`  | Start server in static mode            | `false`  |
| `--modules`      | `-m`  | Filter specific entry modules          | `[".*"]` |
| `--mock-filters` | -     | Regex patterns for mock file filtering | `[".*"]` |

Notes:

- The `--modules` flag accepts multiple values to filter entry points for better performance
- Mock filters use regex patterns; prefix with `!` to exclude patterns
- Static mode serves pre-built assets instead of running the development build

## Configuration

### HPS Config Integration

The serve plugin integrates with your HPS configuration file. It merges command-line options with your existing config:

```typescript
// hps.config.ts
export default {
  devServer: {
    port: 3000,
    https: true,
    mockOptions: {
      mockFilters: ['api/.*'],
      https: true,
    },
    watchOptions: {
      ignored: ['node_modules/**'],
    },
  },
};
```

### Mock Server Configuration

The plugin automatically configures the mock server with:

- **Dynamic Mock Directory**: Automatically resolves mock working directory
- **HTTPS Support**: Inherits HTTPS settings from dev server config
- **Watch Ignore**: Adds mock directory to watch ignore patterns
- **Filter Support**: Applies regex filters to mock files

### Static Mode

When using `--static-mode`, the plugin:

- Serves pre-built static assets
- Skips development build process
- Provides production-like serving environment
- Useful for testing built applications

## How It Works

1. **Configuration Merging**: Combines CLI flags with HPS config options
2. **Mock Setup**: Configures mock server with filters and HTTPS settings
3. **Module Loading**: Dynamically imports `@hyperse/hps-srv-rspack`
4. **Server Start**: Launches either development or static server based on mode
5. **Hot Reload**: Provides real-time updates during development

## API Reference

### `createServePlugin()`

Creates and returns the serve plugin instance for HPS.

Returns: a configured HPS plugin that adds the `serve` command with `evolve` subcommand.

### `serve evolve` command

Starts the development server with various configuration options.

**Subcommands:**

- `evolve`: Main development server using Rspack

**Flags:**

- `--static-mode`: Serve pre-built static assets
- `--modules <modules...>`: Filter entry modules for better performance
- `--mock-filters <filters...>`: Configure mock file filtering

### `handlerServeEvolve(flags, configOptions)`

Internal handler that orchestrates the serve process.

**Parameters:**

- `flags`: Command-line flags and options
- `configOptions`: HPS configuration options

## Dependencies

The plugin depends on several HPS service packages:

- `@hyperse/hps-srv-common`: Common utilities and logging
- `@hyperse/hps-srv-mock`: Mock server functionality
- `@hyperse/hps-srv-rspack`: Rspack development server
- `@hyperse/config-loader`: Configuration loading utilities

## Error Handling

- **Configuration Validation**: Validates required configuration options
- **Module Resolution**: Handles dynamic imports and module loading errors
- **Server Startup**: Provides clear error messages for server startup failures
- **Mock Configuration**: Gracefully handles mock server setup issues

## Performance Tips

- Use `--modules` to limit entry points for faster startup
- Configure `mock-filters` to reduce mock file scanning
- Use `--static-mode` for testing production builds
- Optimize `watchOptions.ignored` patterns in your config

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the [GPLv3 LICENSE](./LICENSE).
