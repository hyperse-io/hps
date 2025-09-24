import { requireResolve } from '@hyperse/hps-srv-common';
import type { RuleSetRule } from '@rspack/core';
import { type EntryMapItem } from '../../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { ruleCss } from './rule-css.js';

/**
 * Preparing configurations for `less-loader`
 * @param serveMode The value indicates if we are in `built` or `serve` mode.
 * @param pluginLoaderOptions `builtin` loaders
 * @example
 * ```ts
 * `~` makes the url an module
 * webpack: {
 *   externals: {
 *     antd: 'antd',
 *     dayjs: 'dayjs',
 *   },
 *   resolve: {
 *     alias: {
 *       '@': resolve(projectCwd, './src'),
 *     },
 *   },
 * },
 * `@import '~@/theme/default.less';` at `src/theme/default.less`
 *
 * ```
 */
export const ruleLess = (
  serveMode: boolean,
  entryMapItem: EntryMapItem,
  evolveOptions: HpsEvolveOptions
): RuleSetRule => {
  const ruleSet: RuleSetRule = ruleCss(serveMode, entryMapItem, evolveOptions);
  ruleSet.test = /\.less$/i;
  // The Options for Less.
  const lessOptions = evolveOptions.rspack.loader.lessOptions;

  if (Array.isArray(ruleSet.use)) {
    ruleSet.use.push({
      loader: requireResolve(import.meta.url, 'less-loader'),
      options: {
        sourceMap: serveMode,
        lessOptions: {
          sourceMap: serveMode,
          javascriptEnabled: true,
          ...lessOptions,
        },
      },
    });
  }
  return ruleSet;
};
