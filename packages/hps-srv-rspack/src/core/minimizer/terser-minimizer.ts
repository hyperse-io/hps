import { mergeOptions } from '@hyperse/hps-srv-common';
import type { SwcJsMinimizerRspackPluginOptions } from '@rspack/core';
import { type Plugin, SwcJsMinimizerRspackPlugin } from '@rspack/core';

/**
 * https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
 */
export const terserMinimizer = (
  terserOptions: SwcJsMinimizerRspackPluginOptions
): Plugin => {
  const defaultMinimizerRspackOptions: SwcJsMinimizerRspackPluginOptions['minimizerOptions'] =
    {
      compress: {
        ecma: undefined,
        // Note `mangle.properties` is `false` by default.
        module: false,
        toplevel: false,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
      },
      // Note `mangle.properties` is `false` by default.
      mangle: true,
      module: false,
      format: {
        ecma: undefined,
        // Note `mangle.properties` is `false` by default.
        safari10: false,
      },
    };

  return new SwcJsMinimizerRspackPlugin({
    extractComments: false,
    minimizerOptions: mergeOptions(defaultMinimizerRspackOptions, {
      ...(terserOptions?.minimizerOptions ?? {}),
    }),
  });
};
