# HPS Mock Plugin

A standalone mock server plugin for the HPS (Hyperse) build system that provides API mocking capabilities with configurable filters, hostname, and port settings for development and testing.

## Features

- **Standalone Mock Server**: Independent mock service that can run separately from development servers
- **Configurable Hostname**: Custom hostname configuration for mock endpoints
- **Port Management**: Flexible port configuration for mock services
- **Mock File Filtering**: Regex-based filtering to control which mock files are loaded
- **Integration Ready**: Works seamlessly with other HPS plugins and services
- **Development Friendly**: Optimized for development and testing workflows

## Installation

```bash
# yarn
yarn add @hyperse/hps-plugin-mock
# npm
npm install @hyperse/hps-plugin-mock
# pnpm
pnpm add @hyperse/hps-plugin-mock
```

## Quick Start

```typescript
import { createMockPlugin } from '@hyperse/hps-plugin-mock';

const mockPlugin = createMockPlugin();

// Register with your HPS wizard
wizard.use(mockPlugin);
```

## Usage

### Basic Mock Server

```bash
# Start mock server with default settings
hps mock

# Start with custom hostname and port
hps mock --hostname "api.localhost" --port 3001

# Start with mock file filters
hps mock --mock-filters "api/.*" "!api/test/.*"
```

### Command Options

| Option           | Alias | Description                            | Default  |
| ---------------- | ----- | -------------------------------------- | -------- |
| `--hostname`     | -     | Hostname for the mock server           | -        |
| `--port`         | -     | Port number for the mock server        | -        |
| `--mock-filters` | -     | Regex patterns for mock file filtering | `[".*"]` |

Notes:

- Mock filters use regex patterns; prefix with `!` to exclude patterns
- Hostname and port can be configured via CLI flags or HPS config
- The mock server integrates with the HPS configuration system

## Configuration

### HPS Config Integration

The mock plugin integrates with your HPS configuration file:

```typescript
// hps.config.ts
export default defineConfig({
  mock: {
    hostname: 'api.localhost',
    port: 3001,
    mockFilters: ['api/.*', '!api/test/.*'],
    https: true,
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true,
    },
  },
});
```

### Mock File Structure

Organize your mock files in a structured way:

```
project/
├── mocks/
│   ├── api/
│   │   ├── users/
│   │   │   ├── GET.js
│   │   │   └── POST.js
│   │   └── products/
│   │       └── GET.js
│   └── test/
│       └── fixtures/
│           └── data.json
└── hps.config.ts
```

### Mock File Examples

#### JavaScript Mock Files

```javascript
// mocks/api/users/GET.js
module.exports = {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ],
  },
};
```

```javascript
// mocks/api/users/POST.js
module.exports = (req) => {
  return {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      id: Date.now(),
      name: req.body.name,
      email: req.body.email,
      createdAt: new Date().toISOString(),
    },
  };
};
```

#### JSON Mock Files

```json
// mocks/api/products/GET.json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "products": [
      {
        "id": 1,
        "name": "Product 1",
        "price": 29.99
      }
    ]
  }
}
```

## How It Works

1. **Configuration Loading**: Loads mock configuration from HPS config and CLI flags
2. **Options Merging**: Combines CLI flags with configuration options
3. **Mock Server Start**: Launches the mock server using `@hyperse/hps-srv-mock`
4. **File Discovery**: Scans for mock files based on filter patterns
5. **Request Handling**: Processes incoming requests and returns mock responses

## API Reference

### `createMockPlugin()`

Creates and returns the mock plugin instance for HPS.

Returns: a configured HPS plugin that adds the `mock` command.

### `mock` command

Starts a standalone mock server with various configuration options.

**Flags:**

- `--hostname <hostname>`: Set the hostname for the mock server
- `--port <port>`: Set the port number for the mock server
- `--mock-filters <filters...>`: Configure mock file filtering with regex patterns

### Mock Configuration Interface

```typescript
interface HpsMockOptions {
  projectCwd: string;
  hostname?: string;
  port?: number;
  mockFilters?: string[];
  https?: boolean;
  cors?: {
    origin?: string | string[];
    credentials?: boolean;
  };
  // Additional mock server options
}
```

## Advanced Usage

### Custom Mock Filters

```bash
# Include only API mocks, exclude test files
hps mock --mock-filters "api/.*" "!.*test.*" "!.*spec.*"

# Include specific API endpoints only
hps mock --mock-filters "api/users/.*" "api/products/.*"
```

### Environment-Specific Configuration

```typescript
// hps.config.ts
export default defineConfig((env) => {
  const isDevelopment = env.mode === 'development';

  return {
    mock: {
      hostname: isDevelopment ? 'api.localhost' : 'api.staging.com',
      port: isDevelopment ? 3001 : 8080,
      mockFilters: isDevelopment ? ['api/.*'] : ['api/.*', '!api/test/.*'],
      https: !isDevelopment,
    },
  };
});
```

### Integration with Development Server

```typescript
// hps.config.ts
export default defineConfig({
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Mock server port
        changeOrigin: true,
      },
    },
  },
  mock: {
    port: 3001,
    hostname: 'localhost',
  },
});
```

## Dependencies

The plugin depends on several HPS service packages:

- `@hyperse/hps-srv-common`: Common utilities and logging
- `@hyperse/hps-srv-mock`: Mock server functionality
- `@hyperse/config-loader`: Configuration loading utilities

## Error Handling

- **Configuration Validation**: Validates required configuration options
- **Port Conflicts**: Handles port already in use scenarios
- **Mock File Errors**: Gracefully handles malformed mock files
- **Network Issues**: Provides clear error messages for connection problems

## Performance Tips

- Use specific mock filters to reduce file scanning overhead
- Organize mock files in a logical directory structure
- Use JSON files for static responses when possible
- Configure appropriate CORS settings for your use case

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the [GPLv3 LICENSE](./LICENSE).
