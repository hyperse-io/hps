import type { Plugin as RspackPlugin } from '@rspack/core';
import { type EntryMapItem } from '../../../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../../types/types-options.js';
import { EvolveMultiCdnPlugin } from './multi-html-cdn-plugin.js';
import { createMultiHtmlRspackPlugins } from './multi-html-rspack-plugin.js';

/**
 * Create `html-webpack-plugin` for this build, refer to best practices
 *
 * @param buildEntryItem the entries for this `build`
 * @param allEnv
 */
export const createHtmlPlugins = (
  serveMode: boolean,
  entryMapItemList: EntryMapItem[],
  evolveOptions: HpsEvolveOptions
): RspackPlugin[] => {
  const plugins: RspackPlugin[] = [];

  if (serveMode) {
    return plugins;
  }

  plugins.push(
    ...createMultiHtmlRspackPlugins(serveMode, evolveOptions, entryMapItemList)
  );

  plugins.push(new EvolveMultiCdnPlugin(evolveOptions, entryMapItemList));
  return plugins;
};
