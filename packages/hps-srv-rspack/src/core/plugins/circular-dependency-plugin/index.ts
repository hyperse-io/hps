import { definedPlugins } from '../defined-plugins.js';
import type { CircularDependencyOptions } from './types.js';
/**
 * Detect modules with circular dependencies when bundling with webpack for `development` mode.
 * @param serveMode development mode
 * @param evolveOptions evolve options
 * @returns
 */
export const createCircularDependencyPlugins =
  definedPlugins<CircularDependencyOptions>('CircularDependency', (options) => {
    return [];
  });
