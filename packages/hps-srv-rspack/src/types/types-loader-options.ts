import { type AcceptedPlugin } from 'postcss';
import type { PostcssPluginPixelOptions } from '@hyperse/hps-srv-rspack-plugin-postcss';
import type { LoaderContext } from '@rspack/core';

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
  modularImports?: Array<{
    /**
     * The library name to be imported. It should be the same as the library name in package.json.
     */
    libraryName: string;
    /**
     * The library directory to be imported.
     * @default 'lib'
     */
    libraryDirectory?: string;
    /**
     * The custom name to be imported.
     */
    customName?: string;
    /**
     * The style library directory to be imported.
     * If this is set, `style` option will be ignored
     */
    customStyleName?: string;
    /**
     * The style library directory to be imported.
     * @deprecated Recommended to use the css in js solution
     */
    style?: string | boolean;
    /**
     * The style library directory to be imported.
     */
    styleLibraryDirectory?: string;
    /**
     * The value indicates whether convert method name from camelCase to kebab cases
     * @example  `userName` => `user-name`
     * @default true
     */
    camelToDashComponentName?: boolean;
    /**
     * Set this option to false if your module does not have a default export.
     */
    transformToDefaultImport?: boolean;
    /**
     * The value indicates whether ignore es component
     */
    ignoreEsComponent?: string[];
    /**
     * The value indicates whether ignore style component
     */
    ignoreStyleComponent?: string[];
  }>;

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
   * The config options fro  `@hyperse/hps-srv-postcss-plugin-pixel`
   * If provider it will use default options of `hpsSrvPostcssPluginPixel`
   */
  pixelOptions?: false | Partial<PostcssPluginPixelOptions>;
}
