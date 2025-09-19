import type { DeepPartial } from '@hyperse/config-loader';
import { searchConfig, type UserConfigExport } from '@hyperse/config-loader';
import { configFileName } from '../constants.js';
import type { MockConfigBase } from '../define-config/define-config.js';
import type { HpsMockOptions } from '../types/types-options.js';
import type { ConfigLoaderOptions } from './load-mock-config.js';

export const loadMockConfigFile = async (
  projectCwd: string,
  configEnv: MockConfigBase,
  configLoaderOptions: ConfigLoaderOptions = {
    configFile: configFileName,
    loaderOptions: {
      externals: [/^@hyperse\/.*/],
    },
  }
): Promise<DeepPartial<HpsMockOptions>> => {
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
  return localData as DeepPartial<HpsMockOptions>;
};
