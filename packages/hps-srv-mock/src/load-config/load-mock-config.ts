import type { DeepPartial, LoaderOptions } from '@hyperse/config-loader';
import { searchConfig, type UserConfigExport } from '@hyperse/config-loader';
import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import { configFileName } from '../constants.js';
import { defaultMockOptions } from '../default-options.js';
import { type MockConfigBase } from '../define-config/define-config.js';
import { type HpsMockOptions } from '../types/types-options.js';

export type ConfigLoaderOptions = {
  configFile: string;
  loaderOptions: LoaderOptions;
};

export const loadMockConfig = async (
  configEnv: MockConfigBase,
  projectCwd: string,
  overrideOptions: DeepPartial<HpsMockOptions> = {},
  configLoaderOptions: ConfigLoaderOptions = {
    configFile: configFileName,
    loaderOptions: {
      externals: [/^@hyperse\/.*/],
    },
  }
): Promise<HpsMockOptions> => {
  const { configFile, loaderOptions } = configLoaderOptions;
  const data = await searchConfig<
    UserConfigExport<DeepPartial<HpsMockOptions>>
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
  const localConfigOptions = mergeOptions<HpsMockOptions>(
    defaultMockOptions,
    localData
  );

  const mergedConfigOptions = mergeOptions<HpsMockOptions>(
    localConfigOptions,
    overrideOptions
  );
  const finalData = mergeOptions<HpsMockOptions>(mergedConfigOptions, {
    projectCwd,
  });
  logger.debug(`Load mock config:\n${JSON.stringify(finalData, null, 2)}`);
  return finalData;
};
