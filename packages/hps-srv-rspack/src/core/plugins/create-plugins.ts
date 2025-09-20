import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import { logger } from '@hyperse/hps-srv-common';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import rspack, { type Plugin as RspackPlugin } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { assertChunkFilename } from '../../helpers/helper-assert-chunk-filename.js';
import { enableBundleHashName } from '../../helpers/helper-enable-bundle-hashname.js';
import { getBundleFileName } from '../../helpers/helper-get-bundle-file-name.js';
import { shouldEnableReactFastRefresh } from '../../helpers/helper-should-enable-react-fast-refresh.js';
import { type EntryMapItem } from '../../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { createCircularDependencyPlugins } from './circular-dependency-plugin/index.js';
import { createCleanPlugins } from './clean-plugin/index.js';
import { createDefineVariablesPlugins } from './define-variable-plugin/index.js';
import { createModuleFederationPlugins } from './module-federation-plugin/index.js';
import { createHtmlPlugins } from './multi-html-plugin/index.js';
import { createProgressPlugins } from './progress-plugin/index.js';
import { createTsCheckerPlugins } from './ts-checker-plugin/index.js';

export const createPlugins = async (
  serveMode: boolean,
  entryMapItemList: EntryMapItem[],
  evolveOptions: HpsEvolveOptions
): Promise<RspackPlugin[]> => {
  const firstEntryMapItem = entryMapItemList[0];
  const [entryName, entryItemOption] = firstEntryMapItem;
  const bundleHashNameEnabled = enableBundleHashName(
    evolveOptions,
    entryItemOption?.options
  );

  const builtInPlugins: RspackPlugin[] = [
    ...createProgressPlugins(serveMode, entryMapItemList),
    // Because TS will may generate .js and .d.ts files, you should ignore these files,
    // otherwise watchers may go into an infinite watch loop.
    //TODO: rspack.IgnorePlugin
    new rspack.IgnorePlugin({
      resourceRegExp: /\.d\.[cm]ts$/,
    }),

    // Case Sensitive Paths for OSX
    new CaseSensitivePathsPlugin(),

    // Detect modules with circular dependencies when bundling with webpack for `development` mode.
    ...createCircularDependencyPlugins(serveMode),

    // For css minify extractor, Note `"sideEffects": false,` of `package.json` will not emits a file (writes a file to the filesystem)
    new rspack.CssExtractRspackPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: `[name]/${getBundleFileName(
        'css',
        serveMode,
        bundleHashNameEnabled
      )}`,
      // the chunkFilename option can be a function for webpack@5
      chunkFilename: assertChunkFilename(
        evolveOptions,
        firstEntryMapItem,
        'css'
      ),
    }),

    // create builtin DefinePlugin
    ...createDefineVariablesPlugins(serveMode, evolveOptions),

    // clean webpack plugin
    ...createCleanPlugins(serveMode, entryMapItemList, evolveOptions),

    // Put ModuleFederationPlugin before html webpack plugin.
    ...createModuleFederationPlugins(
      serveMode,
      entryMapItemList,
      evolveOptions
    ),

    // Create all need html plugins
    ...createHtmlPlugins(serveMode, entryMapItemList, evolveOptions),

    // Create ts checker plugins
    ...createTsCheckerPlugins(serveMode, evolveOptions),
  ];

  // Indicates current we use `hot` mode for `webpack-dev-server` hot reload true.
  const enabledHmr = shouldEnableReactFastRefresh(
    serveMode,
    firstEntryMapItem,
    evolveOptions
  );

  if (enabledHmr) {
    // Applies the react-refresh Babel plugin on non-production modes only
    // Ensure `react-refresh/runtime` is hoisted and shared
    builtInPlugins.push(
      new ReactRefreshPlugin({
        // Always use webpack-dev-server `client` overlay!
        overlay: false,
        exclude: [/node_modules/],
      }) as unknown as RspackPlugin
    );
  }

  if (!enabledHmr && serveMode) {
    if (evolveOptions.devServer?.liveReload) {
      logger.warn(`The HMR disabled cause of "liveReload" specificed`);
    } else {
      logger.warn(
        `The HMR disabled cause of \`"moduleFederation":"${entryName}"\``
      );
    }
  }

  if (evolveOptions.openRsdoctor) {
    builtInPlugins.push(new RsdoctorRspackPlugin());
  }

  const extraPlugins = evolveOptions.rspack?.plugins?.external || [];
  return builtInPlugins.concat(extraPlugins);
};
