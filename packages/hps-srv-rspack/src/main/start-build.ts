import type { DeepPartial } from '@hyperse/config-loader';
import { logger, requireResolve } from '@hyperse/hps-srv-common';
import { ignoreEntryOptionKeys } from '../constants.js';
import type { EvolveConfigBase } from '../define-config/define-config.js';
import { filterActivedEntriesByModule } from '../helpers/helper-filter-actived-entries.js';
import { normalizeEvolveEntryMap } from '../helpers/helper-normalize-entry-map.js';
import { splitToEntryGroup } from '../helpers/helper-split-to-entry-group.js';
import { loadEvolveConfig } from '../load-config/load-evolve-config.js';
import type { ConfigLoaderOptions } from '../load-config/types.js';
import type { EvolveBuildResult } from '../types/types-build-result.js';
import type { EvolveEntryMap } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';
import { envVerify } from './env-verify.js';
import { prepareBuild } from './prepare-build.js';

const runRspackTask = async (
  entryMapGroupList: EvolveEntryMap[],
  newEvolveOptions: HpsEvolveOptions
) => {
  const buildResults: EvolveBuildResult[] = [];
  for (const entryMapGroupItem of entryMapGroupList) {
    const buildResult = await prepareBuild(
      entryMapGroupItem,
      newEvolveOptions
    ).then((result) => {
      return result;
    });
    buildResults.push(buildResult);
  }
  return buildResults;
};

export const startBuild = async (
  projectCwd: string,
  buildModules: string[],
  overrideEvolveOptions: DeepPartial<HpsEvolveOptions> = {}
): Promise<EvolveBuildResult[]> => {
  // Try to load evolve configuration from `hps-evolve.config.ts`
  const newEvolveOptions = await loadEvolveConfig(
    projectCwd,
    overrideEvolveOptions
  );

  await envVerify(projectCwd, newEvolveOptions);

  const buildEntries = filterActivedEntriesByModule(
    newEvolveOptions.entryMap,
    buildModules
  );

  // Make sure that each entry option includes the groupName
  const normalizedBuildOneEntry = normalizeEvolveEntryMap(
    buildEntries,
    newEvolveOptions.entryMap
  );

  const entryMapGroupList = splitToEntryGroup(
    normalizedBuildOneEntry,
    newEvolveOptions,
    ignoreEntryOptionKeys,
    false
  );

  if (!entryMapGroupList.length) {
    logger.warn(`No build entries provided!`);
    return [];
  }

  const buildResults: EvolveBuildResult[] = await runRspackTask(
    entryMapGroupList,
    newEvolveOptions
  );

  return buildResults;
};
