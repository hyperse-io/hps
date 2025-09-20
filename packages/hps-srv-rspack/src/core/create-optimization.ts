import { posix } from 'node:path';
import type { RspackOptions } from '@rspack/core';
import { devReactFastRefresh } from '../constants.js';
import { shouldEnableReactFastRefresh } from '../helpers/helper-should-enable-react-fast-refresh.js';
import type { EntryMapItem } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';
import { createMinimizers } from './minimizer/create-minimizers.js';

export const createOptimization = (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions,
  entryMapItem: EntryMapItem
): RspackOptions['optimization'] => {
  // Indicates current we use `hot` mode for `webpack-dev-server` hot reload true.
  const enabledHmr = shouldEnableReactFastRefresh(
    serveMode,
    entryMapItem,
    evolveOptions
  );

  const rspackOptimization: RspackOptions['optimization'] = {
    nodeEnv: serveMode ? 'development' : 'production',
    chunkIds: 'named',
    moduleIds: 'named',
    // Ensure `react-refresh/runtime` is hoisted and shared, Could be replicated via a vendors chunk
    // NOTE: This is only for `HMR` mode, if we have no `HMR` mode, we should not use this! it always be `false`
    runtimeChunk: enabledHmr
      ? {
          name: (entrypoint: { name: string }) => {
            return posix.join(entrypoint.name, devReactFastRefresh.runtime);
          },
        }
      : false,

    // This is true in production mode. Tell webpack to minimize the bundle using the TerserPlugin
    minimize: evolveOptions.rspack?.minimizer !== false && !serveMode,
    // Note: the `minimizer` will executed must be wait until `minimize` is `true`
    minimizer: createMinimizers(serveMode, evolveOptions.rspack),
    // Disabled WARNING in webpack while chunk exceed the recommended size limit for `serve`
    splitChunks: {
      // It is recommended to set splitChunks.name to false for production builds
      // so that it doesn't change names unnecessarily.
      name: false,
      // include all types of chunks
      // chunks: 'async',
      chunks: 'all',
      // 2.3841858(MB)
      minSize: 2500000,
      // disable vendors~loadsh.js...
      cacheGroups: {
        default: false,
        defaultVendors: false,
      },
    },
  };
  return rspackOptimization;
};
