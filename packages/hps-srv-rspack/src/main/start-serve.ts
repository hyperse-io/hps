import type { DeepPartial } from '@hyperse/config-loader';
import { logger, requireResolve } from '@hyperse/hps-srv-common';
import { type EvolveConfigBase } from '../define-config/define-config.js';
import { filterActivedEntriesByModule } from '../helpers/helper-filter-actived-entries.js';
import { mergeInspectorEvolveConfig } from '../helpers/helper-merge-inspector-evolve-config.js';
import { normalizeEvolveEntryMap } from '../helpers/helper-normalize-entry-map.js';
import { loadEvolveConfig } from '../load-config/load-evolve-config.js';
import { type ConfigLoaderOptions } from '../load-config/types.js';
import { type HpsEvolveOptions } from '../types/types-options.js';
import { prepareServe } from './prepare-serve.js';

/**
 * The main entry to start evolve serve
 * @param projectCwd The Root directory (workspace) of this project.
 * @param serveModules The filter pattern to detect modules we want to serve.
 * @param overrideEvolveOptions The overrided evolve options
 * @param configLoaderOptions Evolve config loader options
 */
export const startServe = async (
  projectCwd: string,
  serveModules: string[],
  overrideEvolveOptions: DeepPartial<HpsEvolveOptions> = {}
) => {
  // Try to load evolve configuration from `hps-evolve.config.ts`
  let evolveOptions = await loadEvolveConfig(projectCwd, overrideEvolveOptions);

  // Merge inspector client entry
  const { inspector } = evolveOptions;
  if (inspector && inspector?.injectClient) {
    evolveOptions = mergeInspectorEvolveConfig(evolveOptions);
  }

  const servedEntries = filterActivedEntriesByModule(
    evolveOptions.entryMap,
    serveModules
  );

  const servedEntryKeys = Object.keys(servedEntries);

  // Make sure that we have at least one serve entry module.
  if (!servedEntryKeys.length) {
    logger.warn(`No served entries providered!`);
    return [];
  }

  logger.info(`servedEntries: ${JSON.stringify(servedEntryKeys, null, 2)}`);

  // Normalized served entries to make sure we have latested entry options.
  const normalizedServedEntries = normalizeEvolveEntryMap(
    servedEntries,
    evolveOptions.entryMap
  );

  return prepareServe(projectCwd, normalizedServedEntries, evolveOptions);
};
