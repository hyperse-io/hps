import { ensureSlash } from '@hyperse/hps-srv-common';
import { type HpsEvolveOptions } from '../types/types-options.js';

/**
 * Try to normalize publicPath, if we have customized publicPath, should be converted to `https://cdn.example.com/assets/`, `/assets/`
 * @param evolveOptions
 * @returns `auto` or customizd publicPath
 */
export const resolvePublicPath = (evolveOptions: HpsEvolveOptions) => {
  const { rspack } = evolveOptions;

  let publicPath = 'auto';
  // If we have customized publicPath, should be converted to `https://cdn.example.com/assets/`, `/assets/`
  if (rspack?.publicPath && rspack.publicPath !== 'auto') {
    publicPath = ensureSlash(rspack.publicPath, true);
  }

  return publicPath;
};
