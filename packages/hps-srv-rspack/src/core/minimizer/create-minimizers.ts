import { logger } from '@hyperse/hps-srv-common';
import { LightningCssMinimizerRspackPlugin, type Plugins } from '@rspack/core';
import type { HpsEvolveRspackOptions } from '../../types/types-rspack.js';
import { imageMinimizer } from './image-minimizer.js';
import { terserMinimizer } from './terser-minimizer.js';

export const createMinimizers = (
  serveMode: boolean,
  rspackOptions?: HpsEvolveRspackOptions
): Plugins => {
  const minimizers: Plugins = [];
  if (serveMode) {
    logger.debug('Ignore minimizer plugin for `serve` mode');
    return minimizers;
  }

  if (rspackOptions?.minimizer === false) {
    logger.info('Note `minimizer` has been disabled for now');
    return minimizers;
  }

  //lightningcss-loader replace cssnano
  minimizers.push(
    new LightningCssMinimizerRspackPlugin({
      removeUnusedLocalIdents: false,
    })
  );

  if (rspackOptions?.minimizer?.imageMin) {
    const imageMinPlugin = imageMinimizer();
    if (imageMinPlugin) {
      minimizers.push(imageMinPlugin);
    }
  }
  // Allow to disable terser minimizer. or customized terser options.
  if (rspackOptions?.minimizer?.terserOptions === false) {
    return minimizers;
  }

  const terserPlugin = terserMinimizer(
    rspackOptions?.minimizer?.terserOptions || {}
  );
  minimizers.push(terserPlugin);

  return minimizers;
};
