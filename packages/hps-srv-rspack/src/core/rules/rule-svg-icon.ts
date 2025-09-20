import { getDirname } from '@armit/file-utility';
import type { RuleSetRule } from '@rspack/core';
import { isIconSvg } from './rule-utils.js';

/**
 * Preparing svg loader for `icons`
 * Note we must be put all *.svg into folder `icons`
 */
export const ruleSvgIcon = (): RuleSetRule => {
  const loader: RuleSetRule = {
    test(resource) {
      return isIconSvg(resource);
    },
    use: [
      {
        // FIXME: we need to always keep the directory structures here to make sure correct loader path resolve.
        loader: getDirname(import.meta.url, '../../loaders/loader-icon.cjs'),
        options: {
          svgo: {
            plugins: [{ name: 'removeTitle' }, { name: 'removeDimensions' }],
          },
        },
      },
    ],
  };
  return loader;
};
