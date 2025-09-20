import type { Configuration } from '@rspack/core';
import type { ModuleFederationOptions } from './types-federation.js';
import type { MultiHtmlCDNEntryItem } from './types-multi-html.js';

/**
 * The configuration options for each entry item.
 */
export interface EvolveEntryItemOption extends MultiHtmlCDNEntryItem {
  /**
   * The value indicates if we need to Px convert to rem.
   * @default entryItemOption?.allowPx2rem ?? pluginLoaderOptions?.pixelOptions?.enabled
   */
  allowPx2rem?: boolean;

  /**
   * Specify dependencies that shouldn't be resolved by webpack, but should become dependencies of the resulting bundle. The kind of the dependency depends on `output.libraryTarget`.
   * Note It will merged with globall externals configuration and apply for current entry compiler
   */
  externals?: Record<string, string>;

  /**
   * If all we use `contenthash` bundle name.
   * @default true
   */
  enableBundleHashName?: boolean;

  /**
   * Allow customized module `link` on `/pages`
   * @default undefined
   */
  servePageMainLinkFn?: (
    link: string,
    options: {
      entryName: string;
      hostUri: string;
      virtualPath: string;
    }
  ) => string;
  /**
   * For `serve`
   * Attach fixed global data for specificed entry.
   * Will merged into `window.GLOBAL = {...globalData}`
   * @default {}
   */
  serveGlobalData?: Record<string, unknown>;
  /**
   * Multiple separate builds should form a single application.
   * This is often known as Micro-Frontends, but is not limited to that.
   */
  moduleFederation?: ModuleFederationOptions;

  /**
   * The value indicates if we need to build relative asset public path?
   * @default false
   */
  useRelativeAssetPath?: boolean;

  /**
   * The filter will try filter which mock defs files will be loaded for this `entryItem` while `serve`.
   * @default undefined
   */
  mockFilters?: Array<string | RegExp>;

  /**
   * Extends the default `output` configuration for each entry item, normally we use `output.library` to define the global variable name.
   * Note we don't need to support react fast refresh for library target. because of the library module can not run in the browser individually.
   * @example
   * ```ts
   *'plugin-chart': {
   *   entry: [`./src/plugin-chart/index`],
   *   options: {
   *     output: {
   *       library: {
   *         name: 'dashboardPluginChart',
   *         type: 'var',
   *       },
   *       libraryTarget: 'window',
   *     },
   *   },
   * }
   * ```
   * @default undefined
   */
  output?: Omit<
    Required<Configuration>['output'],
    'chunkFilename' | 'cssChunkFilename'
  >;
}

export type EvolveEntryMapContent = {
  entry: string[];
  options?: EvolveEntryItemOption;
  /**
   * An alias used when grouping builds
   */
  groupName?: string;

  /**
   * The basis of the grouping, this configuration takes effect when re-entering a group
   *
   * If groupingSource is `manual`, The grouping depends on the manually set groupName
   *
   * If groupingSource is `auto`, Grouping depends on whether the entry options are the same
   *
   * @default 'auto'
   */
  groupingSource?: 'auto' | 'manual';

  /**
   * The base path of the entry module
   */
  entryModuleBase?: string[];
};

export interface EvolveEntryMap {
  /**
   * <entryChunkName>: {}
   */
  [entryName: string]: EvolveEntryMapContent;
}

export type EntryMapItem = [string, EvolveEntryMapContent];
