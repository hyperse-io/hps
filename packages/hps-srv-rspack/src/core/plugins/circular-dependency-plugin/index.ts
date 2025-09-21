import { logger } from '@hyperse/hps-srv-common';
import { CircularDependencyRspackPlugin, type Plugins } from '@rspack/core';
import { type HpsEvolveOptions } from '../../../types/types-options.js';

const cutBefore = (str: string, keyword: string) => {
  const regex = new RegExp(`^[\\s\\S]*?${keyword}/`);
  return str.replace(regex, '');
};

/**
 * Detect modules with circular dependencies when bundling with webpack for `development` mode.
 * @param serveMode development mode
 * @param evolveOptions evolve options
 * @returns
 */
export const createCircularDependencyPlugins = (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions
): Plugins => {
  if (!serveMode) {
    return [];
  }

  const { projectCwd } = evolveOptions;
  return [
    new CircularDependencyRspackPlugin({
      allowAsyncCycles: false,
      exclude: /node_modules/,
      failOnError: false,
      onDetected(_, modules) {
        const relativePaths = modules
          .map((module) => cutBefore(module, projectCwd))
          .join(' -> ');
        logger.warn(`Circular dependency detected:\r\n ${relativePaths}`);
      },
    }),
  ];
};
