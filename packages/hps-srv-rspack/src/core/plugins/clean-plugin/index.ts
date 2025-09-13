import { posix } from 'node:path';
import { ensureSlash } from '@hyperse/hps-srv-common';
import type { Plugins } from '@rspack/core';
import { type EntryMapItem } from '../../../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../../../types/types-options.js';
import { CleanPlugin } from './clean-plugin.js';
/**
 * Cleaning up the /dist folder for `production` build
 * @param singleEntryItem
 * @returns
 */
export const createCleanPlugins = (
  serveMode: boolean,
  entryMapItemList: EntryMapItem[],
  evolveOptions: HpsEvolveOptions
): Plugins => {
  if (serveMode) {
    return [];
  }
  return [
    new CleanPlugin({
      verbose: true,
      projectCwd: evolveOptions.projectCwd,
      cleanOnceBeforeBuildPatterns: entryMapItemList.map((entryMapItem) => {
        return `${posix.join(ensureSlash(entryMapItem[0], true), '**/*')}`;
      }),
    }),
  ];
};
