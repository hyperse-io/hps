import type { RspackOptions, Target } from '@rspack/core';
import { assertGroupEntryItem } from '../helpers/helper-assert-group-entry-item.js';
import type { EvolveEntryMap } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';
import { createExternals } from './create-externals.js';
import { createOptimization } from './create-optimization.js';
import { createOutput } from './create-output.js';
import { createPerformance } from './create-performance.js';
import { createResolve } from './create-resolve.js';
import { loadRspackWatchOptions } from './load-rspack-watch-options.js';
import { createPlugins } from './plugins/create-plugins.js';
import { createRuleSets } from './rules/create-rule-sets.js';

/**
 * Try to organization the configuration object of `rspack`
 * @param serveMode Whether the current mode is `serve` mode.
 * @param entryMap The only single one `servedEntry` or `toBuildEntry`
 * @param overrideOptions The manually override configuration options for hps
 */
export const loadRspackConfig = async (
  serveMode: boolean,
  entryMap: EvolveEntryMap,
  evolveOptions: HpsEvolveOptions
): Promise<Omit<RspackOptions, 'entry'>> => {
  const { projectCwd, rspack, devServer } = evolveOptions;
  const entryMapItemList = assertGroupEntryItem(entryMap, evolveOptions);

  const watchOptions = loadRspackWatchOptions(
    entryMap,
    evolveOptions,
    devServer?.watchOptions
  );
  const moduleRules = createRuleSets(
    serveMode,
    entryMapItemList,
    evolveOptions
  );
  const plugins = await createPlugins(
    serveMode,
    entryMapItemList,
    evolveOptions
  );
  const firstEntryMap = entryMapItemList[0];
  const output = await createOutput(serveMode, evolveOptions, firstEntryMap);
  // If `mode` is not set, we will use `serveMode` to determine the mode.
  // For `serve` mode, we will use `development` mode.
  // For `build` mode, we will use `production` mode.
  let mode: RspackOptions['mode'];
  if (rspack.mode && rspack.mode !== 'none') {
    mode = rspack.mode;
  } else {
    mode = serveMode ? 'development' : 'production';
  }
  const rspackConfig: RspackOptions = {
    mode,
    plugins,
    watchOptions,
    output,
    // The base directory, an absolute path, for resolving entry points and loaders from configuration.
    // The context is an absolute string to the directory that contains the entry files.
    context: projectCwd,
    target: (rspack.target ?? ['web', 'es5']) as Target,
    resolve: createResolve(projectCwd, rspack),
    module: {
      ...(rspack.module || {}),
      rules: moduleRules,
    },
    devtool: serveMode ? 'source-map' : rspack?.sourceMap || false,
    externalsType: rspack?.externalsType,
    // It's globally external configurations for all entries, if we need to specificed externals for each entry.
    // Simply move it into entry options.
    externals: createExternals(rspack?.externals, firstEntryMap),
    performance: createPerformance(serveMode, rspack?.performance),
    optimization: createOptimization(serveMode, evolveOptions),
    // Setup logging level for `infrastructure` like. `rspack-dev-server`
    infrastructureLogging: rspack?.infrastructureLogging ?? {
      level: 'warn',
    },
    stats: rspack?.stats ?? {
      preset: 'errors-warnings',
    },
    lazyCompilation: serveMode
      ? {
          entries: true,
          imports: true,
          ...(rspack?.lazyCompilation || {}),
        }
      : false,
    cache: true,
  };
  return rspackConfig;
};
