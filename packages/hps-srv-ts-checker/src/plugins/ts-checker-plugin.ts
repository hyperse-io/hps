import { dirname, resolve } from 'node:path';
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
    tsConfigPath,
  } = options;

  const plugins: Plugins = [];
  // Runs typescript type checker and linter on separate process.
  if (runTsChecker) {
    const configFileAbs = tsConfigPath
      ? resolve(projectCwd, tsConfigPath)
      : undefined;
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
          // Must match ts-checker-rspack-plugin default: context is the directory of configFile.
          // If context is the package root while configFile lives in `ui/`, globs like `./**/*`
          // in that tsconfig are resolved from the wrong base and the checker typechecks the whole package.
          context: configFileAbs ? dirname(configFileAbs) : projectCwd,
          memoryLimit: 2048 * 4,
          configFile: configFileAbs,
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
