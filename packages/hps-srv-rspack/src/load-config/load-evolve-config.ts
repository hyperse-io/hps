import type { DeepPartial } from '@hyperse/config-loader';
import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import { defaultEvolveOptions } from '../default-options.js';
import { normalizeResolveAlias } from '../helpers/helper-normalize-resolve-alias.js';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const loadEvolveConfig = async (
  projectCwd: string,
  overrideOptions: DeepPartial<HpsEvolveOptions> = {}
): Promise<HpsEvolveOptions> => {
  const mergedConfigOptions = mergeOptions<HpsEvolveOptions>(
    defaultEvolveOptions,
    overrideOptions
  );
  const latestEvolveOptions = mergeOptions(mergedConfigOptions, { projectCwd });

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
