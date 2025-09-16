import { logger } from '@hyperse/hps-srv-common';
import { CircularDependencyRspackPlugin, type Plugins } from '@rspack/core';

/**
 * Detect modules with circular dependencies when bundling with webpack for `development` mode.
 * @param serveMode development mode
 * @param evolveOptions evolve options
 * @returns
 */
export const createCircularDependencyPlugins = (
  serveMode: boolean
): Plugins => {
  if (!serveMode) {
    return [];
  }
  return [
    new CircularDependencyRspackPlugin({
      allowAsyncCycles: false,
      exclude: /node_modules/,
      failOnError: false,
      onDetected(entrypoint, modules) {
        logger.warn(`Found a cycle in ${entrypoint}: ${modules.join(' -> ')}`);
      },
    }),
  ];
};
