import type {
  Configuration,
  LazyCompilationOptions,
  ModuleOptions,
  RuleSetRule,
  SwcJsMinimizerRspackPluginOptions,
} from '@rspack/core';
import type { EvolvePlugins } from './types-plugins.js';

/**
 * The rspack entry configuration.
 */
export interface RspackEntryObject {
  [index: string]: string[];
}

export interface HpsEvolveRspackOptions
  extends Pick<Configuration, 'infrastructureLogging'> {
  /**
   * Options for the performance hints.
   */
  performance?:
    | false
    | {
        /**
         * Filter function to select assets that are checked.
         */
        assetFilter?: (name: string, source?: any, assetInfo?: any) => boolean;
        /**
         * Sets the format of the hints: warnings, errors or nothing at all.
         */
        hints?: false | 'error' | 'warning';

        /**
         * File size limit (in bytes) when exceeded, that rspack will provide performance hints.
         */
        maxAssetSize?: number;

        /**
         * Total size of an entry point (in bytes).
         */
        maxEntrypointSize?: number;
      };

  /**
   * Options for the stats.
   */
  stats?: Omit<Configuration['stats'], 'preset'> & {
    /**
     * Sets the preset for stats or enables/disables them.
     */
    preset?:
      | boolean
      | 'normal'
      | 'none'
      | 'verbose'
      | 'errors-only'
      | 'errors-warnings'
      | 'minimal'
      | 'detailed'
      | 'summary';
  };

  /**
   * These options change how modules are resolved.
   */
  resolve?: Omit<Configuration['resolve'], 'fallback'> & {
    /**
     * Only allow pass `key:value` alias `{'@xxx':'./src/xxx'}`
     * Note: Usually you don't need to specify an alias, the framework will auto support `paths` alias of tsconfig.json
     * less `@import` is also supported via `paths` of tsconfig.json only need to with prefix `~`
     * @example
     * ```less
     * //@import '~@/utils/xxx.less'`
     * //@import url('./child.less');`
     * //@import url('~@/react/less/alias.less');
     * //@import '~@/react/less/alias2.less';
     * //@import '~@/utils/shared.less';
     * ```
     */
    alias?: Record<string, string>;

    /**
     * Redirect module requests when normal resolving fails.
     *
     * Compatible with both rspack and webpack, using intersection of their types.
     */
    fallback?: {
      [x: string]: string | false | string[];
    };
  };

  /**
   * Specify the default type of externals.
   * @example `externalsType: 'window'`
   */
  externalsType?: Configuration['externalsType'];

  /**
   * @default {}
   *
   * @example
   * ```ts
   * // For React 18 support, manually add:
   * externals: () => ({
   *   vue: 'Vue',
   *   react: 'React',
   *   'react-dom': 'ReactDOM',
   * })
   * ```
   *
   * If use function, it will be override default externals.
   * Note: React 19 is supported by default, no need to configure externals for React.
   * For React 18 support, you need to manually add the externals configuration.
   */
  externals?: Record<string, string> | (() => Record<string, string>);

  /**
   * output.publicPath defaults to 'auto' with web and web-worker targets
   * @default 'auto'
   */
  publicPath?: string;
  /**
   *
   * Note if we build `node` using webpack, in order to ignore built-in modules like path, fs, etc.
   * maybe we need to use `webpack-node-externals'` to configuration `externals`
   * Now webpack-dev-server have not follow webpack@5 `browserslist` changes
   * Environment to build for. An array of environments to build for all of them when possible.
   * @default  ['web', 'es5'],
   */
  target?: string | false | string[];

  /**
   * Minimizer(s) to use for minimizing the output. for `serve` mode, `minimize` always `false`.
   * @default `terser` minimizer has been enabled fro `production`
   */
  minimizer?:
    | false
    | {
        /**
         * Allow to disable terser minimizer. or customized terser options.
         * use SwcJsMinimizerRspackPlugin
         */
        terserOptions?: false | SwcJsMinimizerRspackPluginOptions;
        /**
         * @default false
         */
        imageMin?: boolean;
      };

  /**
   * A developer tool to enhance debugging (false | eval | [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map).
   * https://rspack.rs/config/devtool
   * @default `false`
   */
  sourceMap?: 'hidden-source-map' | 'source-map' | false;

  /**
   * The rule sets loaders config options
   */
  ruleSets?: Array<
    Omit<RuleSetRule, 'test'> & {
      test?: string | RegExp | ((value: string) => boolean);
    }
  >;

  /**
   * The plugins config options
   */
  plugins?: EvolvePlugins;

  /**
   * `contentehash` bundle file name.
   * @default true
   */
  enableBundleHashName?: boolean;

  /**
   * The output directory as absolute path, Note we must keep custom outputDir with prefix `public`
   * e.g. `public/a/b`, `public/c/d`, don't support `a/b`.
   * @default `public`
   */
  outputDir?: string | (() => string | Promise<string>);

  /**
   * The virtual path prefix for output chunk files.
   * The actual chunk file name will be: `${chunkFileVirtualPath}/${chunkFilename}`
   * For example: if chunkFileVirtualPath = 'runtime-chunks' and chunkFilename = '[id].js',
   * the final output path will be 'runtime-chunks/[id].js'.
   */
  chunkFileVirtualPath?: string;

  /**
   * The extra module options for rspack.
   *
   * @see {@link https://rspack.rs/zh/config/module}
   */
  module?: Omit<ModuleOptions, 'rules'>;

  /**
   * The extra optimization options for rspack.
   *
   * @see {@link https://rspack.rs/zh/config/optimization}
   */
  lazyCompilation?: LazyCompilationOptions;
}
