import type { ForgeTsCheckerOptions } from '@hyperse/hps-srv-ts-checker';
import { createTsCheckerCompiler } from '@hyperse/hps-srv-ts-checker';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const createGlobalCompiler = async (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions
): Promise<boolean> => {
  const { runTsChecker, projectCwd, devServer } = evolveOptions;

  const lastOptions: ForgeTsCheckerOptions = {
    serveMode,
    projectCwd: projectCwd,
    runTsChecker: runTsChecker,
    watchOptions: devServer?.watchOptions || {},
  };

  return await createTsCheckerCompiler(lastOptions);
};
