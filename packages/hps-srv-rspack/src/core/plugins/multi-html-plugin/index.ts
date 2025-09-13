import type { Plugin as RspackPlugin } from '@rspack/core';
import { type EntryMapItem } from '../../../types/types-entry-map.js';
import { type EvolveMultiCdnEnvType } from '../../../types/types-multi-html.js';
import { type HpsEvolveOptions } from '../../../types/types-options.js';
import { FlatEvolveMultiCdnPlugin } from './multi-html-cdn-plugin.js';
import { createMultiHtmlRspackPlugins } from './multi-html-rspack-plugin.js';

/**
 * Create `html-webpack-plugin` for this build, refer to best practices
 *
 * IF serveMode is true, not attach any plugins
 * Otherwise, attach `html-webpack-plugin` and `@flatjs/evolve-plugin-multi-html-cdn`
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

  // Attach `html-webpack-plugin` first
  const allEnv = Object.keys(
    evolveOptions.multiHtmlCdn
  ) as Array<EvolveMultiCdnEnvType>;

  plugins.push(
    ...createMultiHtmlRspackPlugins(
      serveMode,
      evolveOptions,
      entryMapItemList,
      allEnv
    )
  );

  //attach `@flatjs/evolve-plugin-multi-html-cdn` plugin
  //`@flatjs/evolve-plugin-multi-html-cdn` must be the last plugin
  plugins.push(new FlatEvolveMultiCdnPlugin(evolveOptions, entryMapItemList));
  return plugins;
};
