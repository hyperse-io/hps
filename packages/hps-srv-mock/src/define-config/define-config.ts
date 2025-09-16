import type { DeepPartial } from '@hyperse/config-loader';
import {
  type ConfigEnvBase,
  defineConfig as myDefineConfig,
  type UserConfigExport,
} from '@hyperse/config-loader';
import { type requireResolve } from '@hyperse/hps-srv-common';
import { type HpsMockOptions } from '../types/types-options.js';

export interface MockConfigBase extends ConfigEnvBase {
  /**
   * The current project directory.
   */
  projectCwd: string;
  /**
   * Expose `env`.`resolve` to allow dynamic resolve `esm` node modules from `hps-evolve.config.ts`
   * @example
   * ```ts
   * export default defineConfig((env) => {
   *   console.log(env.resolve(import.meta.url, 'tailwindcss'));
   *   ...
   * }
   * // Note may you need to change `module` to `ESNext` at your `tsconfig.json`
   * `tsconfig.json`
   * {
   *   "module": "ESNext"
   * }
   * ```
   */
  resolve: typeof requireResolve;
}

type DefineConfigFn = (
  userConfig: UserConfigExport<DeepPartial<HpsMockOptions>, MockConfigBase>
) => UserConfigExport<DeepPartial<HpsMockOptions>, MockConfigBase>;

export const defineConfig: DefineConfigFn = (
  userConfig: UserConfigExport<DeepPartial<HpsMockOptions>, MockConfigBase>
) => {
  return myDefineConfig(userConfig);
};
