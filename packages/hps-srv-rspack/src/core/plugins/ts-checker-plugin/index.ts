import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import { logger } from '@hyperse/hps-srv-common';
import type { Plugins } from '@rspack/core';
import type { HpsEvolveOptions } from '../../../types/types-options.js';

export const createTsCheckerPlugins = (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions
): Plugins => {
  const plugins: Plugins = [];

  const { runTsChecker, projectCwd } = evolveOptions || {};

  if (!runTsChecker) {
    return plugins;
  }

  plugins.push(
    new TsCheckerRspackPlugin({
      async: serveMode,
      // Avoid error notifications to dev serve and prevent the issue from being displayed in view
      devServer: false,
      issue: {},
      logger: {
        log(message) {
          logger.info(message);
        },
        error(message) {
          logger.error(message);
        },
      },
      typescript: {
        context: projectCwd,
        memoryLimit: 2048 * 4,
      },
    })
  );

  return plugins;
};
