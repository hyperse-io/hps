import { type VerifyPackagePattern } from '@armit/package';
import type { TrustedEditor } from '@hyperse/inspector-common';
import { type HpsEvolveDevServerOptions } from './types-dev-server.js';
import { type EvolveEntryMap } from './types-entry-map.js';
import { type RuleSetLoaderOptions } from './types-loader-options.js';
import {
  type EvolveMultiCDNConfig,
  type EvolveMultiCDNEnvResolver,
} from './types-multi-html.js';
import { type EvolvePluginOptions } from './types-plugins.js';
import { type HpsEvolveRspackOptions } from './types-rspack.js';

/**
 * Detect locally installed dependencies that have correctly installed from `package.json` declared version `dependencies`
 */
export type PackageInstallChecker = {
  /**
   * @default false
   */
  enabled?: boolean;
  /**
   * Stop program if we have detect unexpected error.
   * @default false
   */
  throwError?: boolean;
  /**
   * Flat indicates if we need to print all install module graph
   * @default false
   */
  showAllInstalledGraph?: boolean;
  /**
   * Package module name, or module expression. [`^babel-`,`@dimjs/*`]
   * @defalt ['@dimjs/*']
   */
  detectModules?: string[];
};

export interface HpsEvolveOptions {
  /**
   * The project workspace directory.
   */
  projectCwd: string;

  /**
   * The virtual path for current `project`
   * e.g. `evolve/test`
   */
  projectVirtualPath: string;

  /**
   * The configurations of `rspack`
   */
  rspack?: HpsEvolveRspackOptions;

  /**
   * The config options of all rule set loaders.
   */
  loaderOptions: RuleSetLoaderOptions;

  /**
   * The configurations of `dev-server`.
   */
  devServer?: HpsEvolveDevServerOptions;

  /**
   * We can define multiple `CDN` for my project.
   * --
   * Note: We do not support `//` as prefix please use `https://` or `http://`
   */
  multiHtmlCdn: EvolveMultiCDNConfig;
  /**
   * Allow us customized to resolve current runtime environment.
   * ignore resolver if return undefined, otherwise use it to match environment.
   * NOTE:
   * 1. Don't using arrow function, because we will inject `envResolver` string to html.
   * 2. Don't use multiHtmlCdnEnvResolver(url) {} directly
   * 3. Always use `function` keyword to define `envResolver` function.
   * @example
   * ```ts
   * //
   *  multiHtmlCdnEnvResolver: function envResolver(url) {
   *    const env = /.*\.(qa|t)\.*\/.exec('//fex.qa.tcshuke.com/')[1];
   *    switch(env) {
   *      case 't':
   *       return 'rc'
   *      case 'qa':
   *       return 'inte'
   *    }
   *   }
   * ```
   */
  multiHtmlCdnEnvResolver?: EvolveMultiCDNEnvResolver;
  /**
   * The regexp patterns to filter dependencies(will be verified) from package.json
   * @default {}
   */
  needVerifyPackages?: false | VerifyPackagePattern;
  /**
   * Detect locally installed dependencies that have correctly installed from `package.json`
   */
  packageInstallChecker?: false | PackageInstallChecker;
  /**
   * All rspack entries configuration
   */
  entryMap: {
    [K in keyof EvolveEntryMap]: Omit<EvolveEntryMap[K], 'groupingSource'>;
  };

  /**
   * For `production` mode, the value indicates if we interrupt compilation process while received "warnings" while evolve `build`
   * @default false
   */
  rejectWarnings?: boolean;

  /**
   * Control whether each entry is built independently.
   *
   * If `true`, each entry will be built independently.
   *
   * If `false`, each entries are grouped according to certain rules
   *
   * @default false
   */
  isolation?: boolean;

  /**
   * The maximum size of an entry group.
   *
   * @default 100
   */
  maxEntryGroupSize?: number;

  /**
   * Whether to open the rs-evolve doctor plugin.
   * @default false
   */
  openRsdoctor?: boolean;

  /**
   * The options of code inspector.
   *
   * If `serveMode` is `false`, it will be ignored. and close code inspector.
   *
   */
  inspector?:
    | false
    | {
        /**
         * Inspector Component toggle hotkeys,
         *
         * @default - `['$mod', 'i']` on macOS, `['Ctrl', 'i']` on other platforms.
         *
         */
        keys?: string[];

        /**
         * Whether to automatically inject the code inspector client entry.
         * @default true
         */
        injectClient?: boolean;

        /**
         * The base path of the launch editor endpoint.
         * @default '/__hps_inspector'
         */
        customLaunchEditorEndpoint?: string;

        /**
         * The trusted editors that can be launched from browser.
         * @default 'code'
         */
        trustedEditor?: `${TrustedEditor}`;
      };
}
