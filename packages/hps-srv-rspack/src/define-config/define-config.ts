import type {
  ConfigEnvBase,
  DeepPartial,
  UserConfigExport,
} from '@hyperse/config-loader';
import { defineConfig as myDefineConfig } from '@hyperse/config-loader';
import { type requireResolve } from '@hyperse/hps-srv-common';
import type { HpsEvolveOptions } from '../types/types-options.js';

export interface EvolveConfigBase extends ConfigEnvBase {
  /**
   * The current project directory.
   */
  projectCwd: string;
  /**
   * The command of the current process.
   */
  command: 'build' | 'serve' | 'static';
  /**
   * Expose `env`.`resolve` to allow dynamic resolve `esm` node modules from `flatjs-evolve.config.ts`
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
  userConfig: UserConfigExport<DeepPartial<HpsEvolveOptions>, EvolveConfigBase>
) => UserConfigExport<DeepPartial<HpsEvolveOptions>, EvolveConfigBase>;

export const defineConfig: DefineConfigFn = (
  userConfig: UserConfigExport<DeepPartial<HpsEvolveOptions>, EvolveConfigBase>
) => {
  return myDefineConfig(userConfig);
};
