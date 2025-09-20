import type { DeepPartial, LoaderOptions } from '@hyperse/config-loader';
import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import { defaultMockOptions } from '../default-options.js';
import { type HpsMockOptions } from '../types/types-options.js';

export type ConfigLoaderOptions = {
  configFile: string;
  loaderOptions: LoaderOptions;
};

export const loadMockConfig = async (
  projectCwd: string,
  overrideOptions: DeepPartial<HpsMockOptions> = {}
): Promise<HpsMockOptions> => {
  const mergedConfigOptions = mergeOptions<HpsMockOptions>(
    defaultMockOptions,
    overrideOptions
  );
  const finalData = mergeOptions<HpsMockOptions>(mergedConfigOptions, {
    projectCwd,
  });
  logger.debug(`Load mock config:\n${JSON.stringify(finalData, null, 2)}`);
  return finalData;
};
