import type { ForgeTsCheckerOptions } from '@hyperse/hps-srv-ts-checker';
import { createTsCheckerCompiler } from '@hyperse/hps-srv-ts-checker';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const createGlobalCompiler = async (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions
): Promise<boolean> => {
  const { rspack, projectCwd, devServer } = evolveOptions;

  const lastOptions: ForgeTsCheckerOptions = {
    serveMode,
    projectCwd: projectCwd,
    runTsChecker: rspack?.plugins?.tsCheckerPlugin?.enabled,
    watchOptions: devServer?.watchOptions || {},
  };

  return await createTsCheckerCompiler(lastOptions);
};
