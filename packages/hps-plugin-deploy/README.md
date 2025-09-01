# HPS Deploy Plugin

A flexible deployment plugin for the HPS (Hyperse) build system that supports deploying static assets to various cloud providers.

## Features

- **Multi-Provider Support**: Deploy to different cloud storage providers
- **Flexible File Matching**: Use glob patterns to specify which files to deploy
- **Progress Tracking**: Real-time upload progress with spinners
- **Error Handling**: Comprehensive error handling and validation
- **Extensible**: Easy to add new deployment strategies

## Currently Supported Providers

- **Aliyun OSS**: Alibaba Cloud Object Storage Service

## Installation

```bash
npm install @hyperse/hps-plugin-deploy
```

## Quick Start

```typescript
import { createDeployPlugin } from '@hyperse/hps-plugin-deploy';

const deployPlugin = createDeployPlugin();

// Register with your HPS wizard
wizard.use(deployPlugin);
```

## Usage

### Basic Deployment

```bash
# Deploy all files in dist/ to Aliyun OSS
hps deploy --target aliyun --match "dist/**/*"

# Deploy with custom prefix
hps deploy --target aliyun --match "dist/**/*" --prefix "v1.0.0"

# Deploy specific file types
hps deploy --target aliyun --match "dist/**/*.js" "dist/**/*.css"
```

### Command Options

| Option          | Alias | Description                    | Default           |
| --------------- | ----- | ------------------------------ | ----------------- |
| `--target`      | `-t`  | Deployment target (required)   | -                 |
| `--project-cwd` | `-p`  | Project working directory      | Current directory |
| `--prefix`      | -     | Path prefix for uploaded files | Empty string      |
| `--match`       | `-m`  | File patterns to match         | Empty array       |
| `--ignore`      | `-i`  | File patterns to ignore        | Empty array       |

## Configuration

### Environment Variables

For Aliyun OSS deployment, set the following environment variables:

```bash
# Required for Aliyun OSS
export REMOTE_CDN_BASE_URL="https://your-cdn.example.com"
export ALIYUN_API_ENDPOINT="https://oss-cn-hangzhou.aliyuncs.com"
export ALIYUN_ACCESS_KEY_ID="your-access-key-id"
export ALIYUN_ACCESS_KEY_SECRET="your-access-key-secret"
export ALIYUN_BUCKET_NAME="your-bucket-name"
```

### Custom Deployment Strategies

You can create custom deployment strategies by implementing the `AssetDeployStrategy` interface:

```typescript
import {
  AssetDeployStrategy,
  AssetDeployStrategyOptions,
} from '@hyperse/hps-plugin-deploy';

class MyCustomStrategy implements AssetDeployStrategy {
  readonly name = 'my-custom-target';

  async deploy(
    filePaths: string[],
    options: AssetDeployStrategyOptions
  ): Promise<void> {
    for (const filePath of filePaths) {
      // Implement your deployment logic here
      await this.uploadToMyService(filePath, options);
    }
  }

  private async uploadToMyService(
    filePath: string,
    options: AssetDeployStrategyOptions
  ) {
    // Your upload implementation
  }
}

// Use your custom strategy
const deployPlugin = createDeployPlugin({
  deployStrategies: [new MyCustomStrategy()],
});
```

## API Reference

### `createDeployPlugin(options?)`

Creates a deploy plugin instance.

**Parameters:**

- `options` (optional): Configuration options
  - `deployStrategies`: Array of custom deployment strategies

**Returns:** A configured deploy plugin

### `AssetDeployStrategy`

Interface that all deployment strategies must implement.

**Properties:**

- `name`: Unique strategy identifier
- `deploy()`: Method to deploy files

### Utility Functions

#### `ensureSlash(str, slashEndfix?, multiPlatform?)`

Normalizes path strings with proper slash endings.

#### `prepareUploadFiles(options)`

Prepares files for upload by matching patterns and filtering ignored files.

#### `isRemoteFileExist(httpFilePath, options?)`

Checks if a file exists on a remote server.

## File Patterns

The plugin uses glob patterns for file matching and ignoring:

- `dist/**/*` - All files in dist directory and subdirectories
- `*.js` - All JavaScript files
- `!**/*.map` - Ignore all .map files
- `**/node_modules/**` - Ignore node_modules (automatically included)

## Error Handling

The plugin provides comprehensive error handling:

- **Configuration Validation**: Validates required environment variables
- **File Validation**: Ensures files exist before attempting upload
- **Network Errors**: Handles network timeouts and connection issues
- **Upload Failures**: Provides detailed error messages for failed uploads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
