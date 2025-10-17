import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execNpmInstaller } from '@armit/package';
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
  tsconfigPath?: string
): Promise<EvolveBuildResult[]> => {
  const command: EvolveConfigBase = {
    projectCwd,
    resolve: requireResolve,
  };

  const evolveFileOptions = await loadEvolveConfigFile(projectCwd, command, {
    configFile: 'hps-evolve',
    loaderOptions: {
      externals: [/^@hyperse\/.*/],
      externalExclude: (moduleId: string | RegExp) => {
        return moduleId.toString().startsWith('@hyperse/');
      },
      tsconfig: tsconfigPath,
    },
  });

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

  return await startServe(projectCwd, buildModules, finalEvolveOptions);
};

export const checkNodeModules = async (projectCwd: string) => {
  const nodeModulesPath = join(projectCwd, 'node_modules');
  if (existsSync(nodeModulesPath)) {
    return;
  }
  console.log('Start install node_modules...');
  await execNpmInstaller(projectCwd);
};
