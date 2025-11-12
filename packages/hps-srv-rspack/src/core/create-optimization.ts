import type { RspackOptions } from '@rspack/core';
import type { HpsEvolveOptions } from '../types/types-options.js';
import { createMinimizers } from './minimizer/create-minimizers.js';

export const createOptimization = (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions
): RspackOptions['optimization'] => {
  const rspackOptimization: RspackOptions['optimization'] = {
    nodeEnv: serveMode ? 'development' : 'production',
    chunkIds: 'named',
    moduleIds: 'named',
    runtimeChunk: false,
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
