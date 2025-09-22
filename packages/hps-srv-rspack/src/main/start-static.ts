import type { DeepPartial } from '@hyperse/config-loader';
import { createGlobalCompiler } from '../compiler/create-global-compiler.js';
import { loadEvolveConfig } from '../load-config/load-evolve-config.js';
import { type HpsEvolveOptions } from '../types/types-options.js';
import { prepareStatic } from './prepare-static.js';

/**
 * The main entry to start evolve static server to proxy all modules of `production` build
 * @param projectCwd The Root directory (workspace) of this project.
 * @param overrideEvolveOptions The overrided evolve options
 * @param configLoaderOptions Evolve config loader options
 */
export const startStatic = async (
  projectCwd: string,
  overrideEvolveOptions: DeepPartial<HpsEvolveOptions> = {}
) => {
  const evolveOptions = await loadEvolveConfig(
    projectCwd,
    overrideEvolveOptions
  );

  await createGlobalCompiler(true, evolveOptions);

  return prepareStatic(projectCwd, evolveOptions);
};
