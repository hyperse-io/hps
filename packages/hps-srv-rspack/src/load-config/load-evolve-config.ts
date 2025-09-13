import type { DeepPartial } from '@hyperse/config-loader';
import { searchConfig, type UserConfigExport } from '@hyperse/config-loader';
import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import { configFileName } from '../constants.js';
import { defaultEvolveOptions } from '../default-options.js';
import { type EvolveConfigBase } from '../define-config/define-config.js';
import { normalizeResolveAlias } from '../helpers/helper-normalize-resolve-alias.js';
import { type HpsEvolveOptions } from '../types/types-options.js';
import { type ConfigLoaderOptions } from './types.js';

export const loadEvolveConfig = async (
  configEnv: EvolveConfigBase,
  projectCwd: string,
  overrideOptions: DeepPartial<HpsEvolveOptions> = {},
  configLoaderOptions: ConfigLoaderOptions = {
    configFile: configFileName,
    loaderOptions: {
      externals: [/^@hyperse\/.*/],
    },
  }
): Promise<HpsEvolveOptions> => {
  const { configFile, loaderOptions } = configLoaderOptions;
  const data = await searchConfig<
    UserConfigExport<DeepPartial<HpsEvolveOptions>>
  >(configFile, projectCwd, {
    ...loaderOptions,
    projectCwd,
  });
  let localData = {};
  if (typeof data?.config === 'function') {
    localData = await data?.config(configEnv);
  } else {
    localData = data?.config || {};
  }
  // Merge user local config with default configure options.
  const localConfigOptions = mergeOptions<HpsEvolveOptions>(
    defaultEvolveOptions,
    localData
  );

  const mergedConfigOptions = mergeOptions<HpsEvolveOptions>(
    localConfigOptions,
    overrideOptions
  );
  const finalData = mergeOptions(mergedConfigOptions, { projectCwd });

  // We don't need to load mocks configuration from `flatjs-mock.config.js` while `build` phase.
  //TODO
  // const latestEvolveOptions =
  //   configEnv.command === 'build'
  //     ? finalData
  //     : await refreshEvolveMockOptions(
  //         projectCwd,
  //         finalData,
  //         configLoaderOptions
  //       );

  const latestEvolveOptions = finalData;

  logger.debug(
    `Load evolve config:\n${JSON.stringify(latestEvolveOptions, null, 2)}`
  );

  // Normalize webpack.resolve.alias to make sure convert `alias` to absolute path.
  if (latestEvolveOptions.rspack?.resolve?.alias) {
    latestEvolveOptions.rspack.resolve.alias = normalizeResolveAlias(
      projectCwd,
      latestEvolveOptions.rspack?.resolve?.alias
    );
  }
  return latestEvolveOptions;
};
