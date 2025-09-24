# HPS Load Config Plugin

A configuration loading plugin for the HPS (Hyperse) build system that provides automatic discovery and loading of HPS configuration files with support for TypeScript, JavaScript, and function-based configurations.

## Features

- **Automatic Config Discovery**: Searches for configuration files in multiple formats
- **TypeScript Support**: Full TypeScript configuration support with type safety
- **Function-Based Configs**: Support for dynamic configuration functions
- **External Module Handling**: Configurable external module resolution
- **Environment Context**: Provides project context and resolve utilities
- **Flexible File Names**: Customizable configuration file naming

## Installation

```bash
# yarn
yarn add @hyperse/hps-plugin-load-config
# npm
npm install @hyperse/hps-plugin-load-config
# pnpm
pnpm add @hyperse/hps-plugin-load-config
```

## Quick Start

```typescript
import { createLoadConfigPlugin } from '@hyperse/hps-plugin-load-config';

const loadConfigPlugin = createLoadConfigPlugin();

// Register with your HPS wizard
wizard.use(loadConfigPlugin);
```

## Usage

### Basic Configuration Loading

The plugin automatically loads configuration files when registered with the HPS wizard:

```typescript
// Default behavior - loads 'hps.config.ts' or 'hps.config.js'
const loadConfigPlugin = createLoadConfigPlugin();

// Custom configuration file name
const loadConfigPlugin = createLoadConfigPlugin({
  configFile: 'my-custom-config',
});
```

### Configuration File Formats

The plugin supports multiple configuration file formats:

#### TypeScript Configuration

```typescript
// hps.config.ts
import { defineConfig } from '@hyperse/hps';

export default defineConfig({
  devServer: {
    port: 3000,
    https: true,
  },
  build: {
    target: 'es2020',
  },
});
```

#### JavaScript Configuration

```javascript
// hps.config.js
module.exports = {
  devServer: {
    port: 3000,
    https: true,
  },
  build: {
    target: 'es2020',
  },
};
```

#### Function-Based Configuration

```typescript
// hps.config.ts
import { defineConfig } from '@hyperse/hps';

export default defineConfig((env) => {
  console.log('Project directory:', env.projectCwd);

  // Dynamic module resolution
  const tailwindPath = env.resolve(import.meta.url, 'tailwindcss');
  console.log('Tailwind CSS path:', tailwindPath);

  return {
    devServer: {
      port: env.mode === 'development' ? 3000 : 8080,
    },
    build: {
      target: 'es2020',
    },
  };
});
```

## Configuration Options

### `createLoadConfigPlugin(options?)`

Creates a load config plugin instance.

**Parameters:**

- `options` (optional): Configuration options
  - `configFile`: Custom configuration file name (default: `'hps'`)

**Returns:** A configured load config plugin

### Configuration Environment

The plugin provides a configuration environment object with:

- `projectCwd`: Current project directory
- `resolve`: Dynamic module resolution utility
- `mode`: Current build mode (development/production)
- Other environment-specific properties

## API Reference

### `createLoadConfigPlugin(options?)`

Creates and returns the load config plugin instance for HPS.

**Parameters:**

- `options.configFile`: Custom configuration file name (default: `'hps'`)

**Returns:** A configured HPS plugin that sets up context loading

### `loadHpsConfigFile(projectCwd, configEnv, configLoaderOptions)`

Internal function that loads and processes configuration files.

**Parameters:**

- `projectCwd`: Project root directory
- `configEnv`: Configuration environment object
- `configLoaderOptions`: Loader configuration options

**Returns:** Promise resolving to the loaded configuration

### Configuration Environment Interface

```typescript
interface EvolveConfigBase {
  projectCwd: string;
  resolve: typeof requireResolve;
  // Additional environment properties
}
```

## Configuration File Discovery

The plugin searches for configuration files in the following order:

1. `{configFile}.config.ts` (TypeScript)
2. `{configFile}.config.js` (JavaScript)
3. `{configFile}.config.mjs` (ES Modules)
4. `{configFile}.config.cjs` (CommonJS)

Where `{configFile}` defaults to `'hps'` but can be customized.

## Advanced Usage

### Custom External Module Handling

```typescript
const loadConfigPlugin = createLoadConfigPlugin({
  configFile: 'hps',
  loaderOptions: {
    externals: [/^@hyperse\/.*/, /^@my-org\/.*/],
  },
});
```

### Dynamic Module Resolution

```typescript
// hps.config.ts
export default defineConfig((env) => {
  // Resolve modules dynamically
  const reactPath = env.resolve(import.meta.url, 'react');
  const lodashPath = env.resolve(import.meta.url, 'lodash');

  return {
    // Use resolved paths in configuration
    alias: {
      react: reactPath,
      lodash: lodashPath,
    },
  };
});
```

## Integration with Other Plugins

The load config plugin works seamlessly with other HPS plugins:

```typescript
import { createLoadConfigPlugin } from '@hyperse/hps-plugin-load-config';
import { createServePlugin } from '@hyperse/hps-plugin-serve';
import { createBuildPlugin } from '@hyperse/hps-plugin-build';

const wizard = new Wizard();

// Load configuration first
wizard.use(createLoadConfigPlugin());

// Then register other plugins that use the config
wizard.use(createServePlugin());
wizard.use(createBuildPlugin());
```

## Error Handling

- **File Not Found**: Gracefully handles missing configuration files
- **Syntax Errors**: Provides clear error messages for malformed configurations
- **Type Errors**: TypeScript type checking for configuration objects
- **Module Resolution**: Handles dynamic module resolution failures

## Performance Considerations

- **Caching**: Configuration files are cached after first load
- **External Modules**: Configure externals to avoid bundling large dependencies
- **Lazy Loading**: Configuration is loaded only when needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the [GPLv3 LICENSE](./LICENSE).
