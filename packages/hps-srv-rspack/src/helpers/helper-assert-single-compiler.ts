import { dirname, join, posix } from 'path';
import { searchPackageDir } from '@armit/package';
import { mergeOptions, requireResolve } from '@hyperse/hps-srv-common';
import { type RspackOptions } from '@rspack/core';
import { devReactFastRefresh } from '../constants.js';
import { type EvolveEntryMap } from '../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../types/types-options.js';
import { type RspackEntryObject } from '../types/types-rspack.js';
import { normalizeEvolveEntryName } from './helper-normalize-entry-map.js';

/**
 * Asserts a single compiler configuration by generating a new entry object based on the served entries,
 * rspack configuration, evolve options, and enabled HMR flag.
 *
 * @param servedEntries - The served entries object.
 * @param rspackConfig `Omit<Configuration, 'entry'>` rspack final configuration
 * @param evolveOptions - The flat evolve options object.
 * @param enabledHmr - Flag indicating whether Hot Module Replacement (HMR) is enabled. Default is false.
 * @returns The merged rspack configuration object with the new entry object.
 * @throws Error if the react-refresh-webpack-plugin package directory is not found.
 */
export function assertSingleCompiler(
  servedEntries: EvolveEntryMap,
  rspackConfig: Omit<RspackOptions, 'entry'>,
  evolveOptions: HpsEvolveOptions,
  enabledHmr = false
): Omit<RspackOptions, 'entry'> & {
  entry?: RspackEntryObject;
} {
  const newEntry: RspackEntryObject = {};
  for (const [entryName, entryItem] of Object.entries(servedEntries)) {
    // Make sure that we have correct `virtualPath` for each webpack `entry`
    const normalizedEntryName = normalizeEvolveEntryName(
      entryName,
      evolveOptions.projectVirtualPath
    );

    newEntry[normalizedEntryName] = entryItem.entry;

    if (enabledHmr) {
      // `${virtualPath}/module/reactRefreshSetup`
      const fastRefreshEntryName = posix.join(
        normalizedEntryName,
        devReactFastRefresh.reactRefreshSetup
      );
      const reactRefresh = requireResolve(
        import.meta.url,
        '@rspack/plugin-react-refresh'
      );
      const reactRefreshPackageDir = searchPackageDir({
        cwd: dirname(reactRefresh),
      });

      // Make sure that we have a correct `react-refresh-webpack-plugin` package directory
      // Sometimes the dynamic load package has been deduped and the package directory is not correct
      if (!reactRefreshPackageDir) {
        throw new Error(
          'react-refresh-webpack-plugin package directory not found'
        );
      }

      newEntry[fastRefreshEntryName] = [
        join(reactRefreshPackageDir, 'client', 'reactRefreshEntry.js'),
      ];
    }
  }

  const groupName = Object.values(servedEntries)[0].groupName;

  return mergeOptions<
    Omit<RspackOptions, 'entry'> & {
      entry?: RspackEntryObject;
    }
  >(rspackConfig, {
    name: groupName,
    entry: newEntry,
  });
}
