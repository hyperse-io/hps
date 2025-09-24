import { ensureSlash, mergeOptions } from '@hyperse/hps-srv-common';
import { ignoreEntryOptionKeys } from '../constants.js';
import { startRspackBuild } from '../core/start-rspack-build.js';
import { EvolveBuildError } from '../errors/evolve-build-error.js';
import { printCompilerError } from '../helpers/helper-print-log.js';
import { verifyGroupEntryOptions } from '../helpers/helper-verify-group-entry-options.js';
import type { EvolveBuildResult } from '../types/types-build-result.js';
import { type EvolveEntryMap } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';

/**
 * The main entry to start an evolve `build`
 * @param entryMapItem The `entryMapItem` for one entry build task
 * @param evolveOptions FlatEvolveOptions
 */
export const prepareBuild = async (
  groupEntries: EvolveEntryMap,
  evolveOptions: HpsEvolveOptions
): Promise<EvolveBuildResult> => {
  const firstGroupEntryItem = Object.values(groupEntries)[0];

  if (!verifyGroupEntryOptions(groupEntries, ignoreEntryOptionKeys, true)) {
    throw new Error('The entry options in a group must be the same.');
  }

  // Fetch all configuration cdn
  const htmlCdn = evolveOptions.rspack.plugins.htmlPlugin.htmlCdn;

  if (!htmlCdn) {
    throw new Error(
      `htmlCdn is not configured, groupName: ${firstGroupEntryItem.groupName}`
    );
  }

  // Random choose one to publicPath
  const cdnPublicPath = ensureSlash(htmlCdn, true);

  try {
    const useRelativeAssetPath =
      firstGroupEntryItem.options?.useRelativeAssetPath;
    const buildEvolveOptions: HpsEvolveOptions = mergeOptions<HpsEvolveOptions>(
      evolveOptions,
      {
        rspack: {
          // Only for `assets` used at styling files (e.g.`xxx.less`)
          publicPath: useRelativeAssetPath ? 'auto' : cdnPublicPath,
        },
      }
    );
    const buildResult = await startRspackBuild(
      groupEntries,
      buildEvolveOptions
    );

    return buildResult;
  } catch (err) {
    const formattedErrors = printCompilerError(err as Error);
    // Need re-throw error, in order to third API can capture this error.
    throw new EvolveBuildError(`BUILD_ERROR`, formattedErrors);
  }
};
