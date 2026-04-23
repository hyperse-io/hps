import type { ForgeTsCheckerOptions } from '@hyperse/hps-srv-ts-checker';
import { createTsCheckerCompiler } from '@hyperse/hps-srv-ts-checker';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const createGlobalCompiler = async (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions
): Promise<boolean> => {
  const { rspack, projectCwd, devServer } = evolveOptions;

  const tsConfig = rspack?.resolve?.tsConfig;
  const tsConfigPath = !tsConfig
    ? undefined
    : typeof tsConfig === 'string'
      ? tsConfig
      : typeof tsConfig === 'object' &&
          'configFile' in tsConfig &&
          typeof (tsConfig as { configFile?: unknown }).configFile === 'string'
        ? (tsConfig as { configFile: string }).configFile
        : undefined;

  const lastOptions: ForgeTsCheckerOptions = {
    serveMode,
    projectCwd: projectCwd,
    runTsChecker: rspack?.plugins?.tsCheckerPlugin?.enabled,
    watchOptions: devServer?.watchOptions || {},
    tsConfigPath,
  };

  return await createTsCheckerCompiler(lastOptions);
};
