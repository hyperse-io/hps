import { rspack } from '@rspack/core';
import { assertSingleCompiler } from '../helpers/helper-assert-single-compiler.js';
import { normalizeEvolveEntryName } from '../helpers/helper-normalize-entry-map.js';
import type { EvolveBuildResult } from '../types/types-build-result.js';
import type { EvolveEntryMap } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';
import { loadRspackConfig } from './load-rspack-config.js';

/**
 * Starts the build process for a group of entry files.
 *
 * @param groupBuildEntry - The map of entry files to be built.
 * @param evolveOptions - The options for the build process.
 * @returns A promise that resolves to the build result.
 */
export const startRspackBuild = async (
  groupBuildEntry: EvolveEntryMap,
  evolveOptions: HpsEvolveOptions
): Promise<EvolveBuildResult> => {
  // Try to load rspack configuration
  const rspackConfig = await loadRspackConfig(
    false,
    groupBuildEntry,
    evolveOptions
  );
  const currCompiler = assertSingleCompiler(
    groupBuildEntry,
    rspackConfig,
    evolveOptions
  );

  // Run the single build.
  return new Promise((resolve, reject) => {
    rspack(currCompiler, (err, stats) => {
      if (err) {
        // Handle errors here
        return reject(err);
      }
      const statsJson = stats?.toJson({});
      if (statsJson?.errors?.length) {
        return reject(statsJson.errors);
      }
      if (evolveOptions.rejectWarnings && statsJson?.warnings?.length) {
        return reject(statsJson.warnings);
      }

      const { projectVirtualPath } = evolveOptions;

      const buildEntryKeys = Object.keys(groupBuildEntry).map((entryName) =>
        normalizeEvolveEntryName(entryName, projectVirtualPath)
      );

      resolve({ name: buildEntryKeys, warningStats: statsJson?.warnings });
    });
  });
};
