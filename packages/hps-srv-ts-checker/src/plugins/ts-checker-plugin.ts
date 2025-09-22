import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import { logger } from '@hyperse/hps-srv-common';
import type { Plugins } from '@rspack/core';
import type { ForgeTsCheckerOptions } from '../types/type-options.js';
import { TsCheckerGuardPlugin } from './ts-checker-guard-plugin.js';

export const createTsCheckerPlugins = (
  options: ForgeTsCheckerOptions
): Plugins => {
  const {
    serveMode,
    runTsChecker = true,
    projectCwd = process.cwd(),
  } = options;

  const plugins: Plugins = [];
  // Runs typescript type checker and linter on separate process.
  if (runTsChecker) {
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

    // Guard the ts-checker issues
    plugins.push(
      new TsCheckerGuardPlugin({
        autoExit: !serveMode,
      })
    );
  }

  return plugins;
};
