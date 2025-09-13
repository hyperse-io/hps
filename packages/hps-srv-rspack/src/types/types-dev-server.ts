import { type RequestHandler } from 'express';
import {
  type ClientConfiguration,
  type WebSocketURL,
} from 'webpack-dev-server';
import {
  type HpsMockOptions,
  type SecureContextHttps,
} from '@hyperse/hps-srv-mock';
import type { DevServer } from '@rspack/core';
import type { EvolveEntryMapContent } from './types-entry-map.js';

export type RspackMiddleware = Parameters<
  Required<DevServer>['setupMiddlewares']
>[0];

export interface WebpackWatchOptions {
  /**
   * Delay the rebuilt after the first change. Value is a time in ms.
   */
  aggregateTimeout?: number;

  /**
   * Resolve symlinks and watch symlink and real file. This is usually not needed as webpack already resolves symlinks ('resolve.symlinks').
   */
  followSymlinks?: boolean;

  /**
   * Ignore some files from watching
   */
  ignored?: string[];

  /**
   * Enable polling mode for watching.
   */
  poll?: number | boolean;
}

export type HpsEvolveDevServerOptions = {
  /**
   * must have prefix slash `/`
   * @default `/pages`
   */
  pageProxy?: string;

  /**
   * Allow us provider customized middlewares for `page`, `modules`
   */
  middlewares?: RequestHandler[];

  /**
   * Turn on watch mode. This means that after the initial build, webpack will continue to watch for changes in any of the resolved files.
   * In webpack-dev-server watch mode is enabled by default.
   * This configuration will be merged into `webpack-dev-server`
   */
  watchOptions?: WebpackWatchOptions;

  /**
   * Provides the ability to execute a custom function and apply custom middleware(s).
   * https://webpack.js.org/configuration/dev-server/#devserversetupmiddlewares
   * @default []
   */
  devBeforeMiddlewares?: RspackMiddleware[];
  /**
   * Provides the ability to execute a custom function and apply custom middleware(s).
   * https://webpack.js.org/configuration/dev-server/#devserversetupmiddlewares
   * @default []
   */
  devAfterMiddlewares?: RspackMiddleware[];

  /**
   * Allow us costomized global serve data injected into `window.GLOBAL = {...globalData}`
   */
  defaultServeGlobalData?: (
    entryItem: EvolveEntryMapContent,
    hostUrl: string
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;

  /**
   * Allow us customized `styles`, `scripts` bundle path lookup resolver
   * The full directory path such as '/public/${virtualPath}/${entryName}/bundle.js'`
   * @default `(dir)=>dir`
   * @returns
   */
  bundleDirResolver?: (
    /**
     * The default normalized dir path
     */
    dir: string,
    /**
     * The resolver parameters
     * @param data.currEntry ddd
     */
    data: {
      /**
       * The current entry
       */
      currEntry: string;
      /**
       * The project virtual path
       */
      projectVirtualPath: string;
      /**
       * The value indicates if current module is `static` or `served` module.
       */
      isServedModule: boolean;
    }
  ) => string;

  /**
   * The value indicates if we will auto open broswers page for `serve`
   * @default true
   */
  autoOpen?: boolean;

  /**
   * Enables reload/refresh the page(s) when file changes are detected (`auto` by default).
   * @default undefined
   */
  liveReload?: true;

  /**
   * Enables a full-screen overlay in the browser when there are compiler errors or warnings.
   * @default {
   *   errors: true,
   *   warnings: false,
   * }
   */
  clientOverlay?: ClientConfiguration['overlay'];

  /**
   * This option allows specifying URL to web socket server (useful when you're proxying dev server and client script does not always know where to connect to).
   * @example use `localIp` for remote mobile devices HMR it will convert to local ip `ws://10.10.100.3/ws`
   * @example use  `{ hostname: '0.0.0.0' }`, will get 'auto://0.0.0.0:0/ws'
   */
  webSocketURL?: WebSocketURL | 'localIp';

  /**
   * The customized config options of `flatjs/mock`, it will override options `flatjs-mock.config.ts`
   */
  mockOptions?: Omit<HpsMockOptions, 'projectCwd'>;

  /**
   * Provide your own certificate using the https option
   */
  https?: SecureContextHttps;
};

export type EvolveDevServerEntryMap = {
  /**
   * entryName: `home`
   */
  [entryName: string]: {
    /**
     * entryMapItem config options.
     */
    entryConfig: EvolveEntryMapContent;
    /**
     * dev server port number
     */
    devServerPort: number;
    /**
     * dev server host uri.
     */
    devServerHostUri: string;
    /**
     * entryName: `home` should be normallized to ${`projectVirtualPath`}/home
     */
    normalizedEntryName: string;
  };
};
