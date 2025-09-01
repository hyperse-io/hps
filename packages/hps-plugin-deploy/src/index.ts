/**
 * @fileoverview Main entry point for the HPS Deploy Plugin
 *
 * This plugin provides deployment capabilities for static assets to various cloud providers.
 * Currently supports:
 * - Aliyun OSS (Object Storage Service)
 *
 * @example
 * ```typescript
 * import { createDeployPlugin } from '@hyperse/hps-plugin-deploy';
 *
 * const deployPlugin = createDeployPlugin({
 *   deployStrategies: [/* custom strategies *\/]
 * });
 * ```
 */

// Built-in strategies
export { AliyunAssetDeployStrategy } from './strategy/aliyun/AliyunAssetDeployStrategy.js';

// Main plugin factory
export type { CreateDeployPluginOptions } from './createDeployPlugin.js';
export { createDeployPlugin } from './createDeployPlugin.js';

// Strategy interfaces and types
export type { AssetDeployServiceOptions } from './strategy/AssetDeployService.js';
export { AssetDeployService } from './strategy/AssetDeployService.js';
export type {
  AssetDeployStrategy,
  AssetDeployStrategyOptions,
} from './strategy/AssetDeployStrategy.js';

// Utility functions
export * from './utils/index.js';
