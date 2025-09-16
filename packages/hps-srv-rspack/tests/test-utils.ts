import { rmSync } from 'node:fs';
import { join } from 'node:path';
import type { DeepPartial } from '@hyperse/config-loader';
import { mergeOptions, requireResolve } from '@hyperse/hps-srv-common';
import { type EvolveConfigBase } from '../src/define-config/define-config.js';
import { loadEvolveConfigFile } from '../src/load-config/load-evolve-config-file.js';
import { type ConfigLoaderOptions } from '../src/load-config/types.js';
import { startBuild } from '../src/main/start-build.js';
import { startServe } from '../src/main/start-serve.js';
import type { EvolveBuildResult } from '../src/types/types-build-result.js';
import { type HpsEvolveOptions } from '../src/types/types-options.js';

export const cleanProjectBuildOutput = (projectCwd: string): void => {
  ['dist', 'cjs', 'esm', 'umd', 'public'].forEach((item) => {
    rmSync(join(projectCwd, item), {
      recursive: true,
      force: true,
    });
  });
};

export const configEnv: EvolveConfigBase = {
  projectCwd: '',
  command: 'serve',
  resolve: requireResolve,
};

/**
 * FIXME: For UT purpose cause of `UT` run thread-worker has clone data issue.
 * Use normal build pipeline to run testing case.
 */
export const startTestBuild = async (
  projectCwd: string,
  buildModules: string[],
  overrideEvolveOptions: DeepPartial<HpsEvolveOptions> = {},
  configLoaderOptions?: ConfigLoaderOptions
): Promise<EvolveBuildResult[]> => {
  const command: EvolveConfigBase = {
    projectCwd,
    command: 'build',
    resolve: requireResolve,
  };

  const evolveFileOptions = await loadEvolveConfigFile(
    projectCwd,
    command,
    configLoaderOptions
  );

  const finalEvolveOptions = mergeOptions(
    evolveFileOptions,
    overrideEvolveOptions
  );

  return startBuild(projectCwd, buildModules, finalEvolveOptions);
};

export const startTestServe = async (
  projectCwd: string,
  buildModules: string[],
  overrideEvolveOptions: DeepPartial<HpsEvolveOptions> = {},
  configLoaderOptions?: ConfigLoaderOptions
) => {
  const command: EvolveConfigBase = {
    projectCwd,
    command: 'serve',
    resolve: requireResolve,
  };

  const evolveFileOptions = await loadEvolveConfigFile(
    projectCwd,
    command,
    configLoaderOptions
  );

  const finalEvolveOptions = mergeOptions(
    evolveFileOptions,
    overrideEvolveOptions
  );

  await startServe(projectCwd, buildModules, finalEvolveOptions);
};
