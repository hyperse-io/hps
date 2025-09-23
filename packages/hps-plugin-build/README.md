# HPS Build Plugin

A production build plugin for the HPS (Hyperse) build system that provides optimized builds using Rspack with configurable compression, module filtering, and build timing for web applications.

## Features

- **Production Builds**: Optimized builds for production deployment
- **Rspack Integration**: Powered by `@hyperse/hps-srv-rspack` for fast builds
- **Compression Control**: Configurable minification and compression settings
- **Module Filtering**: Selective module building for better performance
- **Build Timing**: Real-time build duration tracking
- **Error Handling**: Comprehensive error reporting and logging

## Installation

```bash
# yarn
yarn add @hyperse/hps-plugin-build
# npm
npm install @hyperse/hps-plugin-build
# pnpm
pnpm add @hyperse/hps-plugin-build
```

## Quick Start

```typescript
import { createBuildPlugin } from '@hyperse/hps-plugin-build';

const buildPlugin = createBuildPlugin();

// Register with your HPS wizard
wizard.use(buildPlugin);
```

## Usage

### Basic Build

```bash
# Build all modules with default settings
hps build evolve

# Build with compression disabled (development mode)
hps build evolve --no-compress

# Build specific modules only
hps build evolve --modules home dashboard

# Build with custom compression settings
hps build evolve --compress --modules api
```

### Command Options

| Option       | Alias | Description                                 | Default  |
| ------------ | ----- | ------------------------------------------- | -------- |
| `--compress` | `-c`  | Enable/disable compression and minification | `true`   |
| `--modules`  | `-m`  | Filter specific entry modules to build      | `[".*"]` |

Notes:

- The `--modules` flag accepts multiple values to filter entry points
- Compression affects minification, source maps, and optimization
- Build timing is automatically tracked and displayed

## Configuration

### HPS Config Integration

The build plugin integrates with your HPS configuration file:

```typescript
// hps.config.ts
export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
  },
  rspack: {
    mode: 'production',
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  },
});
```

### Build Modes

The plugin supports different build modes based on compression settings:

#### Production Mode (Default)

```bash
hps build evolve --compress
```

- **Minification**: Enabled
- **Source Maps**: Disabled (for smaller bundle size)
- **Optimization**: Full optimization enabled
- **Tree Shaking**: Aggressive dead code elimination

#### Development Mode

```bash
hps build evolve --no-compress
```

- **Minification**: Disabled
- **Source Maps**: Enabled for debugging
- **Optimization**: Minimal optimization
- **Tree Shaking**: Basic dead code elimination

### Module Filtering

Control which modules are built for better performance:

```bash
# Build only specific modules
hps build evolve --modules home dashboard

# Build all modules except test modules
hps build evolve --modules ".*" "!.*test.*"

# Build API modules only
hps build evolve --modules "api/.*"
```

## How It Works

1. **Configuration Loading**: Loads build configuration from HPS config
2. **Options Merging**: Combines CLI flags with configuration options
3. **Module Loading**: Dynamically imports `@hyperse/hps-srv-rspack`
4. **Build Execution**: Runs the build process with filtered modules
5. **Timing Tracking**: Measures and reports build duration
6. **Error Handling**: Catches and reports build errors

## API Reference

### `createBuildPlugin()`

Creates and returns the build plugin instance for HPS.

Returns: a configured HPS plugin that adds the `build` command with `evolve` subcommand.

### `build evolve` command

Builds the application for production with various configuration options.

**Subcommands:**

- `evolve`: Main build command using Rspack

**Flags:**

- `--compress`: Enable/disable compression and minification
- `--modules <modules...>`: Filter entry modules for selective building

### `evolveBuildCmd`

Internal command definition that handles the build process.

**Parameters:**

- `flags`: Command-line flags and options
- `configOptions`: HPS configuration options

## Advanced Usage

### Environment-Specific Builds

```typescript
// hps.config.ts
export default defineConfig((env) => {
  const isProduction = env.mode === 'production';

  return {
    build: {
      outDir: isProduction ? 'dist' : 'build',
      sourcemap: !isProduction,
    },
    rspack: {
      mode: isProduction ? 'production' : 'development',
      optimization: {
        minimize: isProduction,
      },
    },
  };
});
```

### Custom Build Scripts

```json
// package.json
{
  "scripts": {
    "build": "hps build evolve",
    "build:dev": "hps build evolve --no-compress",
    "build:modules": "hps build evolve --modules home dashboard",
    "build:api": "hps build evolve --modules api/.*"
  }
}
```

### Build Optimization

```typescript
// hps.config.ts
export default defineConfig({
  rspack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
});
```

## Dependencies

The plugin depends on several HPS service packages:

- `@hyperse/hps-srv-common`: Common utilities and logging
- `@hyperse/hps-srv-rspack`: Rspack build functionality
- `@hyperse/config-loader`: Configuration loading utilities

## Error Handling

- **Configuration Validation**: Validates required configuration options
- **Build Errors**: Comprehensive error reporting with stack traces
- **Module Resolution**: Handles missing or invalid module references
- **Timing Information**: Provides build duration for performance analysis

## Performance Tips

- Use `--modules` to build only necessary entry points
- Enable compression for production builds
- Configure appropriate chunk splitting strategies
- Use source maps only in development builds
- Optimize asset handling and caching strategies

## Build Output

The build process provides detailed feedback:

```
Building...
Building success in 1234ms
```

Build artifacts are typically output to:

- `dist/` directory (configurable via `build.outDir`)
- Optimized JavaScript bundles
- CSS files with vendor prefixes
- Static assets with content hashing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the [GPLv3 LICENSE](./LICENSE).
