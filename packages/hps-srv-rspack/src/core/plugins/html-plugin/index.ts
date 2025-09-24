import type { Plugin as RspackPlugin } from '@rspack/core';
import { type EntryMapItem } from '../../../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../../types/types-options.js';
import { EvolveCdnPlugin } from './html-cdn-plugin.js';
import { createHtmlPlugins as createHtmlRspackPlugins } from './html-rspack-plugin.js';

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
    ...createHtmlRspackPlugins(serveMode, evolveOptions, entryMapItemList)
  );

  plugins.push(new EvolveCdnPlugin(evolveOptions, entryMapItemList));
  return plugins;
};
