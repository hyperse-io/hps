import type { DeepPartial } from '@hyperse/config-loader';
import { searchConfig, type UserConfigExport } from '@hyperse/config-loader';
import { configFileName } from '../constants.js';
import type { EvolveConfigBase } from '../define-config/define-config.js';
import { type HpsEvolveOptions } from '../types/types-options.js';
import { type ConfigLoaderOptions } from './types.js';

export const loadEvolveConfigFile = async (
  projectCwd: string,
  configEnv: EvolveConfigBase,
  configLoaderOptions: ConfigLoaderOptions = {
    configFile: configFileName,
    loaderOptions: {
      externals: [/^@hyperse\/.*/],
    },
  }
): Promise<DeepPartial<HpsEvolveOptions>> => {
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
  return localData as DeepPartial<HpsEvolveOptions>;
};
