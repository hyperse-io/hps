import { type AcceptedPlugin } from 'postcss';
import { type TransformOptions } from '@babel/core';
import { type PostcssPluginPixelOptions } from '@flatjs/forge-postcss-plugin-pixel';
import type { LoaderContext } from '@rspack/core';
import { type ModularImportOption } from './types-modular-import.js';

export type BabelInputOptions = Pick<TransformOptions, 'presets' | 'plugins'>;

/**
 * Builtin babel options, provider default `builin` presets.
 * can be override by customized `presets` & `plugins`
 */
export type BuiltinBabelOptions = BabelInputOptions & {
  /**
   * extra babel `plugins` or `presets`
   * @default `react`
   */
  usePreset?: 'react' | 'vue';
};

/**
 * The configurations for `css-loader` modules
 * https://github.com/webpack-contrib/css-loader/blob/master/README.md#modules
 */
export type CssLoaderModules =
  | boolean
  | 'local'
  | 'global'
  | 'pure'
  | 'icss'
  | Partial<{
      auto: boolean | RegExp | ((resourcePath: string) => boolean);
      mode:
        | 'local'
        | 'global'
        | 'pure'
        | 'icss'
        | ((resourcePath: string) => 'local' | 'global' | 'pure' | 'icss');
      localIdentName: string;
      localIdentContext: string;
      localIdentHashSalt: string;
      localIdentHashFunction: string;
      localIdentHashDigest: string;
      localIdentRegExp: string | RegExp;
      getLocalIdent: (
        context: LoaderContext<any>,
        localIdentName: string,
        localName: string
      ) => string;
      namedExport: boolean;
      exportGlobals: boolean;
      exportLocalsConvention:
        | 'as-is'
        | 'camel-case'
        | 'camel-case-only'
        | 'dashes'
        | 'dashes-only'
        | ((name: string) => string);
      exportOnlyLocals: boolean;
      getJSON: ({
        resourcePath,
        imports,
        exports,
        replacements,
      }: {
        resourcePath: string;
        imports: object[];
        exports: object[];
        replacements: object[];
      }) => Promise<void> | void;
    }>;

export type CssLoaderOptions = {
  modules?: CssLoaderModules;
} & Record<string, unknown>;

/**
 * The configurations for `builtin` rule set options
 */
export interface RuleSetLoaderOptions {
  /**
   * Now webpack will automatically choose between resource and inline by following
   * a default condition: a file with size less than 8kb will be treated as a inline module type and resource module type otherwise.
   * @default `4 * 1024` (4KB)
   */
  assetDataUrlMaxSize?: number;

  /**
   * The configurations of `css-loader`
   * https://github.com/webpack-contrib/css-loader/blob/master/README.md#modules
   */
  cssLoaderOptions?: CssLoaderOptions;

  /**
   * The config for `Less`
   */
  lessOptions?: Record<string, unknown>;

  /**
   * Modular import plugin for babel, compatible with antd, antd-mobile, lodash, material-ui, and so on.
   * @default []
   */
  modularImports?: ModularImportOption[];

  /**
   * The configration options of `postcss-loader`
   */
  postcssOptions?: {
    /**
     * The overrided configurations of `cssnano-preset-default`
     * sometimes we need to disabled some rules for `default cssnano preset`
     * @link https://www.npmjs.com/package/cssnano-preset-default
     * @example
     * Disable `postcss-minify-font-values` rule to avoid transitions from `font-weight:bold` to `font-weight:700`
     * ```json
     * cssnanoOptions: { minifyFontValues: false }
     * ```
     */
    cssnanoOptions?: Record<string, unknown>;
    /**
     * Allow to extends extra plugins of `postcss-loader`
     * @example `env.resolve(import.meta.url, '@tailwindcss/postcss'),
     */
    plugins?: Array<
      AcceptedPlugin | string | [string, Record<string, unknown>]
    >;
  };

  /**
   * The babel options for `babel-loader`
   */
  babelOptions?: BuiltinBabelOptions;

  /**
   * The config options fro `@flatjs/forge-postcss-plugin-plugin`
   * If provider it will use default options of `forgePostcssPluginPixel`
   */
  pixelOptions?: false | Partial<PostcssPluginPixelOptions>;
}
