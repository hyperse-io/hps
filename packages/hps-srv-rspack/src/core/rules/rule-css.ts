import { type AcceptedPlugin } from 'postcss';
import { requireResolve } from '@hyperse/hps-srv-common';
import type { PostcssPluginPixelOptions } from '@hyperse/hps-srv-postcss-plugin-pixel';
import { hpsSrvPostcssPluginPixel } from '@hyperse/hps-srv-postcss-plugin-pixel';
import { CssExtractRspackPlugin, type RuleSetRule } from '@rspack/core';
import { allowPx2remForModule } from '../../helpers/helper-allow-px2rem-for-module.js';
import { type EntryMapItem } from '../../types/types-entry-map.js';
import {
  type CssLoaderOptions,
  type RuleSetLoaderOptions,
} from '../../types/types-loader-options.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';

/**
 * Normalize postcss-loader options.
 * @param serveMode The value indicates if we are in `built` or `serve` mode.
 * @param pixelOptions The pixel options of `postcss` plugin
 */
const getPostcssOptions = (
  pixelOptions: false | PostcssPluginPixelOptions = {},
  postcssOptions: RuleSetLoaderOptions['postcssOptions'] = {}
) => {
  //FIXME: cssnano options is not supported yet
  const postCssPlugins: Array<
    AcceptedPlugin | string | [string, Record<string, unknown>]
  > = postcssOptions.plugins || [];

  if (pixelOptions !== false) {
    postCssPlugins.push(hpsSrvPostcssPluginPixel(pixelOptions));
  }

  return {
    plugins: postCssPlugins,
  };
};

/**
 * Actually, style-loader is the one that is responsible for CSS HMR
 * https://github.com/webpack-contrib/style-loader/blob/master/src/index.js#L31-L42
 * @param serveMode
 * @param entryMapItem
 * @param evolveOptions `builtin` loaders
 */
export const ruleCss = (
  serveMode: boolean,
  entryMapItem: EntryMapItem,
  evolveOptions: HpsEvolveOptions,
  useCssModule = false
): RuleSetRule => {
  // The value indicates we will enable px2rem using `@hyperse/hps-srv-postcss-plugin-pixel`
  const {
    pixelOptions,
    cssLoaderOptions = {},
    postcssOptions,
  } = evolveOptions.loaderOptions;

  const { modules, ...restCssLoaderOptions } = cssLoaderOptions;
  // automatically enable css modules for files with .module.css extension
  const cssLoaderOfCssModules: CssLoaderOptions = !useCssModule
    ? { modules: false }
    : {
        modules: Object.assign(
          {
            // keep empty to allow user customized css modules options.
            // Depends on the value of the esModule option. If the value of the esModule options is true, this value will also be true, otherwise it will be false.
            // For now give default value `false` to allow import css module via `import styles from './stye.module.css'`, if we want to use named exports we can set it to `true` via `hps.config.ts`
            namedExport: false,
          },
          modules
        ),
      };

  const ruleSet: RuleSetRule = {
    test: /\.css$/i,
    use: [
      {
        loader: CssExtractRspackPlugin.loader,
        options: {
          // https://github.com/webpack-contrib/mini-css-extract-plugin/releases/tag/v1.0.0
          // https://github.com/webpack-contrib/css-loader/blob/master/README.md#modules
          esModule: true,
        },
      },
      {
        loader: requireResolve(import.meta.url, 'css-loader'),
        options: {
          sourceMap: serveMode,
          ...cssLoaderOfCssModules,
          ...restCssLoaderOptions,
        },
      },
    ],
  };

  if (useCssModule) {
    ruleSet.include = /\.module\.css$/i;
  } else {
    ruleSet.exclude = /\.module\.css$/i;
  }

  const isAllowPx2Rem = allowPx2remForModule(entryMapItem, evolveOptions);

  if (Array.isArray(ruleSet.use)) {
    const postCssOption = getPostcssOptions(
      isAllowPx2Rem ? pixelOptions : false,
      postcssOptions
    );
    ruleSet.use.push({
      loader: requireResolve(import.meta.url, 'postcss-loader'),
      options: {
        postcssOptions: {
          ...postCssOption,
          // Removes the need to lookup and load external config files ( `postcss.config.cjs`...) multiple times during compilation.
          config: false,
        },
        sourceMap: serveMode,
      },
    });
  }
  return ruleSet;
};
