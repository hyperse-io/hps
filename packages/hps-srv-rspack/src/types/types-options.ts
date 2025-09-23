import type { TrustedEditor } from '@hyperse/inspector-common';
import { type HpsEvolveDevServerOptions } from './types-dev-server.js';
import { type EvolveEntryMap } from './types-entry-map.js';
import { type HpsEvolveRspackOptions } from './types-rspack.js';

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
  rspack: HpsEvolveRspackOptions;

  /**
   * The configurations of `dev-server`.
   */
  devServer?: HpsEvolveDevServerOptions;

  /**
   * All rspack entries configuration
   */
  entryMap: EvolveEntryMap;

  /**
   * For `production` mode, the value indicates if we interrupt compilation process while received "warnings" while evolve `build`
   * @default false
   */
  rejectWarnings?: boolean;

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
