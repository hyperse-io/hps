import type { ConfigEnvBase, UserConfigExport } from '@hyperse/config-loader';
import { type requireResolve } from '@hyperse/hps-srv-common';

export interface EvolveConfigBase extends ConfigEnvBase {
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

export type DefineConfigFn<T> = (
  userConfig: UserConfigExport<T, EvolveConfigBase>
) => UserConfigExport<T, EvolveConfigBase>;
