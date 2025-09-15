import type { Plugins } from '@rspack/core';

/**
 * Detect modules with circular dependencies when bundling with webpack for `development` mode.
 * @param serveMode development mode
 * @param evolveOptions evolve options
 * @returns
 */
export const createCircularDependencyPlugins = (): Plugins => {
  return [];
};
